"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/custom-toast";
import { aiApi } from "@/lib/api";

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
  const [generationCount, setGenerationCount] = useState(0);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { addToast } = useToast();

  // Simulate dynamic stats
  useEffect(() => {
    const interval = setInterval(() => {
      setGenerationCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Poll for job status if we have an async job
  useEffect(() => {
    if (!currentJobId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await aiApi.getJobStatus(currentJobId);
        if (response.success && response.data) {
          const { status, result: jobResult, tokens_used } = response.data;

          if (status === "completed" && jobResult) {
            setResult(jobResult);
            setGenerationCount((prev) => prev + 1);
            setCurrentJobId(null);
            setIsGenerating(false);
            setGenerationProgress(100);

            addToast(
              "success",
              "Content Generated",
              `Used ${tokens_used || 0} tokens • Total generations: ${
                generationCount + 1
              }`
            );

            // Reset progress after a short delay
            setTimeout(() => setGenerationProgress(0), 1000);
          } else if (status === "failed") {
            setCurrentJobId(null);
            setIsGenerating(false);
            setGenerationProgress(0);
            addToast(
              "error",
              "Generation Failed",
              "The AI generation job failed. Please try again."
            );
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [currentJobId, generationCount, addToast]);

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
    setGenerationProgress(10);

    try {
      // Create enhanced prompt with content type context
      const enhancedPrompt = `Generate ${contentType} content: ${prompt}`;

      const response = await aiApi.generate({
        prompt: enhancedPrompt,
      });

      if (response.success && response.data) {
        const { content, tokens_used, job_id } = response.data;

        if (content) {
          // Synchronous response
          setResult(content);
          setGenerationCount((prev) => prev + 1);
          setGenerationProgress(100);

          addToast(
            "success",
            "Content Generated",
            `Used ${tokens_used || 0} tokens • Total generations: ${
              generationCount + 1
            }`
          );

          // Reset progress after a short delay
          setTimeout(() => setGenerationProgress(0), 1000);
        } else if (job_id) {
          // Asynchronous response - start polling
          setCurrentJobId(job_id);
          setGenerationProgress(50);
          addToast(
            "info",
            "Generation Started",
            "Your content is being generated..."
          );
        } else {
          throw new Error("No content or job ID returned");
        }
      } else {
        throw new Error(response.message || "Generation failed");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setGenerationProgress(0);
      addToast(
        "error",
        "Generation Failed",
        error instanceof Error
          ? error.message
          : "Unable to generate content. Please try again."
      );
    } finally {
      // Only set isGenerating to false if we don't have an async job
      if (!currentJobId) {
        setIsGenerating(false);
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    addToast("success", "Copied", "Content copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
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
        <div className='ml-auto text-xs text-slate-500'>
          {generationCount} generations today
        </div>
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

        <div className='flex gap-2'>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className='flex-1 bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400'
          >
            {isGenerating ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                {currentJobId ? "Processing..." : "Generating..."}
              </>
            ) : (
              <>
                <Send className='w-4 h-4 mr-2' />
                Generate
              </>
            )}
          </Button>

          {result && (
            <Button
              onClick={handleRegenerate}
              variant='outline'
              disabled={isGenerating}
              className='border-slate-700 text-slate-300 hover:bg-slate-800'
            >
              <RefreshCw className='w-4 h-4' />
            </Button>
          )}
        </div>

        {/* Progress bar */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mt-4'
          >
            <div className='flex items-center gap-3 mb-2'>
              <Sparkles className='w-4 h-4 text-teal-400' />
              <span className='text-sm text-slate-400'>
                {currentJobId
                  ? "Processing your request..."
                  : "Generating your content..."}
              </span>
            </div>
            <div className='w-full bg-slate-700 rounded-full h-2'>
              <motion.div
                className='bg-linear-to-r from-teal-500 to-emerald-500 h-2 rounded-full'
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className='text-xs text-slate-500 mt-1 text-right'>
              {Math.round(generationProgress)}%
            </div>
          </motion.div>
        )}

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
              <div className='text-sm text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto'>
                {result}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
