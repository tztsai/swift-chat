import { init, tx, id } from '@instantdb/react-native';
import { SwiftChatMessage, Chat, Usage, SystemPrompt } from '../types/Chat';
import { schema, EntityRecord } from './InstantSchema';

// Initialize InstantDB
const db = init({
  appId: process.env.INSTANT_APP_ID || 'your-app-id', // You'll need to set this
  apiURI: process.env.INSTANT_API_URI || undefined,
});

// Types for InstantDB entities
type DbMessage = EntityRecord<typeof schema.entities.messages>;
type DbChat = EntityRecord<typeof schema.entities.chats>;

// Helper functions for data conversion
const convertMessageToInstant = (
  sessionId: number,
  message: SwiftChatMessage
) => ({
  id: id(),
  sessionId,
  messageId: message._id.toString(),
  text: message.text,
  createdAt:
    typeof message.createdAt === 'number'
      ? new Date(message.createdAt).getTime()
      : message.createdAt.getTime(),
  userId: message.user._id,
  userName: message.user.name,
  modelTag: message.user.modelTag,
  usage: message.usage ? JSON.stringify(message.usage) : undefined,
  reasoning: message.reasoning,
  metrics: message.metrics ? JSON.stringify(message.metrics) : undefined,
  audio: message.audio,
});

const convertInstantToMessage = (dbMessage: DbMessage): SwiftChatMessage => ({
  _id: dbMessage.messageId,
  text: dbMessage.text,
  createdAt: new Date(dbMessage.createdAt),
  user: {
    _id: dbMessage.userId,
    name: dbMessage.userName || 'User',
    modelTag: dbMessage.modelTag,
  },
  usage: dbMessage.usage ? JSON.parse(dbMessage.usage) : undefined,
  reasoning: dbMessage.reasoning,
  metrics: dbMessage.metrics ? JSON.parse(dbMessage.metrics) : undefined,
  audio: dbMessage.audio,
});

