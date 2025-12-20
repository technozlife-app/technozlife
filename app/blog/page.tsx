"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { blogPosts, getFeaturedPost } from "@/lib/blog-data";
import { FloatingNav } from "@/components/floating-nav";
import { GetStartedButton } from "@/components/get-started-button";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";

const categories = [
  "All",
  "Research",
  "Philosophy",
  "Science",
  "Ethics",
  "Engineering",
  "Stories",
];

export default function BlogPage() {
  const featuredPost = getFeaturedPost();
  const otherPosts = blogPosts.filter((post) => !post.featured);

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 overflow-hidden'>
      {/* Background effects */}
      <div className='fixed inset-0 mesh-gradient opacity-50' />
      <div className='fixed inset-0 noise-overlay pointer-events-none' />

      <FloatingNav />
      <GetStartedButton />

      {/* Hero Section */}
      <section className='relative pt-32 pb-16 px-6'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-teal-500/10 rounded-full blur-3xl' />

        <div className='relative max-w-7xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'
          >
            <Badge
              variant='outline'
              className='mb-6 border-teal-500/30 text-teal-400 px-4 py-1.5'
            >
              Insights & Research
            </Badge>
            <h1 className='text-5xl md:text-7xl font-serif font-bold mb-6'>
              <span className='text-gradient'>The Neural</span>
              <br />
              <span className='text-slate-100'>Chronicle</span>
            </h1>
            <p className='text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed'>
              Exploring the frontiers of human potential through technology,
              ethics, and innovation.
            </p>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='flex flex-wrap justify-center gap-3 mb-16'
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0
                    ? "bg-teal-500 text-slate-950"
                    : "glass text-slate-400 hover:text-teal-400 hover:border-teal-500/30"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className='relative px-6 pb-24'>
          <div className='max-w-7xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog/${featuredPost.slug}`} className='group block'>
                <div className='relative glass rounded-3xl overflow-hidden'>
                  {/* Glow effect */}
                  <div className='absolute -inset-1 bg-linear-to-r from-teal-500/20 via-violet-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                  <div className='relative flex flex-col lg:flex-row'>
                    {/* Image */}
                    <div className='lg:w-1/2 relative overflow-hidden'>
                      <div className='absolute inset-0 bg-linear-to-r from-transparent to-slate-950/80 z-10 lg:block hidden' />
                      <motion.img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        className='w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700'
                      />
                      <Badge className='absolute top-6 left-6 z-20 bg-teal-500 text-slate-950 border-0'>
                        Featured
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className='lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center'>
                      <Badge
                        variant='outline'
                        className='w-fit mb-4 border-violet-500/30 text-violet-400'
                      >
                        {featuredPost.category}
                      </Badge>

                      <h2 className='text-2xl lg:text-4xl font-serif font-bold mb-4 group-hover:text-teal-400 transition-colors'>
                        {featuredPost.title}
                      </h2>

                      <p className='text-slate-400 mb-6 leading-relaxed line-clamp-3'>
                        {featuredPost.excerpt}
                      </p>

                      {/* Meta */}
                      <div className='flex items-center gap-6 mb-6'>
                        <div className='flex items-center gap-2 text-sm text-slate-500'>
                          <Calendar className='w-4 h-4' />
                          {new Date(
                            featuredPost.publishedAt
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className='flex items-center gap-2 text-sm text-slate-500'>
                          <Clock className='w-4 h-4' />
                          {featuredPost.readTime}
                        </div>
                      </div>

                      {/* Author */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={
                              featuredPost.author.avatar || "/placeholder.svg"
                            }
                            alt={featuredPost.author.name}
                            className='w-10 h-10 rounded-full object-cover border-2 border-slate-700'
                          />
                          <div>
                            <p className='text-sm font-medium text-slate-200'>
                              {featuredPost.author.name}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {featuredPost.author.role}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-2 text-teal-400 group-hover:gap-4 transition-all'>
                          <span className='text-sm font-medium'>
                            Read Article
                          </span>
                          <ArrowRight className='w-4 h-4' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className='relative px-6 pb-32'>
        <div className='max-w-7xl mx-auto'>
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-2xl font-serif font-bold mb-12 text-slate-200'
          >
            Latest Articles
          </motion.h3>

          <div className='space-y-8'>
            {otherPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/blog/${post.slug}`} className='group block'>
                  <article className='relative glass rounded-2xl p-6 hover:bg-slate-800/30 transition-all duration-300'>
                    {/* Hover glow */}
                    <div className='absolute -inset-px bg-linear-to-r from-teal-500/0 via-teal-500/10 to-violet-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                    <div className='relative flex flex-col md:flex-row gap-6'>
                      {/* Thumbnail */}
                      <div className='md:w-64 shrink-0'>
                        <div className='relative overflow-hidden rounded-xl'>
                          <img
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            className='w-full h-40 md:h-full object-cover group-hover:scale-105 transition-transform duration-500'
                          />
                          <div className='absolute inset-0 bg-linear-to-t from-slate-950/50 to-transparent' />
                        </div>
                      </div>

                      {/* Content */}
                      <div className='flex-1 flex flex-col justify-between'>
                        <div>
                          <div className='flex items-center gap-4 mb-3'>
                            <Badge
                              variant='outline'
                              className='border-slate-600 text-slate-400 text-xs'
                            >
                              {post.category}
                            </Badge>
                            <span className='text-xs text-slate-500 flex items-center gap-1'>
                              <Clock className='w-3 h-3' />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className='text-xl font-serif font-semibold mb-3 text-slate-100 group-hover:text-teal-400 transition-colors'>
                            {post.title}
                          </h3>

                          <p className='text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4'>
                            {post.excerpt}
                          </p>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <img
                              src={post.author.avatar || "/placeholder.svg"}
                              alt={post.author.name}
                              className='w-8 h-8 rounded-full object-cover border border-slate-700'
                            />
                            <div>
                              <p className='text-sm font-medium text-slate-300'>
                                {post.author.name}
                              </p>
                              <p className='text-xs text-slate-500'>
                                {new Date(post.publishedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

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

      {/* Newsletter CTA */}
      <section className='relative px-6 pb-32'>
        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative glass-strong rounded-3xl p-12 text-center overflow-hidden'
          >
            {/* Background decoration */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl' />
            <div className='absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl' />

            <div className='relative'>
              <h3 className='text-3xl md:text-4xl font-serif font-bold mb-4'>
                Stay <span className='text-gradient'>Connected</span>
              </h3>
              <p className='text-slate-400 mb-8 max-w-xl mx-auto'>
                Subscribe to our newsletter for the latest insights on neural
                technology, AI ethics, and the future of human potential.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all'
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='px-8 py-3 bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all'
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
