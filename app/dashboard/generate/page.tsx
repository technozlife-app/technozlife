"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Wand2, FileText, Mail, MessageSquare, Code, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { dashboardApi } from "@/lib/api"
import { useToast } from "@/components/ui/custom-toast"

const templates = [
  { id: "email", icon: Mail, label: "Email", description: "Professional emails and newsletters" },
  { id: "blog", icon: FileText, label: "Blog Post", description: "SEO-optimized articles" },
  { id: "social", icon: MessageSquare, label: "Social Media", description: "Engaging posts and captions" },
  { id: "code", icon: Code, label: "Code", description: "Clean, documented code snippets" },
]

export default function GeneratePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState("")
  const { addToast } = useToast()

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      addToast("warning", "Select Template", "Please select a content type first")
      return
    }
    if (!prompt.trim()) {
      addToast("warning", "Enter Prompt", "Please describe what you want to generate")
      return
    }

    setIsGenerating(true)
    try {
      const response = await dashboardApi.generateContent(prompt, selectedTemplate)

      if (response.success && response.data) {
        setResult(response.data.content)
        addToast("success", "Generated!", `Content created using ${response.data.tokensUsed} tokens`)
      } else {
        // Demo simulation
        const demoContent = `# Generated ${selectedTemplate} Content\n\nBased on your prompt: "${prompt}"\n\nThis is a demonstration of the AI generation capability. In production, this would be fully AI-generated content tailored to your specific requirements.\n\n---\n\nYour content would appear here with proper formatting, structure, and all the details you requested.`
        setResult(demoContent)
        addToast("info", "Demo Mode", "Showing simulated generation")
      }
    } catch {
      addToast("error", "Failed", "Unable to generate content")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20">
            <Wand2 className="w-6 h-6 text-teal-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Generator</h1>
        </div>
        <p className="text-slate-400">Create high-quality content with our advanced AI</p>
      </motion.div>

      {/* Template selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
      >
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedTemplate === template.id
                ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/50"
                : "glass border-white/5 hover:border-white/10"
            }`}
          >
            <template.icon
              className={`w-6 h-6 mb-2 ${selectedTemplate === template.id ? "text-teal-400" : "text-slate-400"}`}
            />
            <p className={`font-medium ${selectedTemplate === template.id ? "text-white" : "text-slate-300"}`}>
              {template.label}
            </p>
            <p className="text-xs text-slate-500 mt-1 hidden md:block">{template.description}</p>
          </button>
        ))}
      </motion.div>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 md:p-6 mb-6"
      >
        <label className="text-sm text-slate-400 mb-3 block">Describe what you want to generate</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Write a professional email introducing our new product launch to existing customers..."
          rows={4}
          className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-600 resize-none mb-4"
        />
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedTemplate}
          className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 md:p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Generated Result</h3>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        </motion.div>
      )}
    </div>
  )
}
