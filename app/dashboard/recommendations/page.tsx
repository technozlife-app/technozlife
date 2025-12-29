"use client";

import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { getSeed, type DailyEntry } from "@/lib/mock-data";
import { recommendationsApi } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Lightbulb, Check } from "lucide-react";

export default function RecommendationsPage() {
  const [daily, setDaily] = useState<DailyEntry[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      const bundle = getSeed(14);
      if (!mounted) return;
      setDaily(bundle.daily);

      // Try AI-backed generation first; falls back to rule-based within mockApi
      const r = await recommendationsApi.generateFromData(bundle.daily);
      setRecs(r);
    }

    load();
    const handler = () => load();
    window.addEventListener("mockSeedUpdated", handler);
    return () => {
      mounted = false;
      window.removeEventListener("mockSeedUpdated", handler);
    };
  }, []);

  const handleApply = (id: string) => {
    setApplied((p) => ({ ...p, [id]: true }));
  };

  return (
    <RequireAuth>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Recommendations
          </h1>
          <p className='text-slate-400'>
            Actionable suggestions tailored to recent signals (simulated).
          </p>
        </div>

        <div className='grid gap-4'>
          {recs.map((r: any) => (
            <div
              key={r.id}
              className='glass rounded-2xl p-4 flex items-start gap-4'
            >
              <div className='w-10 h-10 rounded-lg bg-slate-800/40 flex items-center justify-center'>
                <Lightbulb className='w-5 h-5 text-amber-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-3 mb-2'>
                  <div>
                    <div className='text-sm text-slate-300 font-medium'>
                      {r.title}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {r.description}
                    </div>
                  </div>
                  <div className='text-sm text-slate-300 font-mono'>
                    {Math.round((r.confidence || 0.6) * 100)}% confidence •{" "}
                    {r.source || "rule-based"}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant={applied[r.id] ? "ghost" : "default"}
                    onClick={() => handleApply(r.id)}
                    className='h-9'
                  >
                    {applied[r.id] ? (
                      <>
                        <Check className='w-4 h-4 mr-2' /> Applied
                      </>
                    ) : (
                      <>Apply</>
                    )}
                  </Button>
                  <Button variant='outline' className='h-9'>
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {recs.length === 0 && (
            <div className='text-center py-12 text-slate-500'>
              No recommendations at this time.
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
