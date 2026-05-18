"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Pacientes", icon: Users, href: "/pacientes" },
  { label: "Atendimentos", icon: Calendar, href: "/atendimentos" },
  { label: "Protocolos", icon: FileText, href: "/protocolos" },
  { label: "Configurações", icon: Settings, href: "/configuracoes" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 md:flex">
      <div className="flex h-20 items-center justify-center border-b border-zinc-200 dark:border-zinc-800 px-6">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 tracking-tight">
          Nutri Helo
        </h1>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <nav className="flex-1 space-y-2">
          {routes.map((route) => {
            const active = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                )}
              >
                <route.icon className={cn("h-5 w-5", active ? "text-emerald-600 dark:text-emerald-400" : "")} />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer">
          <LogOut className="h-5 w-5" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}