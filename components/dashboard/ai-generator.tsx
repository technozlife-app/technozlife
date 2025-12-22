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

const contentTypes = [
  { value: "email", label: "Email" },
  { value: "blog", label: "Blog Post" },
  { value: "social", label: "Social Media" },
  { value: "code", label: "Code" },
  { value: "summary", label: "Summary" },
];

// Simulated AI responses for different content types
const simulatedResponses = {
  email: [
    "Subject: Welcome to Our Platform!\n\nDear [Name],\n\nWe're thrilled to have you join our community. Our platform offers cutting-edge AI tools to help you create amazing content.\n\nBest regards,\nThe Team",
    "Subject: Product Update Notification\n\nHello valued customer,\n\nWe're excited to announce new features that will enhance your experience. Check out the latest updates in your dashboard.\n\nThank you for choosing us!",
  ],
  blog: [
    "# The Future of AI Content Generation\n\nArtificial Intelligence is revolutionizing how we create and consume content. From automated writing assistants to intelligent content suggestions, AI tools are becoming indispensable for modern creators.\n\n## Key Benefits\n\n- **Speed**: Generate content in seconds\n- **Quality**: AI-assisted writing with human-like quality\n- **Versatility**: Multiple content types supported\n\nThe possibilities are endless as AI continues to evolve.",
    "# Mastering Digital Marketing in 2025\n\nDigital marketing has evolved significantly, with AI playing a crucial role in modern strategies. Understanding these changes is key to staying competitive.\n\n## Current Trends\n\n1. **Personalization**: AI-driven content tailored to individual preferences\n2. **Automation**: Streamlined marketing workflows\n3. **Analytics**: Deep insights into campaign performance\n\nStay ahead of the curve with intelligent marketing solutions.",
  ],
  social: [
    "🚀 Just discovered an amazing AI tool that generates high-quality content in seconds! Whether you need blog posts, emails, or social media content, this platform has you covered. The future of content creation is here! #AI #ContentCreation #Tech",
    "💡 Pro tip: Use AI to enhance your content strategy! From generating ideas to polishing final drafts, AI tools can save you hours of work. What's your favorite AI writing tool? #DigitalMarketing #AI #Productivity",
  ],
  code: [
    "```javascript\nfunction generateContent(prompt, type) {\n  // AI-powered content generation\n  const templates = {\n    email: 'Professional email template',\n    blog: 'SEO-optimized article',\n    social: 'Engaging social media post'\n  };\n  \n  return templates[type] || 'Generated content';\n}\n```",
    '```python\ndef ai_content_generator(prompt: str, content_type: str) -> str:\n    """\n    Generate AI-powered content based on prompt and type.\n    \n    Args:\n        prompt: User input prompt\n        content_type: Type of content to generate\n    \n    Returns:\n        Generated content string\n    """\n    # AI processing logic would go here\n    return f"Generated {content_type} content for: {prompt}"\n```',
  ],
  summary: [
    "**Key Points Summary:**\n\n• AI content generation is revolutionizing digital creation\n• Multiple content types supported (emails, blogs, social media)\n• Significant time savings for content creators\n• Quality improvements through AI assistance\n• Future-ready technology for modern workflows",
    "**Executive Summary:**\n\nThe AI content generation platform provides comprehensive solutions for modern content creation needs. With support for multiple formats and intelligent processing, it offers significant efficiency improvements while maintaining high-quality output standards.",
  ],
};

export function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("email");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const { addToast } = useToast();

  // Simulate dynamic stats
  useEffect(() => {
    const interval = setInterval(() => {
      setGenerationCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getRandomResponse = (type: string) => {
    const responses =
      simulatedResponses[type as keyof typeof simulatedResponses] ||
      simulatedResponses.email;
    return responses[Math.floor(Math.random() * responses.length)];
  };

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

    // Simulate API delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds

    setTimeout(() => {
      try {
        const generatedContent = getRandomResponse(contentType);
        setResult(generatedContent);
        setGenerationCount((prev) => prev + 1);

        // Simulate token usage
        const tokensUsed = Math.floor(Math.random() * 500) + 100;

        addToast(
          "success",
          "Content Generated",
          `Used ${tokensUsed} tokens • Total generations: ${
            generationCount + 1
          }`
        );
      } catch (err) {
        addToast(
          "error",
          "Generation Failed",
          "Unable to generate content. Please try again."
        );
      } finally {
        setIsGenerating(false);
      }
    }, delay);
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
