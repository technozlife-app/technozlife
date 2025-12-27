"use client";

import { motion } from "framer-motion";
import {
  FaXTwitter as Twitter,
  FaFacebook as Facebook,
  FaLinkedin as Linkedin,
  FaYoutube as Youtube,
} from "react-icons/fa6";

import Link from "next/link";
import Logo from "./logo";

const footerLinks = {
  Navigate: [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "F6S", href: "https://www.f6s.com/technozlife" },
    {
      label: "Crunchbase",
      href: "https://www.crunchbase.com/organization/technozlife",
    },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className='relative pt-24 pb-12 overflow-hidden'>
      {/* Background fade */}
      <div className='absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/95 to-transparent' />
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-teal-500/5 rounded-full blur-3xl' />

      <div className='relative max-w-7xl mx-auto px-6'>
        {/* Main footer content */}
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16'>
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='lg:w-1/3'
          >
            {/* Logo */}
            <Logo className='mb-6' />

            <p className='text-slate-400 mb-6 leading-relaxed'>
              Smart next-era algorithms empower predictive, personalized, and
              adaptive lifestyle and wellness optimization.
            </p>

            {/* Social links */}
            <div className='flex items-center gap-3'>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -2 }}
                  className='p-2.5 glass rounded-lg text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors'
                  aria-label={social.label}
                >
                  <social.icon className='w-5 h-5' />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links columns - Updated to use simplified link structure */}
          <div className='flex-1 grid grid-cols-2 md:grid-cols-3 gap-8'>
            {Object.entries(footerLinks).map(
              ([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className='text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4'>
                    {category}
                  </h4>
                  <ul className='space-y-3'>
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          aria-label={link.label}
                          className='text-sm text-slate-500 hover:text-teal-400 transition-colors inline-block'
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='pt-8 border-t border-slate-800/50'
        >
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-slate-600'>
              &copy; {new Date().getFullYear()}{" "}
              <Link
                href='/'
                className='text-teal-400 hover:underline cursor-pointer'
              >
                Technozlife.com
              </Link>{" "}
              All rights reserved.
            </p>
            <div className='flex items-center gap-6'>
              <span className='text-xs text-slate-600'>
                Crafted for the future of humanity
              </span>
              <div className='flex items-center gap-2'>
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75' />
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-teal-500' />
                </span>
                <span className='text-xs text-teal-400'>
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
