"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash2 } from "lucide-react";

interface JobDetailProps {
  id: string;
  prompt?: string;
  result?: string;
  tokensUsed?: number;
  status?: string;
  createdAt?: string;
}

export function JobDetail({
  id,
  prompt,
  result,
  tokensUsed,
  status,
  createdAt,
}: JobDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generation_${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    // Placeholder: deletion will require backend support
    // For now, simply show a toast in the consumer
  }; 

  return (
    <div className='bg-slate-900/60 border border-white/5 rounded-xl p-4'>
      <div className='flex items-start justify-between gap-4 mb-3'>
        <div>
          <div className='text-xs text-slate-500'>Generated</div>
          <div className='text-sm text-slate-300'>
            {createdAt ? new Date(createdAt).toLocaleString() : "—"}
          </div>
        </div>
        <div className='text-right'>
          <div className='text-xs text-slate-500'>Status</div>
          <div className='text-sm text-slate-300'>{status || "—"}</div>
        </div>
      </div>

      <div className='mb-3'>
        <div className='text-xs text-slate-500 mb-1'>Prompt</div>
        <div className='text-sm text-slate-200 whitespace-pre-wrap bg-slate-800/30 rounded p-3'>
          {prompt || ""}
        </div>
      </div>

      <div className='mb-3'>
        <div className='text-xs text-slate-500 mb-1'>Result</div>
        <div className='text-sm text-slate-200 whitespace-pre-wrap bg-slate-800/30 rounded p-3 min-h-20'>
          {result || "(pending)"}
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='text-xs text-slate-500'>
          Tokens: <span className='text-slate-300'>{tokensUsed ?? 0}</span>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleCopy}
            className='h-8 px-2'
          >
            <Copy className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDownload}
            className='h-8 px-2'
          >
            <Download className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDelete}
            className='h-8 px-2 text-red-400'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
