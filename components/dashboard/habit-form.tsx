"use client";

import React, { useState } from "react";
import { habitsApi } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/custom-toast";

export default function HabitForm({ onAdded }: { onAdded?: () => void }) {
  const [name, setName] = useState("");
  const { addToast } = useToast();

  const submit = () => {
    if (!name.trim())
      return addToast("warning", "Name required", "Please enter a habit name");
    try {
      habitsApi.add({ name: name.trim(), schedule: "daily" });
      setName("");
      addToast("success", "Habit added", "New habit added");
      onAdded && onAdded();
    } catch (e) {
      console.error(e);
      addToast("error", "Create failed", "Could not create habit");
    }
  };

  return (
    <div className='flex gap-2'>
      <Input
        placeholder='New habit (e.g., Morning walk)'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={submit}>Add</Button>
    </div>
  );
}
