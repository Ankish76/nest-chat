import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import { DateResolver, DateTimeResolver } from 'graphql-scalars';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import DirectivePlugin from '@pothos/plugin-directives';
import PrismaUtils from '@pothos/plugin-prisma-utils';
import { Context } from '../types';
import RelayPlugin from '@pothos/plugin-relay';
import { decodeGlobalID, encodeGlobalID } from '../utils/idParser';
import { PrismaClient } from '@prisma/client';
// import SmartSubscriptionsPlugin, {
//   subscribeOptionsFromIterator,
// } from '@pothos/plugin-smart-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export interface SchemaBuilderConfig {
  Context: Context;
  PrismaTypes: PrismaTypes;
  Directives: {
    upperCase: {
      locations: 'FIELD_DEFINITION';
    };
  };
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
  };
  smartSubscriptions: {
    debounceDelay: number | null;
    subscribe: (
      name: string,
      context: Context,
      cb: (err: unknown, data?: unknown) => void,
    ) => Promise<void> | void;
    unsubscribe: (name: string, context: Context) => Promise<void> | void;
  };
}

export interface SchemaBuilderOption {
  prisma: PrismaClient;
  pubsub: RedisPubSub;
}

export const createBuilder = ({ prisma, pubsub }: SchemaBuilderOption) => {
  const builder = new SchemaBuilder<SchemaBuilderConfig>({
    plugins: [
      DirectivePlugin,
      PrismaPlugin,
      PrismaUtils,
      RelayPlugin,
      // SmartSubscriptionsPlugin,
    ],
    useGraphQLToolsUnorderedDirectives: true,
    relayOptions: {
      idFieldName: 'id',
      clientMutationId: 'omit',
      cursorType: 'String',
      nodeQueryOptions: false,
      nodesQueryOptions: false,
      encodeGlobalID,
      decodeGlobalID,
    },
    // smartSubscriptions: {
    //   ...subscribeOptionsFromIterator((name, context) => {
    //     return pubsub.asyncIterator(name);
    //   }),
    // },
    prisma: {
      client: prisma,
    },
  });

  // in GraphQL the Query type and Mutation type can each only be called once. So we call it here and will add fields to them on the go
  builder.queryType();
  builder.mutationType();
  builder.subscriptionType();

  // This is where we've created the new date scalar
  builder.addScalarType('Date', DateResolver, {});
  builder.addScalarType('DateTime', DateTimeResolver, {});
  return builder;
};

export type Builder = ReturnType<typeof createBuilder>;
