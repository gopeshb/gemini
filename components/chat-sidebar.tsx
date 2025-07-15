"use client"

import React from "react"
import { Sidebar } from "./sidebar"
import { Settings, HelpCircle, MessageSquare, LifeBuoy, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Chats", icon: MessageSquare, active: true },
  { label: "Frontend", icon: LayoutDashboard },
  { label: "Settings", icon: Settings },
  { label: "Help", icon: HelpCircle },
  { label: "Support", icon: LifeBuoy },
]

export function ChatSidebar({ className }: { className?: string }) {
  return (
    <Sidebar className={cn("bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800", className)}>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition font-medium",
              active && "bg-zinc-100 dark:bg-zinc-800 text-primary"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-8 text-xs text-zinc-400 px-4">
        Gemini-like sidebar UI. Add your chat list, settings, help, and support here.
      </div>
    </Sidebar>
  )
}
