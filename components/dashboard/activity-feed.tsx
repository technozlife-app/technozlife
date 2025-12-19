"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText, CreditCard, Settings } from "lucide-react";

const activityIcons: Record<string, typeof Sparkles> = {
  generation: Sparkles,
  document: FileText,
  payment: CreditCard,
  settings: Settings,
};

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className='glass rounded-2xl p-5'
    >
      <h3 className='text-lg font-semibold text-white mb-4'>Recent Activity</h3>

      <div className='space-y-3'>
        {activities.length === 0 ? (
          <p className='text-sm text-slate-500 text-center py-8'>
            No recent activity
          </p>
        ) : (
          activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || Sparkles;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className='flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors'
              >
                <div className='p-2 rounded-lg bg-teal-500/10 shrink-0'>
                  <Icon className='w-4 h-4 text-teal-400' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-slate-200 truncate'>
                    {activity.description}
                  </p>
                  <p className='text-xs text-slate-500'>{activity.timestamp}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
