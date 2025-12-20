"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  Search,
  Filter,
  FileText,
  Mail,
  MessageSquare,
  Code,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/custom-toast";
import { dashboardApi } from "@/lib/api";
import { JobDetail } from "@/components/dashboard/job-detail";

const typeIcons: Record<string, typeof FileText> = {
  email: Mail,
  blog: FileText,
  social: MessageSquare,
  code: Code,
};

interface JobItem {
  id: string;
  status: string;
  prompt?: string;
  result?: string;
  tokensUsed?: number;
  createdAt?: string;
}

const typeIcons: Record<string, typeof FileText> = {
  email: Mail,
  blog: FileText,
  social: MessageSquare,
  code: Code,
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [history, setHistory] = useState<JobItem[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function loadJobs() {
      setIsLoading(true);
      try {
        const res = await dashboardApi.getJobs();
        if (res.success && res.data && mounted) {
          setHistory(res.data.jobs || []);
        } else if (!res.success) {
          addToast("error", "Failed", res.message || "Unable to fetch history");
        }
      } catch (e) {
        addToast("error", "Connection Error", "Unable to fetch history");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadJobs();
    return () => {
      mounted = false;
    };
  }, [addToast]);

  const handleCopy = (id: string) => {
    setCopiedId(id);
    addToast("success", "Copied", "Content copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    addToast("info", "Deleted", "Item removed from history");
  };

  const filteredHistory = history.filter((item) => {
    const title = item.prompt || "Untitled";
    const preview = item.result || item.prompt || "";
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className='max-w-4xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 rounded-xl bg-linear-to-br from-violet-500/20 to-purple-500/20'>
            <History className='w-6 h-6 text-violet-400' />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold text-white'>
            Generation History
          </h1>
        </div>
        <p className='text-slate-400'>
          View and manage your previously generated content
        </p>
      </motion.div>

      {/* Search and filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex flex-col sm:flex-row gap-3 mb-6'
      >
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search history...'
            className='pl-10 bg-slate-800/50 border-slate-700/50 text-white'
          />
        </div>
        <Button
          variant='outline'
          className='border-slate-700 text-slate-400 bg-transparent'
        >
          <Filter className='w-4 h-4 mr-2' />
          Filter
        </Button>
      </motion.div>

      {/* History list */}
      <div className='space-y-3'>
        {filteredHistory.map((item, index) => {
          const Icon =
            typeIcons[
              item.prompt ? item.prompt.split(" ")[0].toLowerCase() : ""
            ] || FileText;
          const title = (item.prompt || "Untitled").slice(0, 60);
          const preview = (item.result || item.prompt || "").slice(0, 120);
          const date = item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : "—";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className='glass rounded-xl p-4 group'
            >
              <div className='flex items-start gap-4'>
                <div className='p-2 rounded-lg bg-teal-500/10 shrink-0'>
                  <Icon className='w-5 h-5 text-teal-400' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2 mb-1'>
                    <h3
                      className='font-medium text-white truncate cursor-pointer'
                      onClick={() =>
                        setSelectedJobId(
                          selectedJobId === item.id ? null : item.id
                        )
                      }
                    >
                      {title}
                    </h3>
                    <span className='text-xs text-slate-500 shrink-0'>
                      {date}
                    </span>
                  </div>
                  <p className='text-sm text-slate-400 line-clamp-2 mb-2'>
                    {preview}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-slate-500'>
                      {item.tokensUsed ?? 0} tokens
                    </span>
                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleCopy(item.id)}
                        className='h-8 px-2 text-slate-400 hover:text-white'
                      >
                        {copiedId === item.id ? (
                          <Check className='w-4 h-4' />
                        ) : (
                          <Copy className='w-4 h-4' />
                        )}
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(item.id)}
                        className='h-8 px-2 text-slate-400 hover:text-red-400'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>

                  {selectedJobId === item.id && (
                    <div className='mt-3'>
                      <JobDetail
                        id={item.id}
                        prompt={item.prompt}
                        result={item.result}
                        tokensUsed={item.tokensUsed}
                        status={item.status}
                        createdAt={item.createdAt}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className='text-center py-12 text-slate-500'>
            <History className='w-12 h-12 mx-auto mb-4 opacity-50' />
            <p>No history found</p>
          </div>
        )}
      </div>
    </div>
  );
}
