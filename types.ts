export enum TabId {
  CONCEPT = 'concept',
  LIFECYCLE = 'lifecycle',
  ANATOMY = 'anatomy',
  SECURITY = 'security',
  ARCHITECTURE = 'architecture',
  QUIZ = 'quiz',
}

export interface WebhookEvent {
  id: string;
  name: string;
  description: string;
  headers: Record<string, string>;
  body: object;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
