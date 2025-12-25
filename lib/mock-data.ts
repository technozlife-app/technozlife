// Mock data generator for dashboard

export type ISODate = string;

export type DailyEntry = {
  date: ISODate;
  sleepHours: number;
  sleepScore: number; // 0-100
  activityMinutes: number;
  steps: number;
  mood: number; // 1-5
  meals: number;
  habitsCompleted: number;
};

export type SeedOptions = {
  variability?: number; // 0-1 how noisy the data is
};

/**
 * Generate an array of dates (ISO strings) going back `days` from `end` inclusive
 */
function generateDates(end: Date = new Date(), days = 14): ISODate[] {
  const arr: ISODate[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    arr.push(d.toISOString());
  }
  return arr;
}

function randInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a smoothed random walk around a baseline to feel realistic
 */
function generateSeries(days: number, baseline: number, variability = 0.15) {
  let value = baseline;
  const out: number[] = [];

  for (let i = 0; i < days; i++) {
    // small drift
    value += randInRange(-variability * baseline, variability * baseline) * 0.6;
    // occasional bigger change
    if (Math.random() < 0.05)
      value += randInRange(
        -variability * baseline * 3,
        variability * baseline * 3
      );

    // add small noise
    const noisy =
      value + randInRange(-variability * baseline, variability * baseline);
    out.push(Math.max(0, Math.round(noisy * 10) / 10));
  }

  return out;
}

export function seedDevData(
  days = 14,
  options: SeedOptions = {}
): { dates: ISODate[]; daily: DailyEntry[] } {
  const variability = options.variability ?? 0.15;
  const dates = generateDates(new Date(), days);

  // Baselines (plausible values)
  const sleepBaseline = randInRange(6.5, 8);
  const activityBaseline = randInRange(25, 60); // minutes
  const stepsBaseline = randInRange(3500, 9000);
  const moodBaseline = randInRange(3.2, 4.4);

  const sleepSeries = generateSeries(days, sleepBaseline, variability);
  const activitySeries = generateSeries(days, activityBaseline, variability);
  const stepsSeries = generateSeries(days, stepsBaseline, variability);
  const moodSeries = generateSeries(days, moodBaseline, variability * 0.6);

  const daily: DailyEntry[] = dates.map((date, i) => {
    const sleepHours = Math.max(2, Math.round(sleepSeries[i] * 10) / 10);
    const activityMinutes = Math.max(0, Math.round(activitySeries[i]));
    const steps = Math.max(0, Math.round(stepsSeries[i]));
    const mood = Math.min(5, Math.max(1, Math.round(moodSeries[i] * 10) / 10));
    const sleepScore = Math.round(
      (Math.min(12, sleepHours) / 8) * 100 * (0.85 + Math.random() * 0.3)
    );

    const meals = Math.round(randInRange(2, 4));
    const habitsCompleted = Math.max(0, Math.round(randInRange(0, 5)));

    return {
      date,
      sleepHours,
      sleepScore: Math.min(100, Math.round(sleepScore)),
      activityMinutes,
      steps,
      mood,
      meals,
      habitsCompleted,
    };
  });

  return { dates, daily };
}

/**
 * Create a short narrative insight from the seeded daily data
 */
export function generateNarrativeInsight(daily: DailyEntry[]) {
  if (!daily || daily.length === 0) return "No data available.";

  const last7 = daily.slice(-7);
  const prev7 = daily.slice(-14, -7) || [];

  const avg = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);

  const sleepAvg =
    Math.round(avg(last7.map((d) => d.sleepHours) as number[]) * 10) / 10;
  const prevSleepAvg = prev7.length
    ? Math.round(avg(prev7.map((d) => d.sleepHours)) * 10) / 10
    : null;

  const moodAvg = Math.round(avg(last7.map((d) => d.mood)) * 10) / 10;
  const activityAvg = Math.round(avg(last7.map((d) => d.activityMinutes)));

  const suggestions: string[] = [];

  if (prevSleepAvg !== null && sleepAvg + 0.2 < prevSleepAvg) {
    suggestions.push(
      `Sleep is down ${
        Math.round((prevSleepAvg - sleepAvg) * 10) / 10
      }h vs prior week — try a slightly earlier bedtime.`
    );
  } else if (sleepAvg >= 7.5) {
    suggestions.push(
      "You're maintaining healthy sleep duration — keep consistent bed/wake times for better recovery."
    );
  }

  if (activityAvg < 30) {
    suggestions.push(
      "Activity is low; try a 20–30 minute walk during the day to boost energy."
    );
  } else if (activityAvg > 45) {
    suggestions.push(
      "Activity levels are great — consider light recovery on rest days."
    );
  }

  if (moodAvg < 3.5) {
    suggestions.push(
      "Mood appears lower this week — try a short morning breathing routine or sunlight exposure."
    );
  }

  // Build a compact insight
  const top = suggestions.slice(0, 2).join(" ");
  const headline = `This week's sleep: ${sleepAvg}h — mood: ${moodAvg}/5 — activity: ${activityAvg} min/day.`;

  return `${headline} ${top}`;
}

/**
 * Compute a simple trailing moving average for a numeric series.
 */
