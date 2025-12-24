"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { useToast } from "@/components/ui/custom-toast";

export default function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate?: string;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLElement | null>(null);
  const [toc, setToc] = useState<
    Array<{ id: string; text: string; tag: string }>
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { addToast } = useToast();

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!contentRef.current) return;
    addToast("info", "Preparing PDF", "This may take a moment...");

    // Load html2pdf from CDN dynamically
    try {
      if (!(window as any).html2pdf) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load PDF library"));
          document.head.appendChild(s);
        });
      }

      const element = contentRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${title.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      } as any;

      // @ts-ignore
      (window as any).html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      addToast("error", "PDF Error", "Unable to generate PDF");
    }
  }, [title, addToast]);

  useEffect(() => {
    if (!contentRef.current) return;
    const nodes = Array.from(
      contentRef.current.querySelectorAll("h2, h3")
    ) as HTMLElement[];
    const items = nodes
      .filter((n) => n.id)
      .map((n) => ({ id: n.id, text: n.innerText, tag: n.tagName }));
    setToc(items);

    // Observe for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      { root: null, rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [children]);

  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-16'>
      <div className='relative max-w-6xl mx-auto px-6'>
        <div className='absolute -inset-6 blur-3xl opacity-30 pointer-events-none' />

        <section className='relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900/60 to-slate-800/30 border border-slate-700/40 shadow-2xl ring-1 ring-slate-800/30'>
          <div className='flex items-start justify-between gap-8 mb-8'>
            <div>
              <h1 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 leading-tight'>
                {title}
              </h1>
              {effectiveDate && (
                <p className='mt-2 text-sm text-slate-400'>
                  Effective date:{" "}
                  <span className='font-medium'>{effectiveDate}</span>
                </p>
              )}
            </div>

            <div className='flex gap-3 items-center'>
              <Button variant='outline' asChild>
                <Link href='/' className='inline-flex items-center gap-2'>
                  <ArrowLeft className='w-4 h-4' />
                  <span>Back</span>
                </Link>
              </Button>

              <div className='flex gap-2'>
                <Button variant='ghost' onClick={handlePrint}>
                  <Printer className='w-4 h-4' />
                  <span className='ml-1 hidden sm:inline'>Print</span>
                </Button>

                <Button variant='default' onClick={handleDownloadPDF}>
                  <Download className='w-4 h-4' />
                  <span className='ml-1 hidden sm:inline'>Download PDF</span>
                </Button>
              </div>
            </div>
          </div>

          <div className='md:flex gap-12'>
            {/* Main content */}
            <article
              className='prose prose-lg prose-invert max-w-none text-slate-300 leading-relaxed md:flex-1 space-y-6 py-4'
              ref={contentRef as any}
            >
              {children}
            </article>

            {/* TOC */}
            {toc.length > 0 && (
              <nav className='hidden md:block w-60 shrink-0'>
                <div className='sticky top-28 p-4 rounded-lg bg-slate-900/30 border border-slate-800/40'>
                  <div className='text-xs uppercase text-slate-400 mb-3 tracking-wider'>
                    On this page
                  </div>
                  <ul className='space-y-2 text-sm text-slate-300'>
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block hover:text-teal-400 ${
                            activeId === item.id
                              ? "text-teal-400 font-medium"
                              : ""
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            )}
          </div>

          <div className='mt-10 border-t border-slate-800/40 pt-8 flex items-center justify-between'>
            <div className='text-sm text-slate-500'>
              Questions? Contact{" "}
              <a
                className='text-teal-400 underline'
                href='mailto:support@technozlife.com'
              >
                support@technozlife.com
              </a>
            </div>
            <div className='text-sm text-slate-400'>
              © {new Date().getFullYear()} Technozlife — All rights reserved
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
