"use client";

import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import {
  seedDevData,
  saveSeedToStorage,
  loadSeedFromStorage,
  type SeedBundle,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const PRESETS = {
  balanced: { name: "Balanced", variability: 0.12, days: 28 },
  stressed: { name: "Stressed", variability: 0.3, days: 28 },
  jetlag: { name: "Jetlag", variability: 0.35, days: 21 },
};

export default function AdminSimPage() {
  const [days, setDays] = useState(28);
  const [variability, setVariability] = useState(0.15);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<SeedBundle | null>(null);

  useEffect(() => {
    // load saved seed if present
    const s = loadSeedFromStorage();
    if (s) setPreview(s);
  }, []);

  const generatePreview = () => {
    const bundle = seedDevData(days, { variability });
    setPreview({
      dates: bundle.dates,
      daily: bundle.daily,
      meta: { createdAt: new Date().toISOString(), name: name || "Manual" },
    });
  };

  const saveSeed = () => {
    if (!preview) return;
    const bundle: SeedBundle = {
      ...preview,
      meta: {
        createdAt: preview.meta?.createdAt ?? new Date().toISOString(),
        name: name || preview.meta?.name || "Manual",
        ...(preview.meta?.options ? { options: preview.meta.options } : {}),
      },
    };
    const ok = saveSeedToStorage(bundle);
    if (ok) {
      // reload the page to ensure consumers pick up seed immediately
      window.location.reload();
    } else {
      alert("Failed to save seed to localStorage");
    }
  };

  const applyPreset = (k: keyof typeof PRESETS) => {
    const p = PRESETS[k];
    setDays(p.days);
    setVariability(p.variability);
    setName(p.name);
    // generate preview immediately
    const bundle = seedDevData(p.days, { variability: p.variability });
    setPreview({
      dates: bundle.dates,
      daily: bundle.daily,
      meta: { createdAt: new Date().toISOString(), name: p.name },
    });
  };

  const clearSeed = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("technozlife:mockSeed");
      window.location.reload();
    }
  };

  // Guard: only available on localhost / non-production
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    return (
      <div className='p-6'>Admin simulator is disabled in production.</div>
    );
  }

  return (
    <RequireAuth>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Admin Data Simulator
          </h1>
          <p className='text-slate-400'>
            Create and persist simulated datasets for local testing and demos.
          </p>
        </div>

        <div className='grid gap-4'>
          <div className='glass rounded-2xl p-4 grid md:grid-cols-3 gap-3'>
            <div>
              <label className='text-sm text-slate-400'>Preset</label>
              <div className='mt-2 flex gap-2'>
                {Object.keys(PRESETS).map((k) => (
                  <Button
                    key={k}
                    variant='outline'
                    onClick={() => applyPreset(k as any)}
                  >
                    {PRESETS[k as keyof typeof PRESETS].name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className='text-sm text-slate-400'>Days</label>
              <Input
                value={String(days)}
                onChange={(e) => setDays(Number(e.target.value))}
                className='mt-2'
              />
            </div>

            <div>
              <label className='text-sm text-slate-400'>Variability</label>
              <div className='mt-2'>
                <Slider
                  value={[variability]}
                  min={0}
                  max={0.5}
                  step={0.01}
                  onValueChange={(v) => setVariability(Number(v))}
                />
                <div className='text-sm text-slate-400 mt-1'>
                  {(variability * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className='md:col-span-3'>
              <label className='text-sm text-slate-400'>Scenario name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='mt-2'
                placeholder='Optional label for this scenario'
              />
            </div>

            <div className='md:col-span-3 flex gap-2'>
              <Button onClick={generatePreview}>Generate Preview</Button>
              <Button variant='default' onClick={saveSeed} disabled={!preview}>
                Save & Apply
              </Button>
              <Button variant='destructive' onClick={clearSeed}>
                Clear Saved Seed
              </Button>
            </div>

            <div className='md:col-span-3 flex gap-2 items-center'>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    // seed devices
                    try {
                      // dynamic import to avoid SSR issues
                      const { devicesApi } = require("@/lib/mockApi");
                      devicesApi.add({ type: "fitbit", model: "FitSim 1" });
                      devicesApi.add({ type: "phone", model: "HealthPhone" });
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                      alert("Failed to seed devices");
                    }
                  }}
                >
                  Seed Devices
                </Button>

                <Button
                  variant='outline'
                  onClick={() => {
                    try {
                      const { habitsApi } = require("@/lib/mockApi");
                      habitsApi.add({
                        name: "Morning Walk",
                        schedule: "daily",
                      });
                      habitsApi.add({
                        name: "Bedtime Wind-down",
                        schedule: "daily",
                      });
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                      alert("Failed to seed habits");
                    }
                  }}
                >
                  Seed Habits
                </Button>

                <Button
                  variant='destructive'
                  onClick={() => {
                    try {
                      window.localStorage.removeItem("technozlife:devices");
                      window.localStorage.removeItem("technozlife:habits");
                      window.localStorage.removeItem(
                        "technozlife:habitEntries"
                      );
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                      alert("Failed to clear devices/habits");
                    }
                  }}
                >
                  Clear Devices & Habits
                </Button>
              </div>

              <div className='ml-auto text-sm text-slate-400'>
                Use these buttons to seed demo devices and habits for the
                simulated dashboard.
              </div>
            </div>
          </div>

          <div className='glass rounded-2xl p-4'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Preview Summary
            </h3>
            {preview ? (
              <div className='grid gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-300'>Name</span>
                  <span className='text-sm text-slate-300'>
                    {preview.meta?.name || "Manual"}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-300'>Created</span>
                  <span className='text-sm text-slate-300'>
                    {preview.meta?.createdAt}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-300'>Days</span>
                  <span className='text-sm text-slate-300'>
                    {preview.daily.length}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-slate-300'>Avg sleep</span>
                  <span className='text-sm text-slate-300'>
                    {(
                      preview.daily.reduce((a, b) => a + b.sleepHours, 0) /
                      preview.daily.length
                    ).toFixed(1)}
                    h
                  </span>
                </div>
              </div>
            ) : (
              <div className='text-sm text-slate-400'>
                No preview generated yet. Use the controls above to create a
                dataset.
              </div>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
