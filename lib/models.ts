export type ISODate = string;

export type Habit = {
  id: string;
  userId?: string | number;
  name: string;
  icon?: string;
  schedule?: "daily" | "weekly" | "custom";
  streak?: number;
  createdAt: ISODate;
  updatedAt?: ISODate;
};

export type HabitEntry = {
  id: string;
  habitId: string;
  date: ISODate;
  completed: boolean;
  notes?: string;
};

export type WearableDevice = {
  id: string;
  userId?: string | number;
  type: string;
  model?: string;
  lastSync?: ISODate;
  status?: "connected" | "disconnected";
  metadata?: Record<string, any>;
};

export type DeviceMetric = {
  id: string;
  deviceId: string;
  type: "sleep" | "steps" | "hr" | "activity" | string;
  value: number;
  timestamp: ISODate;
  meta?: Record<string, any>;
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  confidence?: number; // 0..1
  priority?: "high" | "medium" | "low";
  source?: "client" | "ai" | "rule-based";
  createdAt?: ISODate;
};

export type GenerationJob = {
  id: string;
  userId?: string | number;
  status: "processing" | "completed" | "failed";
  prompt: string;
  result?: string;
  tokensUsed?: number;
  createdAt: ISODate;
  completedAt?: ISODate;
};
