// import { DirectiveLocation } from '@pothos/plugin-directives';
// import { LoadableRef } from '@pothos/plugin-dataloader';
// import DataLoader from 'dataloader';

export type ISessionUser = {
  id: string;
  name: string;
};
export type Context = {
  user?: ISessionUser | null;
  // getLoader: <K, V>(ref: LoadableRef<K, V, Context>) => DataLoader<K, V>; // helper to get a loader from a ref
  // load: <K, V>(ref: LoadableRef<K, V, Context>, id: K) => Promise<V>; // helper for loading a single resource
  // loadMany: <K, V>(
  //   ref: LoadableRef<K, V, Context>,
  //   ids: K[],
  // ) => Promise<(Error | V)[]>; // helper for loading many
  // other context fields
};

export type DirectiveConfig = Record<
  string,
  { locations: DirectiveLocation; args?: Record<string, unknown> | undefined }
>;
