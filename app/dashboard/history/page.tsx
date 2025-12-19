"use client";

import { useState } from "react";
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

const mockHistory = [
  {
    id: "1",
    type: "email",
    title: "Product Launch Email",
    preview: "We're excited to announce our latest innovation...",
    date: "Today, 2:30 PM",
    tokens: 234,
  },
  {
    id: "2",
    type: "blog",
    title: "AI Trends in 2025",
    preview: "The landscape of artificial intelligence is evolving rapidly...",
    date: "Today, 11:15 AM",
    tokens: 1456,
  },
  {
    id: "3",
    type: "social",
    title: "Twitter Thread",
    preview: "1/ Here's what nobody tells you about building in public...",
    date: "Yesterday",
    tokens: 89,
  },
  {
    id: "4",
    type: "code",
    title: "React Component",
    preview: "export function Button({ variant, children }) {...",
    date: "Yesterday",
    tokens: 312,
  },
];

const typeIcons: Record<string, typeof FileText> = {
  email: Mail,
  blog: FileText,
  social: MessageSquare,
  code: Code,
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleCopy = (id: string) => {
    setCopiedId(id);
    addToast("success", "Copied", "Content copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    addToast("info", "Deleted", "Item removed from history");
  };

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          const Icon = typeIcons[item.type] || FileText;
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
                    <h3 className='font-medium text-white truncate'>
                      {item.title}
                    </h3>
                    <span className='text-xs text-slate-500 shrink-0'>
                      {item.date}
                    </span>
                  </div>
                  <p className='text-sm text-slate-400 line-clamp-2 mb-2'>
                    {item.preview}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-slate-500'>
                      {item.tokens} tokens
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
