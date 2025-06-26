import { i } from '@instantdb/react-native';
import { DataAttrDef } from '@instantdb/core';

const _schema = i.schema({
  entities: {
    chats: i.entity({
      sessionId: i.number().indexed(),
      title: i.string(),
      mode: i.string(),
      timestamp: i.number().indexed(),
      userId: i.string().optional().indexed(), // For multi-user support
      createdAt: i.number().indexed(),
      updatedAt: i.number().indexed(),
    }),
    messages: i.entity({
      sessionId: i.number().indexed(),
      messageId: i.string().indexed(), // original _id from SwiftChatMessage
      text: i.string(),
      createdAt: i.number().indexed(),
      userId: i.string().indexed(), // from SwiftChatMessage
      userName: i.string().optional(),
      modelTag: i.string().optional(),
      usage: i.string().optional(), // JSON stringified
      reasoning: i.string().optional(),
      metrics: i.string().optional(), // JSON stringified
      audio: i.string().optional(),
    }),
    systemPrompts: i.entity({
      promptId: i.number().indexed(),
      name: i.string(),
      prompt: i.string(),
      includeHistory: i.boolean(),
      promptType: i.string().optional(),
      allowInterruption: i.boolean().optional(),
      userId: i.string().optional().indexed(),
      createdAt: i.number().indexed(),
    }),
    usage: i.entity({
      modelName: i.string(),
      inputTokens: i.number(),
      outputTokens: i.number(),
      totalTokens: i.number(),
      imageCount: i.number().optional(),
      smallImageCount: i.number().optional(),
      largeImageCount: i.number().optional(),
      userId: i.string().optional().indexed(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    messageChat: {
      forward: {
        on: 'messages',
        has: 'one',
        label: 'chat',
        onDelete: 'cascade',
      },
      reverse: { on: 'chats', has: 'many', label: 'messages' },
    },
    chatUser: {
      forward: {
        on: 'chats',
        has: 'one',
        label: '$user',
        onDelete: 'cascade',
      },
      reverse: { on: '$users', has: 'many', label: 'chats' },
    },
    promptUser: {
      forward: {
        on: 'systemPrompts',
        has: 'one',
        label: '$user',
        onDelete: 'cascade',
      },
      reverse: { on: '$users', has: 'many', label: 'systemPrompts' },
    },
    usageUser: {
      forward: {
        on: 'usage',
        has: 'one',
        label: '$user',
        onDelete: 'cascade',
      },
      reverse: { on: '$users', has: 'many', label: 'usageRecords' },
    },
  },
});

type _Schema = typeof _schema;
export interface Schema extends _Schema {}
export const schema: Schema = _schema;

// Extracts the value type from a DataAttrDef
type AttrType<T> = T extends DataAttrDef<infer V, any> ? V : never;

// Given the attrs shape, produces the record type
type EntityAttrsToType<Attrs> = {
  [K in keyof Attrs]: AttrType<Attrs[K]>;
};

// Given the EntityDef, produces the record type
export type EntityRecord<T extends { attrs: any }> = EntityAttrsToType<
  T['attrs']
>;
