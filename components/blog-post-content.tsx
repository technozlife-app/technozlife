"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Twitter,
  Linkedin,
  Link2,
  ArrowUpRight,
} from "lucide-react";
import { FloatingNav } from "@/components/floating-nav";
import { GetStartedButton } from "@/components/get-started-button";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog-data";
import ReactMarkdown from "react-markdown";

interface BlogPostContentProps {
  post: BlogPost;
  recentPosts: BlogPost[];
}

export function BlogPostContent({ post, recentPosts }: BlogPostContentProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 overflow-hidden'>
      {/* Background effects */}
      <div className='fixed inset-0 mesh-gradient opacity-30' />
      <div className='fixed inset-0 noise-overlay pointer-events-none' />

      <FloatingNav />
      <GetStartedButton />

      {/* Back Button */}
      <div className='relative pt-24 px-6'>
        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors group'
            >
              <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
              Back to Blog
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Article Header */}
      <article className='relative'>
        <header className='px-6 pt-8 pb-12'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge
                variant='outline'
                className='mb-6 border-violet-500/30 text-violet-400 px-4 py-1.5'
              >
                {post.category}
              </Badge>

              <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight'>
                {post.title}
              </h1>

              <p className='text-xl text-slate-400 mb-8 leading-relaxed'>
                {post.excerpt}
              </p>

              {/* Meta Row */}
              <div className='flex flex-wrap items-center gap-6 pb-8 border-b border-slate-800/50'>
                <div className='flex items-center gap-4'>
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className='w-12 h-12 rounded-full object-cover border-2 border-teal-500/30'
                  />
                  <div>
                    <p className='font-medium text-slate-100'>
                      {post.author.name}
                    </p>
                    <p className='text-sm text-slate-500'>{post.author.role}</p>
                  </div>
                </div>

                <div className='flex items-center gap-6 text-sm text-slate-500'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    {post.readTime}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className='flex items-center gap-2 ml-auto'>
                  <span className='text-sm text-slate-500 mr-2'>Share</span>
                  <motion.button
                    whileHover={{ y: -2 }}
                    className='p-2 glass rounded-lg text-slate-400 hover:text-teal-400 transition-colors'
                    aria-label='Share on Twitter'
                  >
                    <Twitter className='w-4 h-4' />
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    className='p-2 glass rounded-lg text-slate-400 hover:text-teal-400 transition-colors'
                    aria-label='Share on LinkedIn'
                  >
                    <Linkedin className='w-4 h-4' />
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    className='p-2 glass rounded-lg text-slate-400 hover:text-teal-400 transition-colors'
                    aria-label='Copy link'
                  >
                    <Link2 className='w-4 h-4' />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='px-6 pb-16'
        >
          <div className='max-w-5xl mx-auto'>
            <div className='relative rounded-3xl overflow-hidden'>
              <div className='absolute -inset-2 bg-linear-to-r from-teal-500/20 via-violet-500/20 to-emerald-500/20 rounded-3xl blur-xl' />
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className='relative w-full h-64 md:h-96 lg:h-125 object-cover rounded-3xl'
              />
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='px-6 pb-24'
        >
          <div className='max-w-3xl mx-auto'>
            <div
              className='prose prose-lg prose-invert prose-slate max-w-none
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-100
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-100 prose-strong:font-semibold
              prose-blockquote:border-l-teal-500 prose-blockquote:bg-slate-900/50 
              prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl
              prose-blockquote:text-slate-300 prose-blockquote:italic prose-blockquote:not-italic
              prose-code:text-teal-400 prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-slate-900/80 prose-pre:border prose-pre:border-slate-700/50
              prose-ul:text-slate-300 prose-ol:text-slate-300
              prose-li:marker:text-teal-500
            '
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* Author Bio */}
        <div className='px-6 pb-24'>
          <div className='max-w-3xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='glass rounded-2xl p-8'
            >
              <div className='flex flex-col sm:flex-row items-start gap-6'>
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className='w-20 h-20 rounded-2xl object-cover border-2 border-teal-500/30'
                />
                <div>
                  <p className='text-sm text-teal-400 font-medium mb-1'>
                    Written by
                  </p>
                  <h3 className='text-xl font-bold text-slate-100 mb-1'>
                    {post.author.name}
                  </h3>
                  <p className='text-slate-400 mb-4'>{post.author.role}</p>
                  <p className='text-slate-500 text-sm leading-relaxed'>
                    Dedicated to pushing the boundaries of what's possible at
                    the intersection of humanity and technology.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {recentPosts.length > 0 && (
        <section className='relative px-6 pb-32'>
          <div className='max-w-7xl mx-auto'>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className='text-2xl font-serif font-bold mb-12 text-slate-200'
            >
              Continue Reading
            </motion.h3>

            <div className='grid md:grid-cols-2 gap-8'>
              {recentPosts.slice(0, 2).map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className='group block h-full'
                  >
                    <article className='relative glass rounded-2xl overflow-hidden h-full hover:bg-slate-800/30 transition-all duration-300'>
                      <div className='absolute -inset-px bg-linear-to-r from-teal-500/0 via-teal-500/10 to-violet-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                      <div className='relative'>
                        <div className='relative h-48 overflow-hidden'>
                          <img
                            src={relatedPost.coverImage || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                          />
                          <div className='absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent' />
                        </div>

                        <div className='p-6'>
                          <Badge
                            variant='outline'
                            className='mb-3 border-slate-600 text-slate-400 text-xs'
                          >
                            {relatedPost.category}
                          </Badge>

                          <h4 className='text-lg font-serif font-semibold mb-3 text-slate-100 group-hover:text-teal-400 transition-colors line-clamp-2'>
                            {relatedPost.title}
                          </h4>

                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-slate-500'>
                              {relatedPost.readTime}
                            </span>
                            <ArrowUpRight className='w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all' />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
