"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({
  children,
  className,
  defaultOpen = true,
  width = 280,
}: {
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
  width?: number
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full z-40 bg-background border-r shadow-lg transition-all duration-300 flex flex-col",
        open ? "" : "-translate-x-full",
        className
      )}
      style={{ width: open ? width : 0, minWidth: open ? width : 0 }}
    >
      <button
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="absolute -right-4 top-4 z-50 bg-background border rounded-full shadow p-1 hover:bg-accent transition"
        onClick={() => setOpen((v) => !v)}
        style={{ outline: "none" }}
      >
        {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      <div className={cn("overflow-y-auto flex-1 p-6", !open && "hidden")}>{children}</div>
    </aside>
  )
}
