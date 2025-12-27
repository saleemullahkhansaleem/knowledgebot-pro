
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'file';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export enum ViewMode {
  CHAT = 'CHAT',
  KNOWLEDGE = 'KNOWLEDGE',
  SETTINGS = 'SETTINGS'
}
