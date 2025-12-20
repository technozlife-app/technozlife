"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, FileText, FolderOpen, Cpu } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AIGenerator } from "@/components/dashboard/ai-generator";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { useAuth } from "@/lib/auth-context";

import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getPlanBySlug } from "@/lib/plans";

interface StatsShape {
  totalGenerations: number;
  tokensUsed: number;
  savedTemplates: number;
  activeProjects: number;
}

const initialUsageData = [
  { label: "API Calls", value: 0, max: 1000 },
  { label: "Tokens Used", value: 0, max: 100000 },
  { label: "Storage", value: 0, max: 5 },
];

import RequireAuth from "@/components/auth/RequireAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState<StatsShape | null>(null);
  const [activities, setActivities] = useState<Array<any>>([]);
  const [usageData, setUsageData] = useState(initialUsageData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const statsRes = await dashboardApi.getStats();
        const activityRes = await dashboardApi.getActivity();

        if (!mounted) return;

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data as StatsShape);
          // update usageData from stats if possible
          setUsageData((prev) =>
            prev.map((u) => {
              if (u.label === "Tokens Used")
                return { ...u, value: statsRes.data.tokensUsed };
              return u;
            })
          );
        } else {
          addToast({
            title: "Failed to load stats",
            description: statsRes.message,
          });
        }

        if (activityRes.success && activityRes.data) {
          // activityRes.data should contain activities array
          // Support both { activities: [...] } and direct array
          const activitiesList =
            (activityRes.data as any).activities || activityRes.data;
          setActivities(activitiesList || []);
        } else {
          addToast({
            title: "Failed to load activity",
            description: activityRes.message,
          });
        }
      } catch (err) {
        addToast({
          title: "Connection Error",
          description: "Unable to load dashboard data",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [addToast]);

  return (
    <RequireAuth>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 md:mb-8'
        >
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className='text-slate-400'>
            Here's what's happening with your bio-digital interface
          </p>
          <div className='mt-3 flex items-center gap-3'>
            <span className='text-sm text-slate-400'>Plan:</span>
            <span className='px-3 py-1 rounded-full bg-slate-800 text-sm font-medium text-white'>
              {(() => {
                const planSlug =
                  (user as any)?.plan || (user as any)?.current_plan || null;
                const plan = planSlug ? getPlanBySlug(planSlug) : null;
                return plan ? plan.name : planSlug ? planSlug : "No plan";
              })()}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid - Responsive */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8'>
          <StatsCard
            title='Generations'
            value={stats ? stats.totalGenerations.toLocaleString() : "—"}
            change='+12% from last week'
            changeType='positive'
            icon={Sparkles}
            index={0}
          />
          <StatsCard
            title='Tokens Used'
            value={stats ? `${(stats.tokensUsed / 1000).toFixed(1)}K` : "—"}
            change={
              stats
                ? `${Math.round((stats.tokensUsed / 100000) * 100)}% of limit`
                : ""
            }
            changeType='neutral'
            icon={Zap}
            index={1}
          />
          <StatsCard
            title='Templates'
            value={stats ? stats.savedTemplates : "—"}
            change='+3 this month'
            changeType='positive'
            icon={FileText}
            index={2}
          />
          <StatsCard
            title='Projects'
            value={stats ? stats.activeProjects : "—"}
            change='2 in progress'
            changeType='neutral'
            icon={FolderOpen}
            index={3}
          />
        </div>

        {/* Main content grid - Responsive */}
        <div className='grid lg:grid-cols-2 gap-4 md:gap-6'>
          {/* Left column */}
          <div className='space-y-4 md:space-y-6'>
            <AIGenerator />
            <UsageChart data={usageData} />
          </div>

          {/* Right column */}
          <div className='space-y-4 md:space-y-6'>
            <ActivityFeed activities={activities} />

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className='glass rounded-2xl p-5'
            >
              <h3 className='text-lg font-semibold text-white mb-4'>
                Quick Actions
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                {[
                  {
                    icon: Cpu,
                    label: "New Project",
                    color: "from-teal-500/20 to-emerald-500/20",
                  },
                  {
                    icon: FileText,
                    label: "Templates",
                    color: "from-violet-500/20 to-purple-500/20",
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={`p-4 rounded-xl bg-linear-to-br ${action.color} border border-white/5 hover:border-white/10 transition-colors text-left group`}
                  >
                    <action.icon className='w-5 h-5 text-slate-300 mb-2 group-hover:text-white transition-colors' />
                    <span className='text-sm text-slate-300 group-hover:text-white transition-colors'>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

// Need to import Sparkles for the stats card
import { Sparkles } from "lucide-react";
