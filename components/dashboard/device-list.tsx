"use client";

import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { devicesApi } from "@/lib/mockApi";
import { WearableDevice } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/custom-toast";

export default function DeviceList() {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const { addToast } = useToast();
  const [newType, setNewType] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");

  const handleAdd = () => {
    if (!newModel.trim() || !newType.trim())
      return addToast("warning", "Missing", "Please enter type and model");
    try {
      devicesApi.add({ type: newType.trim(), model: newModel.trim() });
      addToast("success", "Device added", "New demo device added");
      setNewType("");
      setNewModel("");
      load();
    } catch (e) {
      console.error(e);
      addToast("error", "Add failed", "Could not add device");
    }
  };

  const handleEdit = (d: WearableDevice) => {
    const model = prompt("Model", d.model || "") ?? d.model;
    const type = prompt("Type", d.type || "") ?? d.type;
    try {
      devicesApi.update(d.id, { model, type });
      addToast("success", "Device updated", "Device updated");
      load();
    } catch (e) {
      console.error(e);
      addToast("error", "Update failed", "Could not update device");
    }
  };
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
    if (!confirm("Remove this device?")) return;
    devicesApi.remove(id);
    addToast("success", "Device removed", "Device removed from demo data");
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
            Manage demo wearable and IoT devices.
          </p>
        </div>

        <div className='mb-6 flex items-center gap-2'>
          <Input
            placeholder='Type (e.g., fitbit)'
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className='w-40'
          />
          <Input
            placeholder='Model (e.g., FitSim 1)'
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
            className='w-60'
          />
          <Button onClick={handleAdd}>Add device</Button>
        </div>

        <div className='grid gap-4'>
          {devices.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-sm text-slate-400'>
                  No devices seeded. Use the Data Manager to add demo devices.
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
                  <Button onClick={() => handleEdit(d)}>Edit</Button>
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
