import { aiApi } from "./api";

// Lightweight ID generator
function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

import mockData, {
  generateRecommendations as clientGenerateRecommendations,
} from "./mock-data";
import {
  Habit,
  HabitEntry,
  WearableDevice,
  DeviceMetric,
  Recommendation,
  GenerationJob,
} from "./models";

const LS = {
  devices: "technozlife:devices",
  deviceMetrics: "technozlife:deviceMetrics",
  habits: "technozlife:habits",
  habitEntries: "technozlife:habitEntries",
  jobs: "technozlife:aiJobs",
};

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch (e) {
    console.error("LS read error", e);
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event("mockDataUpdated"));
    return true;
  } catch (e) {
    console.error("LS write error", e);
    return false;
  }
}

export const devicesApi = {
  list(): WearableDevice[] {
    return read<WearableDevice>(LS.devices);
  },
  add(data: Partial<WearableDevice>): WearableDevice {
    const items = read<WearableDevice>(LS.devices);
    const d: WearableDevice = {
      id: makeId(),
      type: data.type || "generic",
      model: data.model || "demo",
      status: "connected",
      lastSync: new Date().toISOString(),
      metadata: data.metadata || {},
      userId: data.userId,
    };
    items.push(d);
    write(LS.devices, items);
    return d;
  },
  remove(id: string) {
    const items = read<WearableDevice>(LS.devices).filter((i) => i.id !== id);
    write(LS.devices, items);
    return true;
  },
  update(id: string, patch: Partial<WearableDevice>) {
    const items = read<WearableDevice>(LS.devices).map((d) =>
      d.id === id ? { ...d, ...patch } : d
    );
    write(LS.devices, items);
    return items.find((d) => d.id === id) || null;
  },
  sync(id: string, options: { days?: number } = { days: 7 }): DeviceMetric[] {
    const devices = read<WearableDevice>(LS.devices);
    const dev = devices.find((d) => d.id === id);
    if (!dev) return [];

    const days = options.days ?? 7;
    const now = new Date();
    const metrics: DeviceMetric[] = [];
    for (let i = 0; i < days; i++) {
      const t = new Date(now);
      t.setDate(now.getDate() - i);
      metrics.push({
        id: makeId(),
        deviceId: dev.id,
        type: "steps",
        value: Math.round(2000 + Math.random() * 8000),
        timestamp: t.toISOString(),
      });
      metrics.push({
        id: makeId(),
        deviceId: dev.id,
        type: "sleep",
        value: Math.round(5 + Math.random() * 4 * 10) / 10,
        timestamp: t.toISOString(),
      });
    }

    const existing = read<DeviceMetric>(LS.deviceMetrics);
    write(LS.deviceMetrics, existing.concat(metrics));

    const updated = devices.map((d) =>
      d.id === id ? { ...d, lastSync: new Date().toISOString() } : d
    );
    write(LS.devices, updated);

    return metrics;
  },
  metricsForDevice(deviceId: string): DeviceMetric[] {
    return read<DeviceMetric>(LS.deviceMetrics).filter(
      (m) => m.deviceId === deviceId
    );
  },
};

export const habitsApi = {
  list(): Habit[] {
    return read<Habit>(LS.habits);
  },
  add(data: Partial<Habit>): Habit {
    const items = read<Habit>(LS.habits);
    const now = new Date().toISOString();
    const h: Habit = {
      id: makeId(),
      name: data.name || "New Habit",
      schedule: data.schedule || "daily",
      createdAt: now,
      updatedAt: now,
      streak: data.streak || 0,
    };
    items.push(h);
    write(LS.habits, items);
    return h;
  },
  update(id: string, patch: Partial<Habit>) {
    const items = read<Habit>(LS.habits).map((h) =>
      h.id === id ? { ...h, ...patch, updatedAt: new Date().toISOString() } : h
    );
    write(LS.habits, items);
    return items.find((h) => h.id === id) || null;
  },
  remove(id: string) {
    const items = read<Habit>(LS.habits).filter((h) => h.id !== id);
    write(LS.habits, items);
    const entries = read<HabitEntry>(LS.habitEntries).filter(
      (e) => e.habitId !== id
    );
    write(LS.habitEntries, entries);
    return true;
  },
  entries(habitId: string): HabitEntry[] {
    return read<HabitEntry>(LS.habitEntries).filter(
      (e) => e.habitId === habitId
    );
  },
  toggleEntry(habitId: string, date: string) {
    const entries = read<HabitEntry>(LS.habitEntries);
    const day = new Date(date).toISOString();
    const existing = entries.find(
      (e) => e.habitId === habitId && e.date === day
    );
    if (existing) {
      const updated = entries.map((e) =>
        e.id === existing.id ? { ...e, completed: !e.completed } : e
      );
      write(LS.habitEntries, updated);
      return updated.find((e) => e.id === existing.id);
    } else {
      const e: HabitEntry = {
        id: makeId(),
        habitId,
        date: day,
        completed: true,
      };
      entries.push(e);
      write(LS.habitEntries, entries);
      return e;
    }
  },
};

export const recommendationsApi = {
  async generateFromData(dailyData: any[]): Promise<Recommendation[]> {
    try {
      const prompt = `Given the following recent daily metrics (date,sleepHours,activityMinutes,steps,mood):\n${dailyData
        .slice(-14)
        .map(
          (d: any) =>
            `${d.date},${d.sleepHours},${d.activityMinutes},${d.steps},${d.mood}`
        )
        .join(
          "\n"
        )}\n\nProvide 3 concise personalized wellness recommendations with a confidence 0..1 and priority. Return JSON array of {id,title,description,confidence,priority}.`;
      const res = await aiApi.generate({ prompt, async: false });
      if (res.status === "success" && res.data) {
        const content = res.data.content || res.data.result;
        try {
          const parsed = JSON.parse(content as string) as Recommendation[];
          return parsed.map((p) => ({
            ...p,
            source: "ai",
            createdAt: new Date().toISOString(),
          }));
        } catch (e) {
          return [
            {
              id: makeId(),
              title: "AI Recommendation",
              description: String(content || ""),
              confidence: 0.6,
              priority: "medium",
              source: "ai",
              createdAt: new Date().toISOString(),
            },
          ];
        }
      }
    } catch (e) {
      console.warn("AI generate failed", e);
    }

    const recs = clientGenerateRecommendations(dailyData as any[]).map((r) => ({
      ...r,
      source: "rule-based",
      createdAt: new Date().toISOString(),
    })) as Recommendation[];
    return recs;
  },
};

export const jobsApi = {
  list(): GenerationJob[] {
    return read<GenerationJob>(LS.jobs);
  },
  add(job: Partial<GenerationJob>): GenerationJob {
    const items = read<GenerationJob>(LS.jobs);
    const j: GenerationJob = {
      id: makeId(),
      prompt: job.prompt || "",
      status: job.status || "processing",
      createdAt: new Date().toISOString(),
      result: job.result,
      tokensUsed: job.tokensUsed,
    };
    items.push(j);
    write(LS.jobs, items);
    return j;
  },
  update(id: string, patch: Partial<GenerationJob>) {
    const items = read<GenerationJob>(LS.jobs).map((j) =>
      j.id === id ? { ...j, ...patch } : j
    );
    write(LS.jobs, items);
    return items.find((j) => j.id === id);
  },
};

export default { devicesApi, habitsApi, recommendationsApi, jobsApi };
