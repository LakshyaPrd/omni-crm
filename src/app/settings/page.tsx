"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { teamMembers, companies } from "@/lib/data";
import {
  Building2, Users, Key, CreditCard, PlugZap, Plus, Trash2,
  Copy, Eye, EyeOff, Shield, Check, MoreHorizontal, Edit2,
} from "lucide-react";

const tabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "users", label: "Team", icon: Users },
  { id: "api", label: "API Keys", icon: Key },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const roleColors: Record<string, string> = {
  Admin: "bg-violet-100 text-violet-700",
  Manager: "bg-blue-100 text-blue-700",
  User: "bg-slate-100 text-slate-600",
};

const avatarColors = ["bg-emerald-500","bg-blue-500","bg-violet-500","bg-orange-500"];

const mockKeys = [
  { id: 1, name: "Production API Key", key: "nex_live_sk_••••••••••••4a2f", created: "Jan 12, 2025", lastUsed: "2h ago", active: true },
  { id: 2, name: "Development Key", key: "nex_test_sk_••••••••••••7b3e", created: "Mar 5, 2025", lastUsed: "5d ago", active: true },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [showKey, setShowKey] = useState<number | null>(null);

  return (
    <MainLayout>
      <div className="animate-slide-in-up">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your workspace configuration</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <div className="w-52 shrink-0">
            <nav className="space-y-0.5">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5">
            {activeTab === "company" && (
              <>
                <Card>
                  <h2 className="text-sm font-semibold text-slate-800 mb-4">Company Profile</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl">AC</div>
                      <div>
                        <Button variant="secondary" size="sm">Change Logo</Button>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Company Name", value: "Acme Corp" },
                        { label: "Website", value: "acmecorp.com" },
                        { label: "Industry", value: "SaaS" },
                        { label: "Company Size", value: "11-50 employees" },
                        { label: "Country", value: "United States" },
                        { label: "Timezone", value: "America/New_York" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label}</label>
                          <input className="input-field text-sm" defaultValue={value} />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="secondary">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-sm font-semibold text-slate-800 mb-1">Danger Zone</h2>
                  <p className="text-xs text-slate-500 mb-4">Irreversible actions for your workspace</p>
                  <div className="flex items-center justify-between py-3 border-t border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Delete Workspace</p>
                      <p className="text-xs text-slate-500">Permanently delete this workspace and all data</p>
                    </div>
                    <Button variant="danger" size="sm">Delete Workspace</Button>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "users" && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-800">Team Members</h2>
                  <Button size="sm"><Plus className="w-3.5 h-3.5" />Invite Member</Button>
                </div>
                <div className="space-y-0">
                  {teamMembers.map((member, i) => (
                    <div key={member.id} className="flex items-center gap-4 py-3 border-t border-slate-100 first:border-0">
                      <Avatar initials={member.name.split(" ").map((n) => n[0]).join("")} color={avatarColors[i % avatarColors.length]} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${roleColors[member.role]}`}>{member.role}</span>
                      <StatusBadge status={member.status} />
                      <span className="text-xs text-slate-400">{member.lastLogin}</span>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "api" && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">API Keys</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage API access to your NexCRM workspace</p>
                  </div>
                  <Button size="sm"><Plus className="w-3.5 h-3.5" />Generate Key</Button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Keep your API keys secret. Never expose them in client-side code or public repositories.</p>
                </div>

                <div className="space-y-3">
                  {mockKeys.map((k) => (
                    <div key={k.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{k.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Created {k.created} · Last used {k.lastUsed}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs text-emerald-600 font-medium">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                        <code className="text-xs text-slate-700 flex-1 font-mono">
                          {showKey === k.id ? "nex_live_sk_a1b2c3d4e5f6g7h8i9j04a2f" : k.key}
                        </code>
                        <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          {showKey === k.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">Revoke key</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "billing" && (
              <>
                {/* Current plan */}
                <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-violet-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-brand-800">Pro Plan</span>
                        <span className="badge bg-brand-600 text-white text-xs">Current</span>
                      </div>
                      <p className="text-2xl font-black text-brand-900">$99<span className="text-base font-normal text-brand-600">/month</span></p>
                      <p className="text-xs text-brand-600 mt-1">Next billing: August 1, 2025</p>
                    </div>
                    <Button variant="secondary" size="sm">Upgrade Plan</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-brand-200">
                    {[["10,000", "Contacts"], ["50", "Campaigns"], ["5", "Team Members"]].map(([val, label]) => (
                      <div key={label} className="text-center">
                        <div className="text-sm font-bold text-brand-800">{val}</div>
                        <div className="text-xs text-brand-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Usage */}
                <Card>
                  <h2 className="text-sm font-semibold text-slate-800 mb-4">Usage This Month</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Emails Sent", used: 6800, total: 10000 },
                      { label: "Contacts", used: 8400, total: 10000 },
                      { label: "AI Credits", used: 720, total: 1000 },
                    ].map(({ label, used, total }) => {
                      const pct = Math.round((used / total) * 100);
                      return (
                        <div key={label}>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-slate-600 font-medium">{label}</span>
                            <span className="text-slate-500">{used.toLocaleString()} / {total.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct > 80 ? "bg-amber-500" : "bg-brand-600"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Payment method */}
                <Card>
                  <h2 className="text-sm font-semibold text-slate-800 mb-4">Payment Method</h2>
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                    <div className="w-10 h-7 bg-slate-900 rounded-md flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">•••• •••• •••• 4242</p>
                      <p className="text-xs text-slate-500">Expires 12/26</p>
                    </div>
                    <button className="ml-auto text-xs text-brand-600 font-medium hover:underline">Update</button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
