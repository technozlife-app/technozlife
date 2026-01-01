"use client";

import React, { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { getSeed, type DailyEntry } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Sun, Moon, Heart } from "lucide-react";
import HabitForm from "@/components/dashboard/habit-form";
import HabitHistory from "@/components/dashboard/habit-history";
import { habitsApi } from "@/lib/mockApi";
import { useToast } from "@/components/ui/custom-toast";

export default function HabitsPage() {
  const [daily, setDaily] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    function loadSeed() {
      const bundle = getSeed(28);
      if (!mounted) return;
      setDaily(bundle.daily);
    }

    const loadHabits = () => {
      setHabits(habitsApi.list());
    };

    loadSeed();
    loadHabits();

    const handler = () => {
      loadSeed();
      loadHabits();
    };

    window.addEventListener("mockSeedUpdated", handler);
    window.addEventListener("mockDataUpdated", handler);
    return () => {
      mounted = false;
      window.removeEventListener("mockSeedUpdated", handler);
      window.removeEventListener("mockDataUpdated", handler);
    };
  }, []);

  const toggleToday = (habitId: string) => {
    try {
      const day = new Date().toISOString();
      const entry = habitsApi.toggleEntry(habitId, day);
      addToast("success", "Habit updated", "Toggled completion for today");
      setHabits(habitsApi.list());
    } catch (e) {
      console.error(e);
      addToast("error", "Update failed", "Could not toggle habit entry");
    }
  };

  const fallbackHabits = useMemo(() => {
    return [
      { id: "stretch", label: "Morning stretch", icon: Sun },
      { id: "meditate", label: "Meditation", icon: Heart },
      { id: "no-sugar", label: "No sugar after 7pm", icon: Moon },
      { id: "steps", label: "10k steps", icon: Check },
    ];
  }, []);

  const habitsToShow = (habits.length ? habits : fallbackHabits).map(
    (h: any) => ({
      id: h.id || h.name || h.label,
      label: h.name || h.label || h.id,
      icon: h.icon || Sun,
    })
  );

  const habitsStats = useMemo(() => {
    const days = daily.length || 1;

    // Very simple demo distribution: allocate `habitsCompleted` across HABITS
    const accum: Record<string, number> = {};
    habitsToShow.forEach((h) => (accum[h.id] = 0));

    daily.forEach((d) => {
      // distribute completions for the day
      let remaining = d.habitsCompleted;
      const order = Object.keys(accum).sort(() =>
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

    return habitsToShow.map((h) => ({
      ...h,
      completedDays: accum[h.id] || 0,
      completionRate: Math.round(((accum[h.id] || 0) / days) * 100),
    }));
  }, [daily, habitsToShow]);

  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  return (
    <RequireAuth>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6 flex flex-col md:flex-row items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
              Habits
            </h1>
            <p className='text-slate-400'>
              Track routines and view completion rates from demo data.
            </p>
          </div>
          <div className='w-80'>
            <HabitForm onAdded={() => setHabits(habitsApi.list())} />
          </div>
        </div>

        <div className='grid gap-4'>
          {habitsStats.map((h) => (
            <div
              key={h.id}
              className='glass rounded-2xl p-4 flex items-center gap-4'
            >
              <div className='w-12 h-12 rounded-lg bg-slate-800/40 flex items-center justify-center'>
                {/* icon may be a component or string */}
                {typeof h.icon === "function" ? (
                  <h.icon className='w-5 h-5 text-teal-400' />
                ) : (
                  <div className='w-5 h-5 text-teal-400'>{h.label?.[0]}</div>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex flex-col  md:flex-row items-center justify-between gap-3 mb-2'>
                  <div>
                    <div className='text-sm text-slate-300 font-medium'>
                      {h.label}
                    </div>
                    <div className='text-xs text-slate-500'>
                      Completed {h.completedDays} days
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row items-center gap-2'>
                    <div className='text-sm text-slate-300 font-mono'>
                      {h.completionRate}%
                    </div>
                    <div className='flex flex-col md:flex-row items-start gap-2'>
                      <Button
                        size='sm'
                        onClick={() => toggleToday(h.id)}
                        title='Toggle today'
                      >
                        Toggle Today
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setSelectedHabit(h.id)}
                      >
                        View History
                      </Button>
                    </div>
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

        {selectedHabit && (
          <div className='fixed inset-0 z-50 flex items-end md:items-center justify-center p-4'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setSelectedHabit(null)}
            />
            <div className='relative bg-slate-900 rounded-2xl p-6 max-w-2xl w-full'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Habit History</h3>
                <Button variant='ghost' onClick={() => setSelectedHabit(null)}>
                  Close
                </Button>
              </div>
              <HabitHistory habitId={selectedHabit} />
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