export function movingAverage(values: number[], window = 7) {
  if (!values || values.length === 0) return [] as number[];
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    out.push(Math.round(avg * 10) / 10);
  }
  return out;
}

/**
 * Simple linear forecast by taking the average delta over the last `lookback` points
 * and extending the series for `days` steps.
 */
export function simpleForecast(values: number[], days = 14, lookback = 7) {
  if (!values || values.length === 0) return [] as number[];
  const n = values.length;
  const lb = Math.min(lookback, n - 1);
  if (lb <= 0) return Array(days).fill(values[n - 1]);

  // compute average difference
  let totalDiff = 0;
  for (let i = n - lb; i < n; i++) {
    totalDiff += values[i] - values[i - 1];
  }
  const avgDiff = totalDiff / lb;

  const forecast: number[] = [];
  let last = values[n - 1];
  for (let d = 0; d < days; d++) {
    const next = Math.max(0, Math.round((last + avgDiff) * 10) / 10);
    forecast.push(next);
    last = next;
  }

  return forecast;
}

export function generateRecommendations(daily: DailyEntry[]) {
  if (!daily || daily.length === 0)
    return [] as Array<{
      id: string;
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
      confidence: number;
    }>;

  const last7 = daily.slice(-7);
  const avg = (arr: number[]) =>
    Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  const sleepAvg = avg(last7.map((d) => d.sleepHours));
  const moodAvg = avg(last7.map((d) => d.mood));
  const activityAvg = Math.round(avg(last7.map((d) => d.activityMinutes)));

  const recs: Array<{
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    confidence: number;
  }> = [];

  // Sleep recommendations
  if (sleepAvg < 6.5) {
    recs.push({
      id: "sleep-early",
      title: "Shift bedtime earlier",
      description: `Your average sleep this week was ${sleepAvg}h. Try moving bedtime earlier by 15–30 minutes to improve recovery.`,
      priority: "high",
      confidence: 0.9,
    });
  } else if (sleepAvg < 7.5) {
    recs.push({
      id: "sleep-consistency",
      title: "Maintain consistent bed/wake times",
      description: `Sleep is adequate (${sleepAvg}h). Keeping consistent sleep times can improve sleep quality.`,
      priority: "medium",
      confidence: 0.75,
    });
  } else {
    recs.push({
      id: "sleep-good",
      title: "Sleep duration is healthy",
      description: `Great job — average sleep ${sleepAvg}h. Focus on sleep quality and recovery strategies.`,
      priority: "low",
      confidence: 0.6,
    });
  }

  // Activity recommendations
  if (activityAvg < 30) {
    recs.push({
      id: "activity-walk",
      title: "Add a daily walk",
      description: `Your daily activity averages ${activityAvg} min. A 20–30 minute walk can improve energy and mood.`,
      priority: "high",
      confidence: 0.85,
    });
  } else if (activityAvg < 45) {
    recs.push({
      id: "activity-maintain",
      title: "Maintain activity level",
      description: `Activity is moderate (${activityAvg} min/day). Keep variety to sustain benefits.`,
      priority: "medium",
      confidence: 0.65,
    });
  } else {
    recs.push({
      id: "activity-recover",
      title: "Plan recovery days",
      description: `Activity is high (${activityAvg} min/day). Consider light recovery days to reduce injury risk.`,
      priority: "medium",
      confidence: 0.6,
    });
  }

  // Mood recommendations
  if (moodAvg < 3.5) {
    recs.push({
      id: "mood-breath",
      title: "Try a short daily breathing routine",
      description: `Mood average is ${moodAvg}/5. A brief morning or evening breathing practice can improve baseline mood.`,
      priority: "high",
      confidence: 0.8,
    });
  }

  // Prioritize: sort high->medium->low and confidence
  recs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    if (order[a.priority] !== order[b.priority])
      return order[a.priority] - order[b.priority];
    return b.confidence - a.confidence;
  });

  return recs;
}

export type SeedBundle = {
  dates: ISODate[];
  daily: DailyEntry[];
  meta?: {
    createdAt: string;
    name?: string;
    options?: SeedOptions;
  };
};

export function saveSeedToStorage(bundle: SeedBundle) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem("technozlife:mockSeed", JSON.stringify(bundle));
    // notify listeners
    window.dispatchEvent(new Event("mockSeedUpdated"));
    return true;
  } catch (e) {
    return false;
  }
}

export function loadSeedFromStorage(): SeedBundle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("technozlife:mockSeed");
    if (!raw) return null;
    return JSON.parse(raw) as SeedBundle;
  } catch (e) {
    return null;
  }
}

export function getSeed(days = 14, options: SeedOptions = {}): SeedBundle {
  const stored = loadSeedFromStorage();
  if (
    stored &&
    stored.daily &&
    stored.daily.length >= Math.min(days, stored.daily.length)
  ) {
    return stored;
  }

  const generated = seedDevData(days, options);
  const bundle: SeedBundle = {
    dates: generated.dates,
    daily: generated.daily,
    meta: { createdAt: new Date().toISOString(), options },
  };
  return bundle;
}

export default {
  seedDevData,
  generateNarrativeInsight,
  movingAverage,
  simpleForecast,
  generateRecommendations,
  saveSeedToStorage,
  loadSeedFromStorage,
  getSeed,
};
