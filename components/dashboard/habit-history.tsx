"use client";

import React, { useEffect, useState } from "react";
import { habitsApi } from "@/lib/mockApi";
import { HabitEntry } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/custom-toast";

export default function HabitHistory({ habitId }: { habitId: string }) {
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const { addToast } = useToast();

  const load = () => {
    const list = habitsApi.entries(habitId);
    // show most recent first
    setEntries(list.sort((a, b) => (a.date < b.date ? 1 : -1)));
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("mockDataUpdated", h);
    window.addEventListener("mockSeedUpdated", h);
    return () => {
      window.removeEventListener("mockDataUpdated", h);
      window.removeEventListener("mockSeedUpdated", h);
    };
  }, [habitId]);

  const toggle = (entry: HabitEntry) => {
    try {
      habitsApi.toggleEntry(entry.habitId, entry.date);
      addToast("success", "Updated", "Toggled completion");
      load();
    } catch (e) {
      console.error(e);
      addToast("error", "Update failed", "Could not toggle entry");
    }
  };

  if (!entries || entries.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-slate-400'>
            No history yet for this habit.
          </div>
        </CardContent>
      </Card>
    );

  return (
    <div className='space-y-2'>
      {entries.map((e) => (
        <div
          key={e.id}
          className='glass rounded-xl p-3 flex items-center justify-between'
        >
          <div>
            <div className='text-sm text-slate-300'>
              {new Date(e.date).toLocaleString()}
            </div>
            {e.notes && <div className='text-xs text-slate-500'>{e.notes}</div>}
          </div>
          <div className='flex items-center gap-2'>
            <div className='text-sm text-slate-300'>
              {e.completed ? "Completed" : "Missed"}
            </div>
            <Button size='sm' onClick={() => toggle(e)}>
              {e.completed ? "Mark Missed" : "Mark Done"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
