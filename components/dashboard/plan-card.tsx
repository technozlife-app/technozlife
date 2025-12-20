"use client";

import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface PlanCardProps {
  id: string;
  name: string;
  price: string | number;
  description?: string;
  active?: boolean;
  icon?: LucideIcon;
  onSelect?: (id: string) => void;
}

export function PlanCard({
  id,
  name,
  price,
  description,
  active,
  icon: Icon,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={`flex-1 p-4 rounded-xl border transition-all ${
        active
          ? "bg-linear-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/50"
          : "bg-slate-800/30 border-slate-700/50"
      }`}
    >
      <div className='flex items-center gap-3 mb-3'>
        {Icon ? (
          <Icon
            className={`w-5 h-5 ${active ? "text-teal-400" : "text-slate-500"}`}
          />
        ) : null}
        <div>
          <div
            className={`font-medium ${
              active ? "text-white" : "text-slate-400"
            }`}
          >
            {name}
          </div>
          {description && (
            <div className='text-xs text-slate-500'>{description}</div>
          )}
        </div>
        {active && (
          <span className='ml-auto px-2 py-0.5 text-xs bg-teal-500/20 text-teal-400 rounded-full'>
            Current
          </span>
        )}
      </div>

      <div className='text-2xl font-bold mb-3'>
        {price}
        <span className='text-sm font-normal text-slate-500'>/mo</span>
      </div>

      <div className='flex gap-3'>
        <Button className='flex-1' onClick={() => onSelect && onSelect(id)}>
          {active ? "Manage" : "Choose"}
        </Button>
      </div>
    </div>
  );
}
