import { MMKV } from 'react-native-mmkv';
import {
  AllModel,
  Chat,
  ChatMode,
  Model,
  SwiftChatMessage,
  SystemPrompt,
  TokenResponse,
  Usage,
} from '../types/Chat.ts';
import {
  DefaultRegion,
  DefaultVoiceSystemPrompts,
  getDefaultImageModels,
  getDefaultSystemPrompts,
  getDefaultTextModels,
  VoiceIDList,
} from './Constants.ts';
import { storage } from './InstantStorage.ts';

export const localStorage = new MMKV({
  id: 'swiftchat',
  encryptionKey: '1234567890', // TODO: change to a persisted random string
});

const keyPrefix = 'bedrock/';
const currentSessionIdKey = keyPrefix + 'currentSessionId';
const hapticEnabledKey = keyPrefix + 'hapticEnabled';
const apiUrlKey = keyPrefix + 'apiUrlKey';
const apiKeyTag = keyPrefix + 'apiKeyTag';
const ollamaApiUrlKey = keyPrefix + 'ollamaApiUrlKey';
const deepSeekApiKeyTag = keyPrefix + 'deepSeekApiKeyTag';
const openAIApiKeyTag = keyPrefix + 'openAIApiKeyTag';
const openAICompatApiKeyTag = keyPrefix + 'openAICompatApiKeyTag';
const openAICompatApiURLKey = keyPrefix + 'openAICompatApiURLKey';
const openAICompatModelsKey = keyPrefix + 'openAICompatModelsKey';
const regionKey = keyPrefix + 'regionKey';
const textModelKey = keyPrefix + 'textModelKey';
const imageModelKey = keyPrefix + 'imageModelKey';
const allModelKey = keyPrefix + 'allModelKey';
const imageSizeKey = keyPrefix + 'imageSizeKey';
const systemPromptsKey = keyPrefix + 'systemPromptsKey';
const currentSystemPromptKey = keyPrefix + 'currentSystemPromptKey';
const currentVoiceSystemPromptKey = keyPrefix + 'currentVoiceSystemPromptKey';
const currentPromptIdKey = keyPrefix + 'currentPromptIdKey';
const openAIProxyEnabledKey = keyPrefix + 'openAIProxyEnabledKey';
const thinkingEnabledKey = keyPrefix + 'thinkingEnabledKey';
const modelOrderKey = keyPrefix + 'modelOrderKey';
const voiceIdKey = keyPrefix + 'voiceIdKey';
const tokenInfoKey = keyPrefix + 'tokenInfo';

let currentApiUrl: string | undefined;
let currentApiKey: string | undefined;
let currentOllamaApiUrl: string | undefined;
let currentDeepSeekApiKey: string | undefined;
let currentOpenAIApiKey: string | undefined;
let currentOpenAICompatApiKey: string | undefined;
let currentOpenAICompatApiURL: string | undefined;
let currentRegion: string | undefined;
let currentImageModel: Model | undefined;
let currentTextModel: Model | undefined;
let currentOpenAIProxyEnabled: boolean | undefined;
let currentThinkingEnabled: boolean | undefined;
let currentModelOrder: Model[] | undefined;

export function setUserId(userId: string) {
  storage.setUserId(userId);
}

export async function saveMessages(
  sessionId: number,
  messages: SwiftChatMessage[],
  usage: Usage
) {
  await storage.saveMessages(sessionId, messages, usage);
}

export async function saveMessageList(
  sessionId: number,
  fistMessage: SwiftChatMessage,
  chatMode: ChatMode
) {
  await storage.saveMessageList(sessionId, fistMessage, chatMode.toString());
  localStorage.set(currentSessionIdKey, sessionId);
}

export function getMessageList() {
  return storage.getMessageList();
}

export async function updateMessageList(chatList: Chat[]) {
  await storage.updateMessageList(chatList);
}

export function getMessagesBySessionId(sessionId: number) {
  return storage.getMessagesBySessionId(sessionId);
}

