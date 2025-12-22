"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserProfile } from "@/lib/api";

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='glass rounded-2xl p-5'>
        <p className='text-sm text-slate-400'>Not signed in</p>
        <Link href='/auth'>
          <Button className='mt-3'>Sign in</Button>
        </Link>
      </div>
    );
  }

  const avatar = (user as UserProfile).avatar || "/avatar-placeholder.svg";
  const displayName = (user as UserProfile).first_name
    ? `${(user as UserProfile).first_name}${
        (user as UserProfile).last_name
          ? ` ${(user as UserProfile).last_name}`
          : ""
      }`
    : (user as UserProfile).username || user.email || "User";
  const plan =
    (user as UserProfile).current_plan ||
    (user as UserProfile).current_plan ||
    null;
  const memberSince =
    (user as UserProfile).created_at || (user as UserProfile).created_at
      ? new Date(
          (user as UserProfile).created_at || (user as UserProfile).created_at
        ).toLocaleDateString()
      : null;

  return (
    <div className='glass rounded-2xl p-5'>
      <div className='flex items-center gap-4'>
        <img
          src={avatar}
          alt={displayName}
          className='w-12 h-12 rounded-full'
        />
        <div className='flex-1 min-w-0'>
          <div className='text-sm font-semibold text-white truncate'>
            {displayName}
          </div>
          <div className='text-xs text-slate-400 truncate'>{user.email}</div>
        </div>
      </div>

      <div className='mt-4 border-t border-white/5 pt-4 grid grid-cols-2 gap-3'>
        <div>
          <div className='text-xs text-slate-400'>Plan</div>
          <div className='text-sm text-white mt-1'>{plan || "None"}</div>
        </div>
        <div>
          <div className='text-xs text-slate-400'>Member since</div>
          <div className='text-sm text-white mt-1'>{memberSince || "—"}</div>
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        <Link href='/dashboard/settings'>
          <Button variant='outline' className='flex-1'>
            Edit Profile
          </Button>
        </Link>
        <Link href='/dashboard/billing'>
          <Button className='flex-1'>Manage Plan</Button>
        </Link>
      </div>
    </div>
  );
}
