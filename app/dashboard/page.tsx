"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  FileText,
  FolderOpen,
  Cpu,
  TrendingUp,
  Activity,
  Sparkles,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AIGenerator } from "@/components/dashboard/ai-generator";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { useAuth } from "@/lib/auth-context";

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
import ProfileCard from "@/components/dashboard/profile-card";

// Simulated activity types
const activityTypes = [
  { type: "generation", icon: "📝", color: "text-blue-400" },
  { type: "login", icon: "🔐", color: "text-green-400" },
  { type: "update", icon: "⚙️", color: "text-yellow-400" },
  { type: "view", icon: "👁️", color: "text-purple-400" },
];

const activityMessages = [
  "Generated a blog post about AI technology",
  "Logged in from Chrome on Windows",
  "Updated profile information",
  "Viewed dashboard analytics",
  "Generated social media content",
  "Created email template",
  "Accessed billing information",
  "Viewed generation history",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<StatsShape | null>(null);
  const [activities, setActivities] = useState<Array<any>>([]);
  const [usageData, setUsageData] = useState(initialUsageData);
  const [isLoading, setIsLoading] = useState(true);

  // Generate simulated data
  useEffect(() => {
    let mounted = true;

    async function loadSimulatedData() {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!mounted) return;

      // Generate random stats
      const simulatedStats: StatsShape = {
        totalGenerations: Math.floor(Math.random() * 50) + 10,
        tokensUsed: Math.floor(Math.random() * 50000) + 10000,
        savedTemplates: Math.floor(Math.random() * 20) + 5,
        activeProjects: Math.floor(Math.random() * 10) + 1,
      };

      setStats(simulatedStats);

      // Update usage data from simulated stats
      setUsageData((prev) =>
        prev.map((u) => {
          if (u.label === "API Calls")
            return { ...u, value: simulatedStats.totalGenerations };
          if (u.label === "Tokens Used")
            return { ...u, value: simulatedStats.tokensUsed };
          if (u.label === "Storage")
            return { ...u, value: simulatedStats.savedTemplates * 0.1 };
          return u;
        })
      );

      // Generate simulated activities
      const simulatedActivities = Array.from({ length: 8 }, (_, i) => {
        const activityType =
          activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const message =
          activityMessages[Math.floor(Math.random() * activityMessages.length)];
        const timestamp = new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ); // Last 7 days

        return {
          id: `activity-${i}`,
          type: activityType.type,
          message,
          icon: activityType.icon,
          color: activityType.color,
          timestamp: timestamp.toISOString(),
          timeAgo: getTimeAgo(timestamp),
        };
      }).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(simulatedActivities);
      setIsLoading(false);
    }

    loadSimulatedData();

    // Set up dynamic updates every 30 seconds
    const interval = setInterval(() => {
      if (!mounted) return;

      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          totalGenerations:
            prev.totalGenerations + Math.floor(Math.random() * 3),
          tokensUsed: prev.tokensUsed + Math.floor(Math.random() * 100),
        };
      });

      // Add new activity occasionally
      if (Math.random() < 0.3) {
        const activityType =
          activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const message =
          activityMessages[Math.floor(Math.random() * activityMessages.length)];
        const timestamp = new Date();

        const newActivity = {
          id: `activity-${Date.now()}`,
          type: activityType.type,
          message,
          icon: activityType.icon,
          color: activityType.color,
          timestamp: timestamp.toISOString(),
          timeAgo: "Just now",
        };

        setActivities((prev) => [newActivity, ...prev.slice(0, 7)]);
      }
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Helper function to get time ago
  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return (
    <RequireAuth>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 md:mb-8'
        >
          {/* Safe display name extraction to avoid calling toString on undefined */}
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Welcome back
            {(() => {
              const nameSource = user
                ? (user as any).first_name ??
                  (user as any).username ??
                  (user as any).email ??
                  ""
                : "";
              return nameSource ? `, ${String(nameSource).split(" ")[0]}` : "";
            })()}
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

            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='mb-4'
            >
              <ProfileCard />
            </motion.div>

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