export async function deleteMessagesBySessionId(sessionId: number) {
  await storage.deleteMessagesBySessionId(sessionId);
}

export function getSessionId() {
  return localStorage.getNumber(currentSessionIdKey) ?? 0;
}

export function saveKeys(apiUrl: string, apiKey: string) {
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1);
  }
  saveApiUrl(apiUrl);
  saveApiKey(apiKey);
  currentApiKey = apiKey;
  currentApiUrl = apiUrl;
}

export function getApiUrl(): string {
  if (currentApiUrl) {
    return currentApiUrl;
  } else {
    currentApiUrl = localStorage.getString(apiUrlKey) ?? '';
    return currentApiUrl;
  }
}

export function getOllamaApiUrl(): string {
  if (currentOllamaApiUrl) {
    return currentOllamaApiUrl;
  } else {
    currentOllamaApiUrl = localStorage.getString(ollamaApiUrlKey) ?? '';
    return currentOllamaApiUrl;
  }
}

export function getApiKey(): string {
  if (currentApiKey) {
    return currentApiKey;
  } else {
    currentApiKey = localStorage.getString(apiKeyTag) ?? '';
    return currentApiKey;
  }
}

export function getDeepSeekApiKey(): string {
  if (currentDeepSeekApiKey) {
    return currentDeepSeekApiKey;
  } else {
    currentDeepSeekApiKey = localStorage.getString(deepSeekApiKeyTag) ?? '';
    return currentDeepSeekApiKey;
  }
}

export function getOpenAIApiKey(): string {
  if (currentOpenAIApiKey) {
    return currentOpenAIApiKey;
  } else {
    currentOpenAIApiKey = localStorage.getString(openAIApiKeyTag) ?? '';
    return currentOpenAIApiKey;
  }
}

export function getOpenAICompatApiKey(): string {
  if (currentOpenAICompatApiKey) {
    return currentOpenAICompatApiKey;
  } else {
    currentOpenAICompatApiKey =
      localStorage.getString(openAICompatApiKeyTag) ?? '';
    return currentOpenAICompatApiKey;
  }
}

export function getOpenAICompatApiURL(): string {
  if (currentOpenAICompatApiURL) {
    return currentOpenAICompatApiURL;
  } else {
    currentOpenAICompatApiURL =
      localStorage.getString(openAICompatApiURLKey) ?? '';
    return currentOpenAICompatApiURL;
  }
}

export function getOpenAICompatModels(): string {
  return localStorage.getString(openAICompatModelsKey) ?? '';
}

export function saveOpenAICompatApiKey(apiKey: string) {
  currentOpenAICompatApiKey = apiKey;
  localStorage.set(openAICompatApiKeyTag, apiKey);
}

export function saveOpenAICompatApiURL(apiUrl: string) {
  currentOpenAICompatApiURL = apiUrl;
  localStorage.set(openAICompatApiURLKey, apiUrl);
}

export function saveOpenAICompatModels(models: string) {
  localStorage.set(openAICompatModelsKey, models);
}

export function saveHapticEnabled(enabled: boolean) {
  localStorage.set(hapticEnabledKey, enabled);
}

export function getHapticEnabled() {
  return localStorage.getBoolean(hapticEnabledKey) ?? true;
}

export function saveApiUrl(apiUrl: string) {
  localStorage.set(apiUrlKey, apiUrl);
}

export function saveApiKey(apiKey: string) {
  localStorage.set(apiKeyTag, apiKey);
}

export function saveOllamaApiURL(apiUrl: string) {
  currentOllamaApiUrl = apiUrl;
  localStorage.set(ollamaApiUrlKey, apiUrl);
}

export function saveDeepSeekApiKey(apiKey: string) {
  currentDeepSeekApiKey = apiKey;
  localStorage.set(deepSeekApiKeyTag, apiKey);
}

export function saveOpenAIApiKey(apiKey: string) {
  currentOpenAIApiKey = apiKey;
  localStorage.set(openAIApiKeyTag, apiKey);
}

