"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Mail, Search, Loader2, CheckCircle2, AlertTriangle, XCircle, HelpCircle,
  Copy, Check, ShieldCheck, Globe, Zap, Info, Plus, Trash2, Download,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type EmailStatus = "deliverable" | "risky" | "undeliverable" | "unknown";
type ValidatedBy = "bouncer" | "abstract" | "dns" | "heuristic";

interface EmailResult {
  email: string;
  pattern: string;
  status: EmailStatus;
  confidence: number;
  reason: string;
  validatedBy: ValidatedBy;
}

interface FinderResponse {
  domain: string;
  hasMX: boolean;
  validator: string;
  usingRealValidator: boolean;
  results: EmailResult[];
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  domain: string;
  loading: boolean;
  response: FinderResponse | null;
  expanded: boolean;
}

const statusConfig: Record<EmailStatus, { icon: React.ReactNode; label: string; badge: string; bar: string }> = {
  deliverable: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    label: "Deliverable",
    badge: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
  },
  risky: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    label: "Risky",
    badge: "bg-amber-100 text-amber-700",
    bar: "bg-amber-400",
  },
  unknown: {
    icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
    label: "Unknown",
    badge: "bg-slate-100 text-slate-500",
    bar: "bg-slate-300",
  },
  undeliverable: {
    icon: <XCircle className="w-4 h-4 text-red-400" />,
    label: "Invalid",
    badge: "bg-red-100 text-red-600",
    bar: "bg-red-400",
  },
};

const validatorLabel: Record<ValidatedBy, string> = {
  bouncer: "Bouncer SMTP",
  abstract: "Abstract API",
  dns: "DNS + MX",
  heuristic: "Pattern score",
};

const patternLabel: Record<string, string> = {
  "firstname.lastname": "john.doe",
  "firstname": "john",
  "f.lastname": "j.doe",
  "flastname": "jdoe",
  "firstnamelastname": "johndoe",
  "firstname_lastname": "john_doe",
  "lastname.firstname": "doe.john",
  "firstnamel": "johnd",
};

function newPerson(): Person {
  return { id: `p-${Date.now()}`, firstName: "", lastName: "", domain: "", loading: false, response: null, expanded: true };
}

