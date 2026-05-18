"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Buscar pacientes ou consultas..."
            className="w-full rounded-full bg-zinc-50 pl-10 border-zinc-200 focus-visible:ring-emerald-500 dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-zinc-200 dark:border-zinc-800 cursor-pointer">
          <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
        <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-emerald-100 dark:border-emerald-900 bg-emerald-50 flex items-center justify-center cursor-pointer">
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">NH</span>
        </div>
      </div>
    </header>
  );
}