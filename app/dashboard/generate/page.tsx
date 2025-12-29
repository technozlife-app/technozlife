"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Wand2,
  FileText,
  Mail,
  MessageSquare,
  Code,
  ArrowRight,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/custom-toast";

const templates = [
  {
    id: "email",
    icon: Mail,
    label: "Email",
    description: "Professional emails and newsletters",
  },
  {
    id: "blog",
    icon: FileText,
    label: "Blog Post",
    description: "SEO-optimized articles",
  },
  {
    id: "social",
    icon: MessageSquare,
    label: "Social Media",
    description: "Engaging posts and captions",
  },
  {
    id: "code",
    icon: Code,
    label: "Code",
    description: "Clean, documented code snippets",
  },
];

export default function GeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const { addToast } = useToast();

  // Demo content generators for different templates
  const generateDemoContent = (template: string, prompt: string) => {
    const templates = {
      email: `# Professional Email Template

Subject: Exciting Updates About Our Latest Product Launch

Dear [Recipient Name],

I hope this email finds you well. I'm writing to share some exciting news about our upcoming product launch that I believe will be of great interest to you.

**Key Highlights:**
- Innovative features designed for modern workflows
- Enhanced user experience with intuitive interface
- Comprehensive support and documentation

Based on your prompt: "${prompt}"

We would love to schedule a demo or discussion to explore how this solution can benefit your organization. Please let me know your availability for a brief call.

Best regards,
[Your Name]
Product Manager
[Your Company]`,

      blog: `# The Future of AI Technology: What You Need to Know

## Introduction

Artificial Intelligence continues to revolutionize industries across the globe, offering unprecedented opportunities for innovation and efficiency. In this comprehensive guide, we'll explore the latest developments and what they mean for businesses and consumers alike.

## Current Trends in AI

Based on your prompt: "${prompt}"

### Machine Learning Advancements
- Deep learning algorithms achieving human-like accuracy
- Natural language processing breakthroughs
- Computer vision applications expanding rapidly

### Industry Applications
- Healthcare: Diagnostic assistance and drug discovery
- Finance: Fraud detection and algorithmic trading
- Manufacturing: Predictive maintenance and quality control

## The Road Ahead

As AI technology continues to evolve, organizations that embrace these changes will be best positioned for success in the digital age.

*This content was generated based on your specific requirements and can be customized further.*`,

      social: `🚀 Exciting News! Our latest AI-powered platform is now live!

Based on your prompt: "${prompt}"

✨ Key Features:
• Advanced content generation
• Real-time collaboration
• Seamless integration

💡 Perfect for:
- Content creators
- Marketing teams
- Business professionals

#AI #Innovation #Technology #FutureOfWork

What are you building with AI? Let us know in the comments! 👇`,

      code: `// Generated React Component Example
// Based on your prompt: "${prompt}"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GeneratedComponentProps {
  title?: string;
  data?: any[];
}

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({
  title = "Generated Component",
  data = []
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Demo data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            {JSON.stringify(item, null, 2)}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GeneratedComponent;

// Usage example:
// <GeneratedComponent title="My Data" data={[{name: "Item 1"}, {name: "Item 2"}]} />`,
    };

    return templates[template as keyof typeof templates] || templates.blog;
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      addToast(
        "warning",
        "Select Template",
        "Please select a content type first"
      );
      return;
    }
    if (!prompt.trim()) {
      addToast(
        "warning",
        "Enter Prompt",
        "Please describe what you want to generate"
      );
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setResult("");

    try {
      // Demo generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Demo API delay (2-4 seconds)
      const delay = 2000 + Math.random() * 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Generate demo content
      const generatedContent = generateDemoContent(selectedTemplate, prompt);
      setResult(generatedContent);

      // Demo token usage
      const tokensUsed = Math.floor(Math.random() * 500) + 100;

      addToast(
        "success",
        "Generated!",
        `Content created using ${tokensUsed} tokens`
      );

      // Reset progress after a short delay
      setTimeout(() => setGenerationProgress(0), 1000);
    } catch (error) {
      addToast("error", "Failed", "Unable to generate content");
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 rounded-xl bg-linear-to-br from-teal-500/20 to-emerald-500/20'>
            <Wand2 className='w-6 h-6 text-teal-400' />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold text-white'>
            AI Generator
          </h1>
        </div>
        <p className='text-slate-400'>
          Create high-quality content with our advanced AI
        </p>
      </motion.div>

      {/* Template selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6'
      >
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedTemplate === template.id
                ? "bg-linear-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/50"
                : "glass border-white/5 hover:border-white/10"
            }`}
          >
            <template.icon
              className={`w-6 h-6 mb-2 ${
                selectedTemplate === template.id
                  ? "text-teal-400"
                  : "text-slate-400"
              }`}
            />
            <p
              className={`font-medium ${
                selectedTemplate === template.id
                  ? "text-white"
                  : "text-slate-300"
              }`}
            >
              {template.label}
            </p>
            <p className='text-xs text-slate-500 mt-1 hidden md:block'>
              {template.description}
            </p>
          </button>
        ))}
      </motion.div>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='glass rounded-2xl p-5 md:p-6 mb-6'
      >
        <label className='text-sm text-slate-400 mb-3 block'>
          Describe what you want to generate
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='E.g., Write a professional email introducing our new product launch to existing customers...'
          rows={4}
          className='bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-600 resize-none mb-4'
        />
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedTemplate}
          className='w-full md:w-auto bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400'
        >
          {isGenerating ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Generating... {Math.round(generationProgress)}%
            </>
          ) : (
            <>
              <Sparkles className='w-4 h-4 mr-2' />
              Generate Content
              <ArrowRight className='w-4 h-4 ml-2' />
            </>
          )}
        </Button>

        {/* Progress bar */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mt-4'
          >
            <div className='flex items-center gap-3 mb-2'>
              <Clock className='w-4 h-4 text-teal-400' />
              <span className='text-sm text-slate-400'>
                Generating your content...
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
          </motion.div>
        )}
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='glass rounded-2xl p-5 md:p-6'
        >
          <h3 className='text-lg font-semibold text-white mb-4'>
            Generated Result
          </h3>
          <div className='bg-slate-800/50 rounded-xl p-4 border border-slate-700/50'>
            <pre className='text-sm text-slate-300 whitespace-pre-wrap font-sans'>
              {result}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}