export default function EmailFinderPage() {
  const [sharedDomain, setSharedDomain] = useState("");
  const [persons, setPersons] = useState<Person[]>([newPerson()]);
  const [copied, setCopied] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  function updatePerson(id: string, updates: Partial<Person>) {
    setPersons((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  async function findEmail(id: string) {
    const person = persons.find((p) => p.id === id);
    if (!person) return;
    const domain = sharedDomain.trim() || person.domain.trim();
    if (!person.firstName.trim() || !person.lastName.trim() || !domain) return;

    updatePerson(id, { loading: true, response: null });
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: person.firstName.trim(), lastName: person.lastName.trim(), domain }),
      });
      const data = await res.json();
      updatePerson(id, { loading: false, response: data, expanded: true });
    } catch {
      updatePerson(id, { loading: false });
    }
  }

  async function findAllEmails() {
    const domain = sharedDomain.trim();
    const validPersons = persons.filter((p) => p.firstName.trim() && p.lastName.trim() && (domain || p.domain.trim()));
    if (!validPersons.length) return;

    setGlobalLoading(true);
    // Run all in parallel
    await Promise.all(validPersons.map((p) => findEmail(p.id)));
    setGlobalLoading(false);
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 2000);
  }

  function exportCSV() {
    const rows: string[] = ["First Name,Last Name,Domain,Best Email,Status,Confidence,Pattern,Validator"];
    for (const p of persons) {
      if (!p.response?.results.length) continue;
      const best = p.response.results[0];
      rows.push(`${p.firstName},${p.lastName},${p.response.domain},${best.email},${best.status},${best.confidence}%,${best.pattern},${best.validatedBy}`);
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "generated_emails.csv";
    a.click();
  }

  const completedCount = persons.filter((p) => p.response !== null).length;
  const deliverableCount = persons.reduce((acc, p) => acc + (p.response?.results.filter((r) => r.status === "deliverable").length ?? 0), 0);

  return (
    <MainLayout>
      <div className="animate-slide-in-up max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-brand-600" />
            <h1 className="text-xl font-bold text-slate-900">Email Finder</h1>
          </div>
          <p className="text-sm text-slate-500">
            Generate professional email patterns for leads and verify deliverability via Bouncer SMTP, Abstract API, or DNS checks
          </p>
        </div>

        {/* Shared domain + bulk actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card mb-5">
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Company Domain <span className="text-slate-400 font-normal">(applies to all rows if set)</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="input-field pl-9 h-10"
                  placeholder="stripe.com"
                  value={sharedDomain}
                  onChange={(e) => setSharedDomain(e.target.value.replace(/^https?:\/\/(www\.)?/, "").split("/")[0])}
                />
              </div>
            </div>
            <Button onClick={findAllEmails} disabled={globalLoading} className="h-10">
              {globalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Find All Emails
            </Button>
            {completedCount > 0 && (
              <Button variant="secondary" onClick={exportCSV} className="h-10">
                <Download className="w-4 h-4" />Export CSV
              </Button>
            )}
          </div>

          {completedCount > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-sm">
              <span className="text-slate-500">{completedCount} searched</span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />{deliverableCount} deliverable
              </span>
            </div>
          )}
        </div>

        {/* Person rows */}
        <div className="space-y-3">
          {persons.map((person, idx) => {
            const topEmail = person.response?.results[0];
            return (
              <div key={person.id} className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
                {/* Row header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-50">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      className="input-field h-9 text-sm"
                      placeholder="First Name *"
                      value={person.firstName}
                      onChange={(e) => updatePerson(person.id, { firstName: e.target.value })}
                    />
                    <input
                      className="input-field h-9 text-sm"
                      placeholder="Last Name *"
                      value={person.lastName}
                      onChange={(e) => updatePerson(person.id, { lastName: e.target.value })}
                    />
                    <input
                      className="input-field h-9 text-sm"
                      placeholder={sharedDomain ? `Using: ${sharedDomain}` : "Domain (override)"}
                      value={person.domain}
                      onChange={(e) => updatePerson(person.id, { domain: e.target.value })}
                      disabled={!!sharedDomain}
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => findEmail(person.id)}
                      disabled={person.loading || !person.firstName.trim() || !person.lastName.trim() || (!sharedDomain && !person.domain.trim())}
                      className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      {person.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      Find
                    </button>
                    {persons.length > 1 && (
                      <button
                        onClick={() => setPersons((prev) => prev.filter((p) => p.id !== person.id))}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Loading */}
                {person.loading && (
                  <div className="flex items-center gap-3 px-5 py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                    <span className="text-sm text-slate-500">Generating patterns and validating…</span>
                  </div>
                )}

                {/* Results */}
                {person.response && !person.loading && (
                  <div className="px-5 py-4 space-y-3">
                    {/* Meta row */}
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                        {person.response.validator}
                      </div>
                      <div className={cn("flex items-center gap-1", person.response.hasMX ? "text-emerald-600" : "text-red-500")}>
                        <Globe className="w-3.5 h-3.5" />
                        {person.response.hasMX ? `${person.response.domain} accepts mail` : "No MX records found"}
                      </div>
                      {!person.response.usingRealValidator && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Info className="w-3.5 h-3.5" />
                          DNS mode — add BOUNCER_API_KEY for SMTP verification
                        </div>
                      )}
                      <button
                        onClick={() => updatePerson(person.id, { expanded: !person.expanded })}
                        className="ml-auto flex items-center gap-1 text-slate-400 hover:text-slate-600"
                      >
                        {person.expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {person.expanded ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {/* Best email always visible */}
                    {topEmail && (
                      <div
                        className={cn(
                          "flex items-center justify-between gap-3 px-4 py-3 rounded-xl",
                          topEmail.status === "deliverable" ? "bg-emerald-50 border border-emerald-200" :
                          topEmail.status === "risky" ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {statusConfig[topEmail.status].icon}
                          <div>
                            <p className="font-mono text-sm font-semibold text-slate-900">{topEmail.email}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", statusConfig[topEmail.status].badge)}>
                                {statusConfig[topEmail.status].label}
                              </span>
                              <span className="text-xs text-slate-400">{topEmail.confidence}% confidence</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => copyEmail(topEmail.email)}
                          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors shrink-0"
                        >
                          {copied === topEmail.email ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied === topEmail.email ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}

                    {/* All patterns expandable */}
                    {person.expanded && person.response.results.length > 1 && (
                      <div className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 flex items-center justify-between">
                          <span>All {person.response.results.length} patterns</span>
                          <span>Click row to copy</span>
                        </div>
                        {person.response.results.slice(1).map((r) => (
                          <div
                            key={r.email}
                            onClick={() => copyEmail(r.email)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 border-t border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors",
                              r.status === "undeliverable" && "opacity-40"
                            )}
                          >
                            {statusConfig[r.status].icon}
                            <span className="font-mono text-sm text-slate-700 flex-1">{r.email}</span>
                            <span className="text-xs text-slate-400">{patternLabel[r.pattern] ?? r.pattern}</span>
                            <div className="w-16">
                              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full", statusConfig[r.status].bar)} style={{ width: `${r.confidence}%` }} />
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 w-8 text-right">{r.confidence}%</span>
                            {copied === r.email
                              ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              : <Copy className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add person */}
        <button
          onClick={() => setPersons((prev) => [...prev, newPerson()])}
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
        >
          <Plus className="w-4 h-4" />Add another person
        </button>

        {/* Validator key notice */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-600">Email validation modes</p>
          <p><span className="font-medium text-brand-600">Bouncer SMTP</span> — Most accurate (SMTP handshake per address). Set <code className="bg-slate-200 px-1 rounded">BOUNCER_API_KEY</code>.</p>
          <p><span className="font-medium text-violet-600">Abstract API</span> — Good accuracy (free tier available). Set <code className="bg-slate-200 px-1 rounded">ABSTRACT_API_KEY</code>.</p>
          <p><span className="font-medium text-amber-600">DNS + MX</span> — Always active (free, no key). Validates domain mail server; marks individual addresses as Risky.</p>
        </div>
      </div>
    </MainLayout>
  );
}
