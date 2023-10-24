import { writeFileSync } from 'fs';
import { printSchema, lexicographicSortSchema } from 'graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import type { GqlModuleOptions } from '@nestjs/graphql';
import { SchemaBuilderToken } from './constants';
import { directivesTransformers } from 'src/directives';
import { getSessionUser } from 'src/utils/session';
import { initContextCache } from '@pothos/core';

@Injectable()
export class PothosApolloDriver extends ApolloDriver {
  private readonly logger = new ConsoleLogger(PothosApolloDriver.name);
  constructor(private readonly modulesContainer: ModulesContainer) {
    super(modulesContainer);
  }

  start(options: GqlModuleOptions<any>): Promise<void> {
    let schemaBuilder: InstanceWrapper | null = null;

    for (const mod of this.modulesContainer.values()) {
      schemaBuilder = Array.from(mod.providers.values()).find(
        ({ token }) => token === SchemaBuilderToken,
      )!;

      if (schemaBuilder) {
        break;
      }
    }

    if (!schemaBuilder) {
      throw Error('Cannot get provided builder as SchemaBuilderToken.');
    }
    const schema = directivesTransformers(schemaBuilder.instance.toSchema());
    if (
      process.env.NODE_ENV === 'development' ||
      (!(global as any).printSchema && process.env.NODE_ENV === 'test')
    ) {
      this.logger.log('Printing schema......');
      const schemaAsString = printSchema(lexicographicSortSchema(schema));
      writeFileSync('./src/generated/schema.graphql', schemaAsString);
      (global as any).printSchema = true;
      this.logger.log('Schema Printed......');
    }
    return super.start({
      ...options,
      allowBatchedHttpRequests: true,
      context: ({ req, res }) => {
        let initContext = {};
        if (options.context) {
          if (typeof options.context !== 'function') {
            initContext = options.context;
          } else {
            initContext = options.context({ req, res });
          }
        }
        return {
          ...initContext,
          req,
          res,
          user: getSessionUser(req),
          ...initContextCache(),
          // get getLoader() {
          //   return <K, V>(ref: LoadableRef<K, V, Context>) => ref.getDataloader(this);
          // },
          // get load() {
          //   return <K, V>(ref: LoadableRef<K, V, Context>, id: K) =>
          //     ref.getDataloader(this).load(id);
          // },
          // get loadMany() {
          //   return <K, V>(ref: LoadableRef<K, V, Context>, ids: K[]) =>
          //     rejectErrors(ref.getDataloader(this).loadMany(ids));
          // },
        };
      },
      // TODO: apply schema transform (e.g. using mapSchema)
      schema,
    });
  }
}
