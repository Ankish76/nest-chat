/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment chatFragment on Chat {\n  id\n  message\n  type\n  createdAt\n  updatedAt\n}": types.ChatFragmentFragmentDoc,
    "mutation AddMessage($message: String!, $roomId: String!, $userId: String!) {\n  addMessage(message: $message, roomId: $roomId, userId: $userId) {\n    ...chatFragment\n  }\n}": types.AddMessageDocument,
    "query Chats($after: String, $before: String, $first: Int, $last: Int, $roomId: String!) {\n  chats(\n    after: $after\n    before: $before\n    first: $first\n    last: $last\n    roomId: $roomId\n  ) {\n    edges {\n      node {\n        ...chatFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}": types.ChatsDocument,
    "subscription ChatSub($roomId: String!) {\n  chatSub(roomId: $roomId) {\n    ...chatFragment\n  }\n}": types.ChatSubDocument,
    "fragment chatRoomFragment on ChatRoom {\n  id\n  name\n  haveJoined\n  createdAt\n  updatedAt\n}": types.ChatRoomFragmentFragmentDoc,
    "mutation CreateRoom($name: String!) {\n  createRoom(name: $name) {\n    ...chatRoomFragment\n  }\n}": types.CreateRoomDocument,
    "query Rooms($after: String, $before: String, $first: Int, $last: Int) {\n  rooms(after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        ...chatRoomFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}": types.RoomsDocument,
    "fragment pageInfoFragment on PageInfo {\n  endCursor\n  hasNextPage\n  hasPreviousPage\n  startCursor\n}": types.PageInfoFragmentFragmentDoc,
    "fragment userFragment on User {\n  id\n  name\n  createdAt\n  updatedAt\n}": types.UserFragmentFragmentDoc,
    "mutation JoinRoom($name: String!, $roomId: String!) {\n  joinRoom(name: $name, roomId: $roomId) {\n    ...userFragment\n  }\n}": types.JoinRoomDocument,
    "query Users($after: String, $before: String, $first: Int, $last: Int) {\n  users(after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        ...userFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}": types.UsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment chatFragment on Chat {\n  id\n  message\n  type\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment chatFragment on Chat {\n  id\n  message\n  type\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AddMessage($message: String!, $roomId: String!, $userId: String!) {\n  addMessage(message: $message, roomId: $roomId, userId: $userId) {\n    ...chatFragment\n  }\n}"): (typeof documents)["mutation AddMessage($message: String!, $roomId: String!, $userId: String!) {\n  addMessage(message: $message, roomId: $roomId, userId: $userId) {\n    ...chatFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Chats($after: String, $before: String, $first: Int, $last: Int, $roomId: String!) {\n  chats(\n    after: $after\n    before: $before\n    first: $first\n    last: $last\n    roomId: $roomId\n  ) {\n    edges {\n      node {\n        ...chatFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}"): (typeof documents)["query Chats($after: String, $before: String, $first: Int, $last: Int, $roomId: String!) {\n  chats(\n    after: $after\n    before: $before\n    first: $first\n    last: $last\n    roomId: $roomId\n  ) {\n    edges {\n      node {\n        ...chatFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription ChatSub($roomId: String!) {\n  chatSub(roomId: $roomId) {\n    ...chatFragment\n  }\n}"): (typeof documents)["subscription ChatSub($roomId: String!) {\n  chatSub(roomId: $roomId) {\n    ...chatFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment chatRoomFragment on ChatRoom {\n  id\n  name\n  haveJoined\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment chatRoomFragment on ChatRoom {\n  id\n  name\n  haveJoined\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateRoom($name: String!) {\n  createRoom(name: $name) {\n    ...chatRoomFragment\n  }\n}"): (typeof documents)["mutation CreateRoom($name: String!) {\n  createRoom(name: $name) {\n    ...chatRoomFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Rooms($after: String, $before: String, $first: Int, $last: Int) {\n  rooms(after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        ...chatRoomFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}"): (typeof documents)["query Rooms($after: String, $before: String, $first: Int, $last: Int) {\n  rooms(after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        ...chatRoomFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment pageInfoFragment on PageInfo {\n  endCursor\n  hasNextPage\n  hasPreviousPage\n  startCursor\n}"): (typeof documents)["fragment pageInfoFragment on PageInfo {\n  endCursor\n  hasNextPage\n  hasPreviousPage\n  startCursor\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment userFragment on User {\n  id\n  name\n  createdAt\n  updatedAt\n}"): (typeof documents)["fragment userFragment on User {\n  id\n  name\n  createdAt\n  updatedAt\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation JoinRoom($name: String!, $roomId: String!) {\n  joinRoom(name: $name, roomId: $roomId) {\n    ...userFragment\n  }\n}"): (typeof documents)["mutation JoinRoom($name: String!, $roomId: String!) {\n  joinRoom(name: $name, roomId: $roomId) {\n    ...userFragment\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Users($after: String, $before: String, $first: Int, $last: Int) {\n  users(after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        ...userFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}"): (typeof documents)["query Users($after: String, $before: String, $first: Int, $last: Int) {\n  users(after: $after, before: $before, first: $first, last: $last) {\n    edges {\n      node {\n        ...userFragment\n      }\n    }\n    pageInfo {\n      ...pageInfoFragment\n    }\n    totalCount\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;