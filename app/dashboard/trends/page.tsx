"use client";

import React, { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  getSeed,
  movingAverage,
  simpleForecast,
  generateNarrativeInsight,
  type DailyEntry,
} from "@/lib/mock-data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TrendingUp, Activity, Sparkles } from "lucide-react";

export default function TrendsPage() {
  const [daily, setDaily] = useState<DailyEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    function load() {
      const bundle = getSeed(90);
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

  const series = useMemo(() => daily.map((d) => d.sleepHours), [daily]);
  const dates = useMemo(
    () => daily.map((d) => new Date(d.date).toLocaleDateString()),
    [daily]
  );

  const ma = useMemo(() => movingAverage(series, 7), [series]);
  const forecast = useMemo(() => simpleForecast(series, 14, 14), [series]);

  const chartData = useMemo(() => {
    const arr: any[] = [];
    for (let i = 0; i < series.length; i++) {
      arr.push({ date: dates[i], sleep: series[i], ma: ma[i] });
    }
    // append forecast points (dates + n days)
    const lastDate = daily.length
      ? new Date(daily[daily.length - 1].date)
      : new Date();
    for (let i = 0; i < forecast.length; i++) {
      const d = new Date(lastDate);
      d.setDate(lastDate.getDate() + i + 1);
      arr.push({
        date: d.toLocaleDateString(),
        sleep: null,
        ma: null,
        forecast: forecast[i],
      });
    }

    return arr;
  }, [series, dates, ma, forecast, daily]);

  const insight = useMemo(() => generateNarrativeInsight(daily), [daily]);

  // compute trend delta over last 14 days
  const trendDelta = useMemo(() => {
    if (ma.length < 15) return 0;
    const last = ma[ma.length - 1];
    const prev = ma[ma.length - 15];
    return Math.round((last - prev) * 10) / 10;
  }, [ma]);

  return (
    <RequireAuth>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Trends & Forecast
          </h1>
          <p className='text-slate-400'>
            Moving averages, short-term forecasts, and signal detection from
            simulated data.
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          <StatsCard
            title='Sleep trend'
            value={`${ma.length ? ma[ma.length - 1] : "—"}h`}
            change={`${trendDelta >= 0 ? "+" : ""}${trendDelta}h / 2w`}
            changeType={trendDelta >= 0 ? "positive" : "negative"}
            icon={TrendingUp}
            index={0}
          />

          <StatsCard
            title='Forecast (next 2w)'
            value={`${forecast.length ? forecast[forecast.length - 1] : "—"}h`}
            changeType='neutral'
            icon={Sparkles}
            index={1}
          />
        </div>

        <div className='grid lg:grid-cols-3 gap-4'>
          <div className='lg:col-span-2 glass rounded-2xl p-5'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Sleep (7d MA) & Forecast
            </h3>
            <ChartContainer
              id='trends'
              config={{
                sleep: { label: "Sleep (h)", color: "#06b6d4" },
                ma: { label: "7d MA", color: "#60a5fa" },
                forecast: { label: "Forecast", color: "#f59e0b" },
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
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='ma'
                  name='7d MA'
                  stroke='#60a5fa'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='forecast'
                  name='Forecast'
                  stroke='#f59e0b'
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  strokeDasharray='6 6'
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className='glass rounded-2xl p-5'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              Top Signals
            </h3>
            <p className='text-slate-300 mb-3'>{insight}</p>

            <div className='grid gap-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-300'>
                  Sleep change (2w)
                </span>
                <span
                  className={`text-sm font-medium ${
                    trendDelta >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {trendDelta >= 0 ? `+${trendDelta}h` : `${trendDelta}h`}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-300'>
                  Forecast confidence
                </span>
                <span className='text-sm font-medium text-slate-300'>
                  Moderate
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm text-slate-300'>Action</span>
                <button className='text-sm text-sky-400'>
                  View recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
