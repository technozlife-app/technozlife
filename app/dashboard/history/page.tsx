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
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/custom-toast";
import { JobDetail } from "@/components/dashboard/job-detail";

const typeIcons: Record<string, typeof FileText> = {
  email: Mail,
  blog: FileText,
  social: MessageSquare,
  code: Code,
};

interface JobItem {
  id: string;
  status: "completed" | "processing" | "failed";
  prompt?: string;
  result?: string;
  tokensUsed?: number;
  createdAt?: string;
  type?: string;
}

// Simulated job generation
const generateSimulatedJobs = (): JobItem[] => {
  const prompts = [
    "Write a professional email introducing our new product launch",
    "Create a blog post about AI technology trends",
    "Generate social media captions for our brand campaign",
    "Write clean React component code for a dashboard",
    "Create an email newsletter template for subscribers",
    "Generate SEO-optimized blog content about machine learning",
    "Create engaging social media posts for product promotion",
    "Write TypeScript code for API integration",
    "Generate professional email responses to customer inquiries",
    "Create content for our company blog about innovation",
  ];

  const types = ["email", "blog", "social", "code"];
  const statuses: JobItem["status"][] = ["completed", "processing", "failed"];

  return Array.from({ length: 15 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    let result = "";
    if (status === "completed") {
      result = `Generated ${type} content based on: "${prompt}". This is simulated content that would normally be the full AI-generated result.`;
    }

    return {
      id: `job-${i + 1}`,
      status,
      prompt,
      result,
      tokensUsed:
        status === "completed"
          ? Math.floor(Math.random() * 500) + 50
          : undefined,
      createdAt,
      type,
    };
  }).sort(
    (a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!mounted) return;

      // Generate simulated jobs
      const simulatedJobs = generateSimulatedJobs();
      setHistory(simulatedJobs);
      setIsLoading(false);

      // Set up dynamic updates - occasionally change job status
      const interval = setInterval(() => {
        if (!mounted) return;

        setHistory((prev) =>
          prev.map((job) => {
            // Randomly update processing jobs to completed
            if (job.status === "processing" && Math.random() < 0.1) {
              return {
                ...job,
                status: "completed" as const,
                result: `Generated ${job.type} content based on: "${job.prompt}". This is simulated content that would normally be the full AI-generated result.`,
                tokensUsed: Math.floor(Math.random() * 500) + 50,
              };
            }
            return job;
          })
        );
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
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
    setHistory((prev) => prev.filter((job) => job.id !== id));
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
                    <div className='flex items-center gap-2 shrink-0'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : item.status === "processing"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.status === "completed" && (
                          <CheckCircle className='w-3 h-3 inline mr-1' />
                        )}
                        {item.status === "processing" && (
                          <Clock className='w-3 h-3 inline mr-1' />
                        )}
                        {item.status === "failed" && (
                          <XCircle className='w-3 h-3 inline mr-1' />
                        )}
                        {item.status}
                      </span>
                      <span className='text-xs text-slate-500'>{date}</span>
                    </div>
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
