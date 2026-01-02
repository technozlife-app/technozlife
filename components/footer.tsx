"use client";

import { motion } from "framer-motion";
import {
  FaXTwitter as Twitter,
  FaFacebook as Facebook,
  FaLinkedin as Linkedin,
  FaYoutube as Youtube,
  FaPinterest as Pinterest,
} from "react-icons/fa6";

import type { ComponentType } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./logo";

type FooterLink = {
  label: string;
  href: string;
  target?: "_self" | "_blank";
  rel?: string;
};
type FooterLinks = Record<"Navigate" | "Resources" | "Legal", FooterLink[]>;

type SocialLink = {
  icon: ComponentType<any>;
  href: string;
  label: string;
  target?: "_self" | "_blank";
  rel?: string;
};

const footerLinks: FooterLinks = {
  Navigate: [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
  Resources: [
    { label: "Blog", href: "/blog", target: "_self" },
    {
      label: "F6S",
      href: "https://www.f6s.com/technoz-life",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      label: "Crunchbase",
      href: "https://www.crunchbase.com/organization/technozlife",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks: SocialLink[] = [
  {
    icon: Twitter,
    href: "https://x.com/Technoz_Life",
    label: "Twitter",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/technoz-life/",
    label: "LinkedIn",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@Technoz_Life",
    label: "YouTube",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/technozlife/",
    label: "Facebook",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    icon: Pinterest,
    href: "https://www.pinterest.com/technozlife/",
    label: "Pinterest",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleHashNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if link has a hash (e.g., "/#features")
    if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.substring(2); // Remove "/#" prefix
      
      // If not on home page, navigate to home first
      if (pathname !== "/") {
        router.push("/");
        // Small delay to ensure navigation completes before scrolling
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // Already on home, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

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
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ y: -2 }}
                    target={social.target}
                    rel={social.rel ? social.rel : undefined}
                    className='p-2.5 glass rounded-lg text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors'
                    aria-label={social.label}
                  >
                    <Icon className='w-5 h-5' />
                  </motion.a>
                );
              })}
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
                          onClick={(e) => handleHashNavigation(e, link.href)}
                          target={link.target}
                          rel={link.rel ? link.rel : undefined}
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
