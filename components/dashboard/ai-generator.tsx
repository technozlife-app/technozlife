"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/components/ui/custom-toast";

const contentTypes = [
  { value: "email", label: "Email" },
  { value: "blog", label: "Blog Post" },
  { value: "social", label: "Social Media" },
  { value: "code", label: "Code" },
  { value: "summary", label: "Summary" },
];

export function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("email");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast(
        "warning",
        "Empty Prompt",
        "Please enter a prompt to generate content"
      );
      return;
    }

    setIsGenerating(true);
    setResult("");

    try {
      const response = await dashboardApi.generateContent(prompt, contentType);

      if (response.success && response.data) {
        // Immediate content returned
        if (response.data.content) {
          setResult(response.data.content);
          addToast(
            "success",
            "Content Generated",
            `Used ${response.data.tokensUsed ?? 0} tokens`
          );
        } else if ((response.data as any).jobId) {
          // Async job returned - poll for status
          const jobId = (response.data as any).jobId as string;
          addToast("info", "Generation Queued", "Processing your request...");

          let attempts = 0;
          const maxAttempts = 20; // ~30s polling (with 1500ms interval)

          const poll = async () => {
            try {
              attempts += 1;
              const statusRes = await dashboardApi.getJobStatus(jobId);
              if (statusRes.success && statusRes.data) {
                const { result: r, status, tokensUsed } = statusRes.data as any;
                if (r) {
                  setResult(r);
                  addToast(
                    "success",
                    "Content Ready",
                    `Used ${tokensUsed ?? 0} tokens`
                  );
                  setIsGenerating(false);
                  return;
                }

                if (status === "failed") {
                  addToast(
                    "error",
                    "Generation Failed",
                    "The job failed on the server"
                  );
                  setIsGenerating(false);
                  return;
                }

                if (attempts < maxAttempts) {
                  setTimeout(poll, 1500);
                } else {
                  addToast(
                    "error",
                    "Generation Timeout",
                    "The generation is taking too long. Please try again later."
                  );
                  setIsGenerating(false);
                }
              } else {
                addToast(
                  "error",
                  "Status Error",
                  statusRes.message || "Unable to fetch job status"
                );
                setIsGenerating(false);
              }
            } catch (e) {
              addToast(
                "error",
                "Polling Error",
                "Unable to fetch job status. Please try again."
              );
              setIsGenerating(false);
            }
          };

          // Start polling
          setTimeout(poll, 1000);
        } else {
          // Fallback simulated content
          const simulatedContent = `Generated ${contentType} content based on your prompt:\n\n"${prompt}"\n\nThis is a simulated response demonstrating the AI generation capability. In production, this would be actual AI-generated content tailored to your specific request.`;
          setResult(simulatedContent);
          addToast("info", "Demo Mode", "Showing simulated content");
        }
      } else {
        addToast(
          "error",
          "Generation Failed",
          response.message || "Unable to generate content"
        );
      }
    } catch (err) {
      addToast(
        "error",
        "Generation Failed",
        "Unable to generate content. Please try again."
      );
    } finally {
      // don't clear isGenerating here when job is polling - but ensure it's cleared when immediate
      if (!result) {
        // if result is empty, we remain in generating state until poll resolves
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    addToast("success", "Copied", "Content copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='glass rounded-2xl p-5'
    >
      <div className='flex items-center gap-3 mb-4'>
        <div className='p-2 rounded-lg bg-linear-to-br from-teal-500/20 to-emerald-500/20'>
          <Sparkles className='w-5 h-5 text-teal-400' />
        </div>
        <h3 className='text-lg font-semibold text-white'>
          AI Content Generator
        </h3>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='text-sm text-slate-400 mb-2 block'>
            Content Type
          </label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className='bg-slate-800/50 border-slate-700/50 text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-slate-900 border-slate-800'>
              {contentTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className='text-slate-200 focus:bg-slate-800'
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm text-slate-400 mb-2 block'>
            Your Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Describe what you want to generate...'
            rows={3}
            className='bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-600 resize-none'
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className='w-full bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400'
        >
          {isGenerating ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Generating...
            </>
          ) : (
            <>
              <Send className='w-4 h-4 mr-2' />
              Generate
            </>
          )}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className='relative'
          >
            <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/50'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-xs text-slate-500'>
                  Generated Content
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleCopy}
                  className='h-7 px-2 text-slate-400 hover:text-white'
                >
                  {copied ? (
                    <Check className='w-4 h-4' />
                  ) : (
                    <Copy className='w-4 h-4' />
                  )}
                </Button>
              </div>
              <p className='text-sm text-slate-300 whitespace-pre-wrap'>
                {result}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
