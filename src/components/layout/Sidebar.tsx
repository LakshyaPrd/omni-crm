"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Zap, Inbox,
  UserCheck, PlugZap, BarChart3, Settings, ChevronLeft,
  ChevronRight, Sparkles, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Campaigns", href: "/campaigns", icon: Zap },
  { label: "Inbox", href: "/inbox", icon: Inbox, badge: 5 },
  { label: "Hiring", href: "/hiring", icon: UserCheck },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Integrations", href: "/integrations", icon: PlugZap },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-slate-100 flex flex-col z-30 transition-all duration-300 shadow-sm",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 px-4 border-b border-slate-100 shrink-0", collapsed ? "justify-center" : "gap-2.5")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-slate-900 text-base tracking-tight">NexCRM</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "sidebar-link relative",
                  active && "active",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-4.5 h-4.5 shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto bg-brand-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-brand-600 rounded-full" />
                )}
              </div>
            </Link>
          );
        })}

        {/* AI Section */}
        <div className={cn("mt-4 pt-4 border-t border-slate-100")}>
          {!collapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">AI Tools</p>
          )}
          <div className={cn("sidebar-link cursor-pointer", collapsed && "justify-center px-2")}>
            <Bot className="w-4 h-4 shrink-0" />
            {!collapsed && <span>AI Assistant</span>}
          </div>
        </div>
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-slate-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors text-sm",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
