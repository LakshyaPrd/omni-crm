"use client";
import { useState } from "react";
import { Search, Bell, ChevronDown, Check, Plus, Settings, LogOut, User, HelpCircle } from "lucide-react";
import { companies, currentCompany } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(currentCompany);

  return (
    <header className="fixed top-0 right-0 left-0 h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-4 z-20 pl-64">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads, companies, campaigns..."
          className="input-field pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">⌘K</kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Help */}
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        {/* Company Switcher */}
        <div className="relative">
          <button
            onClick={() => { setCompanyOpen(!companyOpen); setProfileOpen(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
          >
            <div className={cn("w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold", selectedCompany.color)}>
              {selectedCompany.logo}
            </div>
            <span className="max-w-[100px] truncate">{selectedCompany.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {companyOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl border border-slate-100 shadow-card-lg py-2 animate-fade-in z-50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-1.5">Your workspaces</p>
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCompany(c); setCompanyOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold", c.color)}>
                    {c.logo}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.plan} plan</div>
                  </div>
                  {selectedCompany.id === c.id && <Check className="w-4 h-4 text-brand-600" />}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-sm text-brand-600 font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  Add workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setCompanyOpen(false); }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
              ER
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-slate-100 shadow-card-lg py-2 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Emma Richardson</p>
                <p className="text-xs text-slate-500">emma@acmecorp.com</p>
              </div>
              {[
                { icon: User, label: "My Profile" },
                { icon: Settings, label: "Account Settings" },
                { icon: HelpCircle, label: "Help & Docs" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <Icon className="w-4 h-4 text-slate-400" />
                  {label}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
