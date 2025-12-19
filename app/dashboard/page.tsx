"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, FileText, FolderOpen, Cpu } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AIGenerator } from "@/components/dashboard/ai-generator";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { useAuth } from "@/lib/auth-context";

// Simulated stats for demo
const mockStats = {
  totalGenerations: 1247,
  tokensUsed: 89432,
  savedTemplates: 23,
  activeProjects: 5,
};

const mockActivities = [
  {
    id: "1",
    type: "generation",
    description: "Generated blog post about AI trends",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "document",
    description: "Saved email template 'Welcome Series'",
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "generation",
    description: "Created social media content batch",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "settings",
    description: "Updated notification preferences",
    timestamp: "3 hours ago",
  },
  {
    id: "5",
    type: "payment",
    description: "Monthly subscription renewed",
    timestamp: "Yesterday",
  },
];

const mockUsageData = [
  { label: "API Calls", value: 847, max: 1000 },
  { label: "Tokens Used", value: 89432, max: 100000 },
  { label: "Storage", value: 2.4, max: 5 },
];

import RequireAuth from "@/components/auth/RequireAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [activities, setActivities] = useState(mockActivities);
  const [usageData, setUsageData] = useState(mockUsageData);

  // Simulate fetching data
  useEffect(() => {
    // In production, fetch real data from API
    setStats(mockStats);
    setActivities(mockActivities);
    setUsageData(mockUsageData);
  }, []);

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
        </motion.div>

        {/* Stats Grid - Responsive */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8'>
          <StatsCard
            title='Generations'
            value={stats.totalGenerations.toLocaleString()}
            change='+12% from last week'
            changeType='positive'
            icon={Sparkles}
            index={0}
          />
          <StatsCard
            title='Tokens Used'
            value={`${(stats.tokensUsed / 1000).toFixed(1)}K`}
            change='89% of limit'
            changeType='neutral'
            icon={Zap}
            index={1}
          />
          <StatsCard
            title='Templates'
            value={stats.savedTemplates}
            change='+3 this month'
            changeType='positive'
            icon={FileText}
            index={2}
          />
          <StatsCard
            title='Projects'
            value={stats.activeProjects}
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
