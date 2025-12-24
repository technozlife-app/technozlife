"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mailApi } from "@/lib/api";
import { useToast } from "@/components/ui/custom-toast";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@technozlife.com" },
  {
    icon: MapPin,
    label: "Location",
    value: "380 Spring Street, Los Angeles, CA",
  },
  { icon: Clock, label: "Response Time", value: "Within 24 hours" },
];

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { addToast } = useToast();
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const captchaProviderLabel = RECAPTCHA_SITE_KEY ? "reCAPTCHA" : null;
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: any = { ...formData };

    try {
      // Execute reCAPTCHA for contact submissions
      try {
        const { executeRecaptcha } = await import("@/lib/recaptcha");
        const token = await executeRecaptcha("contact");
        if (token) payload.recaptcha_token = token;
      } catch (err) {
        addToast(
          "error",
          "Captcha Error",
          "Unable to verify reCAPTCHA. Please try again or contact support."
        );
        setIsLoading(false);
        return;
      }

      const result = await mailApi.sendContact(payload);

      if (result.status === "success") {
        setIsSubmitted(true);
        addToast(
          "success",
          "Message Sent",
          "We'll get back to you within 24 hours"
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        addToast(
          "error",
          "Failed to Send",
          result.message || "Please try again later"
        );
      }
    } catch {
      addToast(
        "error",
        "Connection Error",
        "Unable to reach server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id='contact' className='relative py-32 overflow-hidden'>
      {/* Background mesh */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 mesh-gradient opacity-40' />
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl' />
      </div>

      <div className='relative max-w-6xl mx-auto px-6'>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <span className='text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block'>
            Begin Your Transformation
          </span>
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6'>
            Ready to <span className='text-gradient'>Transcend</span>?
          </h2>
          <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
            Take the first step towards bio-digital integration. Our team is
            ready to guide you through the process.
          </p>
        </motion.div>

        {/* Two column layout */}
        <div className='flex flex-col items-stretch lg:flex-row gap-12 lg:gap-16'>
          {/* Left - Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='lg:w-2/5'
          >
            <h3 className='text-2xl font-semibold text-slate-100 mb-6'>
              Get in Touch
            </h3>
            <p className='text-slate-400 mb-8 leading-relaxed'>
              Whether you're ready to start your journey or simply curious about
              the possibilities, we're here to answer your questions and guide
              you forward.
            </p>

            {/* Contact details */}
            <div className='space-y-4 mb-10'>
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='flex items-center gap-4 p-4 glass rounded-xl'
                >
                  <div className='p-2.5 rounded-lg bg-teal-500/10'>
                    <item.icon className='w-5 h-5 text-teal-400' />
                  </div>
                  <div>
                    <div className='text-xs text-slate-500 uppercase tracking-wider'>
                      {item.label}
                    </div>
                    <div className='text-slate-200'>{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social proof */}
            <div className='glass rounded-xl p-6'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex -space-x-2'>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className='w-8 h-8 rounded-full bg-linear-to-br from-slate-600 to-slate-700 border-2 border-slate-900'
                    />
                  ))}
                </div>
                <div className='text-sm text-slate-400'>
                  Join <span className='text-teal-400 font-medium'>2,000+</span>{" "}
                  others who connected this month
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className='w-4 h-4 text-amber-400 fill-current'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
                <span className='text-sm text-slate-500 ml-1'>
                  4.9/5 average rating
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='lg:w-3/5 self-center'
          >
            <div className='glass-strong rounded-2xl p-8 md:p-10 glow-teal'>
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='text-center py-12'
                >
                  <div className='inline-flex p-4 rounded-full bg-teal-500/10 mb-6'>
                    <CheckCircle2 className='w-12 h-12 text-teal-400' />
                  </div>
                  <h3 className='text-2xl font-semibold text-slate-100 mb-3'>
                    Message Received
                  </h3>
                  <p className='text-slate-400'>
                    Thank you for reaching out. Our team will contact you within
                    24 hours to begin your journey.
                  </p>
                  <Button
                    variant='outline'
                    className='mt-6 border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent'
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className='flex h-full flex-col justify-center space-y-6'
                >
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <label className='text-sm text-slate-400'>
                        Full Name
                      </label>
                      <Input
                        required
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder='Your name'
                        className='bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm text-slate-400'>
                        Email Address
                      </label>
                      <Input
                        required
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='your.email@example.com'
                        className='bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm text-slate-400'>Subject</label>
                    <Input
                      required
                      name='subject'
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder='How can we help?'
                      className='bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm text-slate-400'>Message</label>
                    <Textarea
                      required
                      rows={5}
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder='Tell us about your interest in bio-digital integration...'
                      className='bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-600 focus:border-teal-500/50 focus:ring-teal-500/20 resize-none'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='w-full bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 font-semibold hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isLoading ? (
                        <span className='flex items-center gap-2'>
                          <svg
                            className='animate-spin h-4 w-4'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                              fill='none'
                            />
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className='flex items-center gap-2'>
                          <Send className='w-4 h-4' />
                          Send Message
                        </span>
                      )}
                    </Button>

                    {/* reCAPTCHA status */}
                    {!captchaProviderLabel ? (
                      <p className='text-sm text-amber-400 mt-2'>
                        reCAPTCHA not configured — Contact form will not be
                        protected. Please set{" "}
                        <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> in your
                        environment.
                      </p>
                    ) : (
                      <p className='text-sm text-slate-500 mt-2'>
                        This form is protected by{" "}
                        <strong>{captchaProviderLabel}</strong>.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
