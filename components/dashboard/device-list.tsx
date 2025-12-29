"use client";

import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { devicesApi } from "@/lib/mockApi";
import { WearableDevice } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/custom-toast";

export default function DeviceList() {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const { addToast } = useToast();

  const load = () => {
    const list = devicesApi.list();
    setDevices(list);
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("mockDataUpdated", h);
    return () => window.removeEventListener("mockDataUpdated", h);
  }, []);

  const handleSync = (id: string) => {
    try {
      const metrics = devicesApi.sync(id, { days: 7 });
      addToast(
        "success",
        "Device Synced",
        `Fetched ${metrics.length} data points`
      );
      load();
    } catch (e) {
      console.error(e);
      addToast("error", "Sync failed", "Could not sync device");
    }
  };

  const handleRemove = (id: string) => {
    if (!confirm("Remove device from simulation?")) return;
    devicesApi.remove(id);
    addToast(
      "success",
      "Device removed",
      "Device removed from local simulation"
    );
    load();
  };

  return (
    <RequireAuth>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
            Connected Devices
          </h1>
          <p className='text-slate-400'>
            Manage simulated wearable and IoT devices.
          </p>
        </div>

        <div className='grid gap-4'>
          {devices.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-slate-400'>
                  No devices seeded. Use the Admin Simulator to add devices.
                </div>
              </CardContent>
            </Card>
          )}

          {devices.map((d) => (
            <Card key={d.id} className='p-4'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <div className='text-white font-semibold'>
                    {d.model || d.type}
                  </div>
                  <div className='text-sm text-slate-400'>Type: {d.type}</div>
                  <div className='text-sm text-slate-400'>
                    Last sync: {d.lastSync || "-"}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button onClick={() => handleSync(d.id)}>Sync now</Button>
                  <Button
                    variant='destructive'
                    onClick={() => handleRemove(d.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </RequireAuth>
  );
}