export function saveRegion(region: string) {
  currentRegion = region;
  localStorage.set(regionKey, region);
}

export function getRegion() {
  if (currentRegion) {
    return currentRegion;
  } else {
    currentRegion = localStorage.getString(regionKey) ?? DefaultRegion;
    return currentRegion;
  }
}

export function saveTextModel(model: Model) {
  currentTextModel = model;
  localStorage.set(textModelKey, JSON.stringify(model));
}

export function getTextModel(): Model {
  if (currentTextModel) {
    return currentTextModel;
  } else {
    const modelString = localStorage.getString(textModelKey) ?? '';
    if (modelString.length > 0) {
      currentTextModel = JSON.parse(modelString) as Model;
    } else {
      currentTextModel = getDefaultTextModels()[0];
    }
    return currentTextModel;
  }
}

export function saveImageModel(model: Model) {
  currentImageModel = model;
  localStorage.set(imageModelKey, JSON.stringify(model));
}

export function getImageModel(): Model {
  if (currentImageModel) {
    return currentImageModel;
  } else {
    const modelString = localStorage.getString(imageModelKey) ?? '';
    if (modelString.length > 0) {
      currentImageModel = JSON.parse(modelString) as Model;
    } else {
      currentImageModel = getDefaultImageModels()[0];
    }
    return currentImageModel;
  }
}

export function saveAllModels(allModels: AllModel) {
  localStorage.set(allModelKey, JSON.stringify(allModels));
}

export function getAllModels() {
  const modelString = localStorage.getString(allModelKey) ?? '';
  if (modelString.length > 0) {
    return JSON.parse(modelString) as AllModel;
  }
  return {
    imageModel: getDefaultImageModels(),
    textModel: getDefaultTextModels(),
  };
}

export function getAllImageSize(imageModelId: string = '') {
  if (isNewStabilityImageModel(imageModelId)) {
    return ['1024 x 1024'];
  }
  if (isNovaCanvas(imageModelId)) {
    return ['1024 x 1024', '2048 x 2048'];
  }
  return ['512 x 512', '1024 x 1024'];
}

export function isNewStabilityImageModel(modelId: string) {
  return (
    modelId === 'stability.sd3-large-v1:0' ||
    modelId === 'stability.stable-image-ultra-v1:0' ||
    modelId === 'stability.stable-image-core-v1:0'
  );
}

export function isNovaCanvas(modelId: string) {
  return modelId.includes('nova-canvas');
}

export function saveImageSize(size: string) {
  localStorage.set(imageSizeKey, size);
}

export function getImageSize() {
  return localStorage.getString(imageSizeKey) ?? getAllImageSize()[1];
}

export function saveVoiceId(voiceId: string) {
  localStorage.set(voiceIdKey, voiceId);
}

export function getVoiceId() {
  return localStorage.getString(voiceIdKey) ?? VoiceIDList[0].voiceId;
}

export function getModelUsage() {
  const query = storage.getUsage();
  return query.data?.usages || [];
}

export async function updateTotalUsage(usage: Usage) {
  await storage.saveUsage(usage);
}

export function saveCurrentSystemPrompt(prompts: SystemPrompt | null) {
  localStorage.set(
    currentSystemPromptKey,
    prompts ? JSON.stringify(prompts) : ''
  );
}

export function getCurrentSystemPrompt(): SystemPrompt | null {
  const promptString = localStorage.getString(currentSystemPromptKey) ?? '';
  if (promptString.length > 0) {
    return JSON.parse(promptString) as SystemPrompt;
  }
  return null;
}

export function saveCurrentVoiceSystemPrompt(prompts: SystemPrompt | null) {
  localStorage.set(
    currentVoiceSystemPromptKey,
    prompts ? JSON.stringify(prompts) : ''
  );
}

export function getCurrentVoiceSystemPrompt(): SystemPrompt | null {
  const promptString =
    localStorage.getString(currentVoiceSystemPromptKey) ?? '';
  if (promptString.length > 0) {
    return JSON.parse(promptString) as SystemPrompt;
  }
  return null;
}