const convertChatToInstant = (chat: Chat, userId?: string) => ({
  id: id(),
  sessionId: chat.id,
  title: chat.title,
  mode: chat.mode,
  timestamp: chat.timestamp,
  userId,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const convertInstantToChat = (dbChat: DbChat): Chat => ({
  id: dbChat.sessionId,
  title: dbChat.title,
  mode: dbChat.mode,
  timestamp: dbChat.timestamp,
});

// InstantDB Storage Service
export class InstantStorageService {
  private userId?: string;

  constructor(userId?: string) {
    this.userId = userId;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  // Save messages with real-time sync
  async saveMessages(
    sessionId: number,
    messages: SwiftChatMessage[],
    usage: Usage
  ) {
    try {
      // Update usage for first message
      if (messages.length > 0) {
        messages[0].usage = usage;
        messages.forEach((message, index) => {
          if (index !== 0 && 'usage' in message) {
            delete message.usage;
          }
        });
      }

      // Convert messages to InstantDB format
      const dbMessages = messages.map(msg =>
        convertMessageToInstant(sessionId, msg)
      );

      // Query for existing messages to delete
      const { data } = db.useQuery({
        messages: {
          $: {
            where: {
              sessionId: sessionId,
            },
          },
        },
      });

      // Delete existing messages for this session
      const ts = data?.messages.map(msg => tx.messages[msg.id].delete());
      await db.transact(ts || []);

      // Insert new messages
      await db.transact(dbMessages.map(msg => tx.messages[msg.id].update(msg)));

      console.log(`Saved ${messages.length} messages for session ${sessionId}`);
    } catch (error) {
      console.error('Error saving messages to InstantDB:', error);
      throw error;
    }
  }

  // Get messages by session ID with real-time updates
  getMessagesBySessionId(sessionId: number) {
    const { data, isLoading, error } = db.useQuery({
      messages: {
        $: {
          where: {
            sessionId: sessionId,
          },
          order: {
            serverCreatedAt: 'asc',
          },
        },
      },
    });

    // Convert the data if available
    if (data?.messages) {
      const convertedMessages = data.messages.map(convertInstantToMessage);
      return {
        isLoading,
        error,
        data: { messages: convertedMessages },
      };
    }

    return { isLoading, error, data };
  }

  // Save chat list with real-time sync
  async saveMessageList(
    sessionId: number,
    firstMessage: SwiftChatMessage,
    chatMode: string
  ) {
    try {
      const chat: Chat = {
        id: sessionId,
        title: firstMessage.text.substring(0, 50).replaceAll('\n', ' '),
        mode: chatMode,
        timestamp: (firstMessage.createdAt as Date).getTime(),
      };

      const dbChat = convertChatToInstant(chat, this.userId);

      await db.transact([tx.chats[dbChat.id].update(dbChat)]);

      console.log(`Saved chat list for session ${sessionId}`);
    } catch (error) {
      console.error('Error saving chat list to InstantDB:', error);
      throw error;
    }
  }

  // Get chat list with real-time updates
  getMessageList() {
    const query = db.useQuery({
      chats: {
        $: {
          where: this.userId ? { userId: this.userId } : {},
          order: {
            timestamp: 'desc',
          },
        },
      },
    });

    // Convert the data if available
    if (query.data?.chats) {
      const convertedChats = query.data.chats.map(convertInstantToChat);
      return {
        ...query,
        data: { chats: convertedChats },
      };
    }

    return query;
  }

  // Update chat list
  async updateMessageList(chatList: Chat[]) {
    try {
      // Query for existing chats to delete
      if (this.userId) {
        const { data } = db.useQuery({
          chats: {
            $: {
              where: {
                userId: this.userId,
              },
            },
          },
        });

        // Delete all existing chats for this user
        const ts = data?.chats.map(chat => tx.chats[chat.id].delete());
        await db.transact(ts || []);
      }

      // Insert updated chat list
      const dbChats = chatList.map(chat =>
        convertChatToInstant(chat, this.userId)
      );

      await db.transact(dbChats.map(chat => tx.chats[chat.id].update(chat)));

      console.log(`Updated chat list with ${chatList.length} chats`);
    } catch (error) {
      console.error('Error updating chat list in InstantDB:', error);
      throw error;
    }
  }

  // Delete messages by session ID
  async deleteMessagesBySessionId(sessionId: number) {
    try {
      // Query for chats to delete
      const { data } = db.useQuery({
        chats: {
          messages: {},
          $: {
            where: {
              sessionId: sessionId,
            },
          },
        },
      });

      const ts = data?.chats.map(chat => tx.chats[chat.id].delete());
      await db.transact(ts || []);

      console.log(`Deleted messages for session ${sessionId}`);
    } catch (error) {
      console.error('Error deleting messages from InstantDB:', error);
      throw error;
    }
  }

  // Save system prompts
  async saveSystemPrompts(prompts: SystemPrompt[], _type?: string) {
    try {
      // Query for existing prompts to delete
      if (this.userId) {
        const { data } = db.useQuery({
          systemPrompts: {
            $: {
              where: {
                userId: this.userId,
              },
            },
          },
        });

        // Delete existing prompts for this user
        const ts = data?.systemPrompts.map(prompt =>
          tx.systemPrompts[prompt.id].delete()
        );
        await db.transact(ts || []);
      }

      // Insert new prompts
      const dbPrompts = prompts.map(prompt => ({
        id: id(),
        promptId: prompt.id,
        name: prompt.name,
        prompt: prompt.prompt,
        includeHistory: prompt.includeHistory,
        promptType: prompt.promptType,
        allowInterruption: prompt.allowInterruption,
        userId: this.userId,
        createdAt: Date.now(),
      }));

      await db.transact(
        dbPrompts.map(prompt => tx.systemPrompts[prompt.id].update(prompt))
      );

      console.log(`Saved ${prompts.length} system prompts`);
    } catch (error) {
      console.error('Error saving system prompts to InstantDB:', error);
      throw error;
    }
  }

  // Get system prompts with real-time updates
  getSystemPrompts(type?: string) {
    const { data } = db.useQuery({
      systemPrompts: {
        $: {
          where: this.userId
            ? type
              ? { promptType: type, userId: this.userId }
              : { userId: this.userId }
            : {},
          order: {
            createdAt: 'asc',
          },
        },
      },
    });

    // Convert the data if available
    if (data?.systemPrompts) {
      return data.systemPrompts.map((prompt: object) => prompt as SystemPrompt);
    }

    return [];
  }

  // Save usage data
  async saveUsage(usage: Usage) {
    try {
      const dbUsage = {
        id: id(),
        modelName: usage.modelName,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        imageCount: usage.imageCount,
        smallImageCount: usage.smallImageCount,
        largeImageCount: usage.largeImageCount,
        userId: this.userId,
        createdAt: Date.now(),
      };

      await db.transact([tx.usage[dbUsage.id].update(dbUsage)]);

      console.log('Saved usage data');
    } catch (error) {
      console.error('Error saving usage to InstantDB:', error);
      throw error;
    }
  }

  // Get usage data with real-time updates
  getUsage() {
    return db.useQuery({
      usage: {
        $: {
          where: this.userId ? { userId: this.userId } : {},
          order: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}

// Create a singleton instance
export const storage = new InstantStorageService();
