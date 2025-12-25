"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Sparkles, Heart, Activity, CheckSquare } from "lucide-react";
import {
  getSeed,
  generateNarrativeInsight,
  type DailyEntry,
} from "@/lib/mock-data";
import RequireAuth from "@/components/auth/RequireAuth";

export default function OverviewPage() {
  const [daily, setDaily] = useState<DailyEntry[]>([]);
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    function load() {
      const bundle = getSeed(14);
      if (!mounted) return;
      setDaily(bundle.daily);
      setInsight(generateNarrativeInsight(bundle.daily));
    }

    load();

    const handler = () => load();
    window.addEventListener("mockSeedUpdated", handler);
    return () => {
      mounted = false;
      window.removeEventListener("mockSeedUpdated", handler);
    };
  }, []);

  const last7 = useMemo(() => daily.slice(-7), [daily]);

  const avg = (arr: number[]) =>
    arr.length
      ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
      : 0;

  const avgSleep = useMemo(() => avg(last7.map((d) => d.sleepHours)), [last7]);
  const avgMood = useMemo(() => avg(last7.map((d) => d.mood)), [last7]);
  const avgActivity = useMemo(
    () => Math.round(avg(last7.map((d) => d.activityMinutes))),
    [last7]
  );
  const avgHabits = useMemo(
    () => Math.round(avg(last7.map((d) => d.habitsCompleted))),
    [last7]
  );

  const chartData = daily.map((d) => ({
    date: new Date(d.date).toLocaleDateString(),
    sleep: d.sleepHours,
    mood: d.mood,
  }));

  return (
    <RequireAuth>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Overview
          </h1>
          <p className='text-slate-400'>
            Personalized wellbeing snapshot and top recommendations
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <StatsCard
            title='Sleep (avg)'
            value={`${avgSleep}h`}
            changeType='positive'
            change={`Score ${avg(last7.map((d) => d.sleepScore))}`}
            icon={Sparkles}
            index={0}
          />
          <StatsCard
            title='Mood (avg)'
            value={`${avgMood}/5`}
            changeType='neutral'
            icon={Heart}
            index={1}
          />
          <StatsCard
            title='Activity'
            value={`${avgActivity} min`}
            changeType='neutral'
            icon={Activity}
            index={2}
          />
          <StatsCard
            title='Habits'
            value={`${avgHabits}/day`}
            changeType='positive'
            icon={CheckSquare}
            index={3}
          />
        </div>

        <div className='grid lg:grid-cols-3 gap-4'>
          <div className='lg:col-span-2 glass rounded-2xl p-5'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Last 2 weeks
            </h3>
            <ChartContainer
              id='overview'
              config={{
                sleep: { label: "Sleep (h)", color: "#06b6d4" },
                mood: { label: "Mood", color: "#ef4444" },
              }}
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.06} />
                <XAxis dataKey='date' tick={{ fill: "rgba(148,163,184,1)" }} />
                <YAxis
                  yAxisId='left'
                  orientation='left'
                  tick={{ fill: "rgba(148,163,184,1)" }}
                />
                <Tooltip />
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey='sleep'
                  name='Sleep (h)'
                  stroke='#06b6d4'
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey='mood'
                  name='Mood'
                  stroke='#ef4444'
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className='glass rounded-2xl p-5'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Top Insight
            </h3>
            <p className='text-slate-300 mb-3'>{insight}</p>

            <h4 className='text-sm text-slate-400 mb-2'>Recent notes</h4>
            <ul className='text-sm text-slate-300 space-y-2'>
              {daily
                .slice(-3)
                .reverse()
                .map((d) => (
                  <li key={d.date} className='flex justify-between'>
                    <span>{new Date(d.date).toLocaleDateString()}</span>
                    <span className='text-slate-400'>
                      {d.sleepHours}h · Mood {d.mood}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
