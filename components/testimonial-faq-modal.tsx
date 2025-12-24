"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { testimonials } from "@/lib/testimonials-data";
import { faqs } from "@/lib/faq-data";
import { Button } from "@/components/ui/button";

interface TestimonialFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialFaqModal({
  isOpen,
  onClose,
}: TestimonialFaqModalProps) {
  const [activeView, setActiveView] = useState<"testimonials" | "faq">(
    "testimonials"
  );
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentFaqPage, setCurrentFaqPage] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const constraintsRef = useRef(null);

  const faqsPerPage = 4;

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const totalFaqPages = Math.ceil(faqs.length / faqsPerPage);
  const currentFaqs = faqs.slice(
    currentFaqPage * faqsPerPage,
    (currentFaqPage + 1) * faqsPerPage
  );

  const nextFaqPage = () => {
    if (currentFaqPage < totalFaqPages - 1) {
      setCurrentFaqPage((prev) => prev + 1);
      setExpandedFaq(null);
    }
  };

  const prevFaqPage = () => {
    if (currentFaqPage > 0) {
      setCurrentFaqPage((prev) => prev - 1);
      setExpandedFaq(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentTestimonial(0);
      setCurrentFaqPage(0);
      setExpandedFaq(null);
    }
  }, [isOpen]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed inset-0 z-50 flex items-center justify-center'
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 bg-slate-950/95 backdrop-blur-sm'
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            layoutId='testimonial-modal'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 0.84, 0.24, 1] }}
            className='relative w-full h-full flex flex-col overflow-hidden'
          >
            {/* Gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
              <div className='absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl' />
              <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl' />
              <div className='absolute inset-0 mesh-gradient opacity-20' />
            </div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className='absolute top-6 right-6 z-10 p-3 rounded-full glass-strong hover:bg-slate-800/80 transition-colors group'
            >
              <X className='w-6 h-6 text-slate-400 group-hover:text-slate-100 transition-colors' />
            </motion.button>

            {/* Content area */}
            <div className='relative flex-1 flex flex-col py-20 px-6 overflow-hidden'>
              <div className='max-w-7xl mx-auto w-full flex flex-col h-full'>
                {/* Header with toggle */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='text-center mb-12'
                >
                  <h2 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6'>
                    {activeView === "testimonials"
                      ? "What Our Clients Say"
                      : "Frequently Asked Questions"}
                  </h2>
                  <p className='text-lg text-slate-400 mb-8 max-w-2xl mx-auto'>
                    {activeView === "testimonials"
                      ? "Real experiences from people who've transformed their lives through neural technology"
                      : "Get answers to common questions about neural interfaces and our process"}
                  </p>

                  {/* Toggle buttons */}
                  <div className='inline-flex gap-3 glass-strong rounded-full p-2'>
                    <Button
                      onClick={() => setActiveView("testimonials")}
                      className={`rounded-full px-6 py-2 transition-all duration-300 ${
                        activeView === "testimonials"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950"
                          : "bg-transparent text-slate-400 hover:text-slate-100"
                      }`}
                    >
                      <MessageSquare className='w-4 h-4 mr-2' />
                      Testimonials
                    </Button>
                    <Button
                      onClick={() => setActiveView("faq")}
                      className={`rounded-full px-6 py-2 transition-all duration-300 ${
                        activeView === "faq"
                          ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950"
                          : "bg-transparent text-slate-400 hover:text-slate-100"
                      }`}
                    >
                      <HelpCircle className='w-4 h-4 mr-2' />
                      FAQ
                    </Button>
                  </div>
                </motion.div>

                {/* Content switcher with animations */}
                <AnimatePresence mode='wait'>
                  {activeView === "testimonials" ? (
                    <div
                      key='testimonials'
                      className='flex-1 flex flex-col items-center justify-center relative'
                    >
                      {/* Navigation buttons */}
                      <button
                        onClick={prevTestimonial}
                        className='absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 glass-strong rounded-full hover:bg-slate-800/80 transition-all duration-300 group hover:scale-110 active:scale-95'
                        aria-label='Previous testimonial'
                      >
                        <ChevronLeft className='w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors' />
                      </button>

                      <button
                        onClick={nextTestimonial}
                        className='absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 glass-strong rounded-full hover:bg-slate-800/80 transition-all duration-300 group hover:scale-110 active:scale-95'
                        aria-label='Next testimonial'
                      >
                        <ChevronRight className='w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors' />
                      </button>

                      {/* Testimonial carousel */}
                      <div
                        className='w-full max-w-4xl px-20'
                        ref={constraintsRef}
                      >
                        <AnimatePresence
                          initial={false}
                          custom={direction}
                          mode='wait'
                        >
                          <motion.div
                            key={currentTestimonial}
                            custom={direction}
                            variants={slideVariants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            transition={{
                              x: {
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              },
                              opacity: { duration: 0.2 },
                            }}
                            drag='x'
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                              const swipe = swipePower(offset.x, velocity.x);
                              if (swipe < -swipeConfidenceThreshold) {
                                nextTestimonial();
                              } else if (swipe > swipeConfidenceThreshold) {
                                prevTestimonial();
                              }
                            }}
                            className='glass-strong rounded-3xl p-10 md:p-12 shadow-2xl cursor-grab active:cursor-grabbing'
                          >
                            {(() => {
                              const testimonial =
                                testimonials[currentTestimonial];
                              return (
                                <>
                                  {/* Rating */}
                                  <div className='flex items-center gap-1 mb-6'>
                                    {[...Array(testimonial.rating)].map(
                                      (_, i) => (
                                        <Star
                                          key={i}
                                          className='w-5 h-5 text-amber-400 fill-amber-400'
                                        />
                                      )
                                    )}
                                  </div>

                                  {/* Content */}
                                  <blockquote className='text-slate-200 text-xl md:text-2xl leading-relaxed mb-8 italic font-light'>
                                    "{testimonial.content}"
                                  </blockquote>

                                  {/* Author info */}
                                  <div className='flex items-center gap-5 pt-6 border-t border-slate-700/50'>
                                    <div className='w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg'>
                                      {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className='font-semibold text-slate-100 text-lg'>
                                        {testimonial.name}
                                      </div>
                                      <div className='text-slate-400'>
                                        {testimonial.role}
                                        {testimonial.company &&
                                          ` • ${testimonial.company}`}
                                      </div>
                                      {testimonial.condition && (
                                        <div className='text-sm text-teal-400 mt-1'>
                                          {testimonial.condition}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Date */}
                                  <div className='text-sm text-slate-500 mt-4'>
                                    {testimonial.date}
                                  </div>
                                </>
                              );
                            })()}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Pagination dots */}
                      <div className='flex items-center gap-2 mt-8'>
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setDirection(index > currentTestimonial ? 1 : -1);
                              setCurrentTestimonial(index);
                            }}
                            className={`transition-all duration-300 rounded-full ${
                              index === currentTestimonial
                                ? "w-8 h-3 bg-gradient-to-r from-teal-500 to-emerald-500"
                                : "w-3 h-3 bg-slate-600 hover:bg-slate-500"
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div key='faq' className='flex-1 flex flex-col'>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className='flex-1 max-w-4xl mx-auto w-full space-y-4'
                      >
                        {currentFaqs.map((faq, index) => {
                          const isExpanded = expandedFaq === faq.id;
                          return (
                            <motion.div
                              key={faq.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className='glass-strong rounded-xl overflow-hidden hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300'
                            >
                              <button
                                onClick={() => toggleFaq(faq.id)}
                                className='w-full flex items-start justify-between p-6 text-left group'
                              >
                                <div className='flex-1'>
                                  <div className='flex items-center gap-3 mb-2'>
                                    <span className='text-xs font-medium text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full'>
                                      {faq.category}
                                    </span>
                                  </div>
                                  <h3 className='text-lg font-semibold text-slate-100 group-hover:text-teal-400 transition-colors'>
                                    {faq.question}
                                  </h3>
                                </div>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className='flex-shrink-0 ml-4'
                                >
                                  <ChevronDown className='w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors' />
                                </motion.div>
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='overflow-hidden'
                                  >
                                    <div className='px-6 pb-6 text-slate-300 leading-relaxed border-t border-slate-700/50 pt-4'>
                                      {faq.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      {/* FAQ Pagination */}
                      {totalFaqPages > 1 && (
                        <div className='flex items-center justify-center gap-4 mt-8'>
                          <button
                            onClick={prevFaqPage}
                            disabled={currentFaqPage === 0}
                            className='p-3 glass-strong rounded-full hover:bg-slate-800/80 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group hover:scale-110 active:scale-95'
                            aria-label='Previous FAQ page'
                          >
                            <ChevronLeft className='w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors' />
                          </button>

                          <div className='flex items-center gap-2'>
                            {[...Array(totalFaqPages)].map((_, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setCurrentFaqPage(index);
                                  setExpandedFaq(null);
                                }}
                                className={`transition-all duration-300 rounded-full ${
                                  index === currentFaqPage
                                    ? "w-8 h-3 bg-gradient-to-r from-violet-500 to-purple-500"
                                    : "w-3 h-3 bg-slate-600 hover:bg-slate-500"
                                }`}
                                aria-label={`Go to FAQ page ${index + 1}`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={nextFaqPage}
                            disabled={currentFaqPage === totalFaqPages - 1}
                            className='p-3 glass-strong rounded-full hover:bg-slate-800/80 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group hover:scale-110 active:scale-95'
                            aria-label='Next FAQ page'
                          >
                            <ChevronRight className='w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors' />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
