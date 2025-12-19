import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardSidebar />
      {/* Main content area - responsive margin for sidebar */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 pt-16 lg:pt-6 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
