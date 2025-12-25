"use client";

import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { getSeed, type DailyEntry } from "@/lib/mock-data";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function WellnessHistoryPage() {
  const [daily, setDaily] = useState<DailyEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    function load() {
      const bundle = getSeed(28);
      if (!mounted) return;
      setDaily(bundle.daily);
    }

    load();
    const handler = () => load();
    window.addEventListener("mockSeedUpdated", handler);
    return () => {
      mounted = false;
      window.removeEventListener("mockSeedUpdated", handler);
    };
  }, []);

  const chartData = daily.map((d) => ({
    date: new Date(d.date).toLocaleDateString(),
    sleep: d.sleepHours,
    activity: d.activityMinutes,
    mood: d.mood,
  }));

  return (
    <RequireAuth>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Wellness History
          </h1>
          <p className='text-slate-400'>
            Simulated daily wellness entries (sleep, activity, mood).
          </p>
        </div>

        <div className='grid gap-4'>
          <div className='glass rounded-2xl p-5'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Sleep & Activity (last 28 days)
            </h3>
            <ChartContainer
              id='wellness-history'
              config={{
                sleep: { label: "Sleep (h)", color: "#06b6d4" },
                activity: { label: "Activity (min)", color: "#10b981" },
              }}
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' strokeOpacity={0.06} />
                <XAxis dataKey='date' tick={{ fill: "rgba(148,163,184,1)" }} />
                <YAxis tick={{ fill: "rgba(148,163,184,1)" }} />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='sleep'
                  name='Sleep (h)'
                  stroke='#06b6d4'
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type='monotone'
                  dataKey='activity'
                  name='Activity (min)'
                  stroke='#10b981'
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className='glass rounded-2xl p-4'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Recent days
            </h3>
            <div className='grid gap-2'>
              {daily
                .slice()
                .reverse()
                .map((d) => (
                  <div
                    key={d.date}
                    className='p-3 rounded-lg bg-slate-900/40 flex items-center justify-between'
                  >
                    <div>
                      <div className='text-sm text-slate-300 font-medium'>
                        {new Date(d.date).toLocaleDateString()}
                      </div>
                      <div className='text-xs text-slate-500'>
                        Sleep {d.sleepHours}h · Mood {d.mood} ·{" "}
                        {d.activityMinutes} min
                      </div>
                    </div>
                    <div className='text-sm text-slate-300'>
                      Sleep score {d.sleepScore}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
