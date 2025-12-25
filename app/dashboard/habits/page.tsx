"use client";

import React, { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { getSeed, type DailyEntry } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Check, Sun, Moon, Heart } from "lucide-react";

const HABITS = [
  { id: "stretch", label: "Morning stretch", icon: Sun },
  { id: "meditate", label: "Meditation", icon: Heart },
  { id: "no-sugar", label: "No sugar after 7pm", icon: Moon },
  { id: "steps", label: "10k steps", icon: Check },
];

export default function HabitsPage() {
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

  const habitsStats = useMemo(() => {
    const days = daily.length || 1;

    // Very simple simulated distribution: allocate `habitsCompleted` across HABITS
    const accum: Record<string, number> = {};
    HABITS.forEach((h) => (accum[h.id] = 0));

    daily.forEach((d) => {
      // distribute completions for the day
      let remaining = d.habitsCompleted;
      const order = HABITS.map((h) => h.id).sort(() =>
        Math.random() < 0.5 ? -1 : 1
      );
      for (const id of order) {
        if (remaining <= 0) break;
        // chance to mark this habit done
        if (Math.random() < 0.5) {
          accum[id]++;
          remaining--;
        }
      }
    });

    return HABITS.map((h) => ({
      ...h,
      completedDays: accum[h.id],
      completionRate: Math.round((accum[h.id] / days) * 100),
    }));
  }, [daily]);

  return (
    <RequireAuth>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Habits
          </h1>
          <p className='text-slate-400'>
            Track routines and view completion rates from simulated data.
          </p>
        </div>

        <div className='grid gap-4'>
          {habitsStats.map((h) => (
            <div
              key={h.id}
              className='glass rounded-2xl p-4 flex items-center gap-4'
            >
              <div className='w-12 h-12 rounded-lg bg-slate-800/40 flex items-center justify-center'>
                <h.icon className='w-5 h-5 text-teal-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-3 mb-2'>
                  <div>
                    <div className='text-sm text-slate-300 font-medium'>
                      {h.label}
                    </div>
                    <div className='text-xs text-slate-500'>
                      Completed {h.completedDays} days
                    </div>
                  </div>
                  <div className='text-sm text-slate-300 font-mono'>
                    {h.completionRate}%
                  </div>
                </div>
                <Progress
                  value={h.completionRate}
                  className='h-2 rounded-full'
                />
              </div>
            </div>
          ))}

          <div className='glass rounded-2xl p-4'>
            <h3 className='text-lg font-semibold text-white mb-2'>Tips</h3>
            <ul className='text-sm text-slate-300 space-y-2'>
              <li>
                Consistency is more important than intensity — aim for small
                daily wins.
              </li>
              <li>
                Try pairing a new habit with a well-established one (habit
                stacking).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