export async function saveSystemPrompts(
  prompts: SystemPrompt[],
  type?: string
) {
  await storage.saveSystemPrompts(prompts, type);
}

export function saveAllSystemPrompts(prompts: SystemPrompt[]) {
  localStorage.set(systemPromptsKey, JSON.stringify(prompts));
}

export function getSystemPrompts(type?: string): SystemPrompt[] {
  const prompts = storage.getSystemPrompts(type);
  return prompts || type === 'voice'
    ? DefaultVoiceSystemPrompts
    : getDefaultSystemPrompts();
}

export function getPromptId() {
  return localStorage.getNumber(currentPromptIdKey) ?? 0;
}

export function savePromptId(promptId: number) {
  localStorage.set(currentPromptIdKey, promptId);
}

export function saveOpenAIProxyEnabled(enabled: boolean) {
  currentOpenAIProxyEnabled = enabled;
  localStorage.set(openAIProxyEnabledKey, enabled);
}

export function getOpenAIProxyEnabled() {
  if (currentOpenAIProxyEnabled !== undefined) {
    return currentOpenAIProxyEnabled;
  } else {
    currentOpenAIProxyEnabled =
      localStorage.getBoolean(openAIProxyEnabledKey) ?? false;
    return currentOpenAIProxyEnabled;
  }
}

export function saveThinkingEnabled(enabled: boolean) {
  currentThinkingEnabled = enabled;
  localStorage.set(thinkingEnabledKey, enabled);
}

export function getThinkingEnabled() {
  if (currentThinkingEnabled !== undefined) {
    return currentThinkingEnabled;
  } else {
    currentThinkingEnabled =
      localStorage.getBoolean(thinkingEnabledKey) ?? true;
    return currentThinkingEnabled;
  }
}

export function saveModelOrder(models: Model[]) {
  currentModelOrder = models;
  localStorage.set(modelOrderKey, JSON.stringify(models));
}

export function getModelOrder(): Model[] {
  if (currentModelOrder) {
    return currentModelOrder;
  } else {
    const modelOrderString = localStorage.getString(modelOrderKey) ?? '';
    if (modelOrderString.length > 0) {
      currentModelOrder = JSON.parse(modelOrderString) as Model[];
    } else {
      currentModelOrder = [];
    }
    return currentModelOrder;
  }
}

export function updateTextModelUsageOrder(model: Model) {
  const currentOrder = getModelOrder();
  const updatedOrder = [
    model,
    ...currentOrder.filter(m => m.modelId !== model.modelId),
  ];
  saveModelOrder(updatedOrder);
  return updatedOrder;
}

export function getMergedModelOrder(): Model[] {
  const historyModels = getModelOrder();
  const currentTextModels = getAllModels().textModel;
  const currentModelMap = new Map<string, Model>();
  currentTextModels.forEach(model => {
    currentModelMap.set(model.modelId, model);
  });
  const mergedModels: Model[] = [];
  historyModels.forEach(model => {
    if (currentModelMap.has(model.modelId)) {
      mergedModels.push(currentModelMap.get(model.modelId)!);
      currentModelMap.delete(model.modelId);
    }
  });
  currentModelMap.forEach(model => {
    mergedModels.push(model);
  });

  return mergedModels;
}

export function saveTokenInfo(tokenInfo: TokenResponse) {
  localStorage.set(tokenInfoKey, JSON.stringify(tokenInfo));
}

export function getTokenInfo(): TokenResponse | null {
  const tokenInfoStr = localStorage.getString(tokenInfoKey);
  if (tokenInfoStr) {
    return JSON.parse(tokenInfoStr) as TokenResponse;
  }
  return null;
}

export function isTokenValid(): boolean {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return false;
  }
  const expirationDate = new Date(tokenInfo.expiration).getTime();
  const now = new Date().getTime();
  return expirationDate > now + 10 * 60 * 1000;
}
