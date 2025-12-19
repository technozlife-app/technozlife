import React from "react";
import Link from "next/link";

export default function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate?: string;
  children: React.ReactNode;
}) {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16'>
      <article>
        <header className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-slate-100 mb-2'>
            {title}
          </h1>
          {effectiveDate && (
            <p className='text-sm text-slate-400'>
              Effective date: {effectiveDate}
            </p>
          )}
        </header>

        <div className='prose prose-invert max-w-none text-slate-300'>
          {children}
        </div>

        <footer className='mt-12 text-sm text-slate-500'>
          <p>
            Back to <Link href='/'>home</Link>
          </p>
        </footer>
      </article>
    </main>
  );
}
