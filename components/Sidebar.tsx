"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Inbox, Users, Building2,
  Settings, Zap, ChevronDown, Circle,
} from "lucide-react";
import { companies } from "@/lib/mockData";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/inbox", icon: Inbox, label: "Unified Inbox", badge: 7 },
  { href: "/leads", icon: Users, label: "Leads" },
  { href: "/companies", icon: Building2, label: "Companies" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [activeCompany, setActiveCompany] = useState(companies[0]);
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col border-r border-border bg-surface sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-subtle border border-accent/30 flex items-center justify-center">
            <Zap size={14} className="text-accent fill-accent/20" />
          </div>
          <span className="font-display font-700 text-[15px] text-text-primary tracking-tight">
            OmniReach
          </span>
        </div>
      </div>

      {/* Company Switcher */}
      <div className="px-3 pt-4 pb-3 border-b border-border">
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-2 mb-2">Workspace</p>
        <button
          onClick={() => setCompanyOpen(!companyOpen)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-elevated transition-colors group"
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-display font-700 shrink-0"
            style={{ background: activeCompany.color + "22", color: activeCompany.color, border: `1px solid ${activeCompany.color}44` }}
          >
            {activeCompany.initials}
          </div>
          <span className="text-sm text-text-primary truncate flex-1 text-left font-medium">{activeCompany.name}</span>
          <ChevronDown size={12} className={clsx("text-text-secondary transition-transform", companyOpen && "rotate-180")} />
        </button>

        {companyOpen && (
          <div className="mt-1 rounded-lg border border-border bg-elevated overflow-hidden animate-slide-in">
            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveCompany(c); setCompanyOpen(false); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-border transition-colors"
              >
                <div
                  className="w-5 h-5 rounded text-[9px] font-display font-700 flex items-center justify-center shrink-0"
                  style={{ background: c.color + "22", color: c.color }}
                >
                  {c.initials}
                </div>
                <span className="text-xs text-text-primary truncate flex-1 text-left">{c.name}</span>
                <span className="text-[10px] text-text-secondary">{c.leadCount}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-2 mb-2">Navigation</p>
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all group",
                active
                  ? "bg-accent-subtle text-accent border border-accent/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-elevated"
              )}
            >
              <Icon size={15} className={clsx(active ? "text-accent" : "text-text-secondary group-hover:text-text-primary")} />
              <span className="flex-1 font-medium">{label}</span>
              {badge && (
                <span className="text-[10px] bg-accent text-base font-mono font-500 px-1.5 py-0.5 rounded-full leading-none">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live indicator */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-[11px] text-text-secondary">
          <Circle size={6} className="fill-success text-success animate-pulse" />
          <span>Live · 3 active conversations</span>
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent-subtle border border-accent/30 flex items-center justify-center text-[11px] font-display font-700 text-accent">
            YO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">You</p>
            <p className="text-[10px] text-text-secondary truncate">admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
