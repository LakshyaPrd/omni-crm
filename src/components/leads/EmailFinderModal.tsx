"use client";
import { useState } from "react";
import {
  X, Mail, Search, Loader2, CheckCircle2, AlertTriangle, XCircle,
  HelpCircle, Copy, Check, ShieldCheck, Globe, Zap, Info,
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

interface EmailFinderModalProps {
  // Pre-fill from a lead / job card
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultDomain?: string;
  defaultCompany?: string;
  onClose: () => void;
  /** Called when user picks an email to use */
  onUseEmail?: (email: string) => void;
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

export function EmailFinderModal({
  defaultFirstName = "",
  defaultLastName = "",
  defaultDomain = "",
  defaultCompany = "",
  onClose,
  onUseEmail,
}: EmailFinderModalProps) {
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);
  const [domain, setDomain] = useState(defaultDomain.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FinderResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !domain.trim()) return;
    setLoading(true);
    setResponse(null);
    setError("");
    setShowAll(false);

    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), domain: domain.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate emails");
    } finally {
      setLoading(false);
    }
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 2000);
  }

  const deliverableCount = response?.results.filter((r) => r.status === "deliverable").length ?? 0;
  const topEmail = response?.results[0];
  const visibleResults = showAll ? (response?.results ?? []) : (response?.results.slice(0, 4) ?? []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <Mail className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Email Finder</h2>
              <p className="text-xs text-slate-500">
                {defaultCompany ? `Finding emails at ${defaultCompany}` : "Generate & validate professional emails"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Input form */}
          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name *</label>
                <input
                  className="input-field h-9 text-sm"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name *</label>
                <input
                  className="input-field h-9 text-sm"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Domain *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className="input-field pl-9 h-9 text-sm"
                  placeholder="google.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value.replace(/^https?:\/\/(www\.)?/, "").split("/")[0])}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Just the domain — e.g. stripe.com, not https://stripe.com</p>
            </div>
            <Button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim() || !domain.trim() || loading}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Generating & Validating…" : "Find Emails"}
            </Button>
          </form>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <Mail className="w-6 h-6 text-brand-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-medium text-slate-700">Generating patterns…</p>
                <p className="text-xs text-slate-500 mt-1">Validating via SMTP & DNS</p>
              </div>
            </div>
          )}

          {/* Results */}
          {response && !loading && (
            <div className="space-y-4">
              {/* Summary row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                  Validated by: <span className="text-brand-600">{response.validator}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Globe className="w-3.5 h-3.5" />
                  {response.hasMX ? (
                    <span className="text-emerald-600 font-medium">{domain} accepts email</span>
                  ) : (
                    <span className="text-red-500 font-medium">{domain} — no mail server</span>
                  )}
                </div>
                {deliverableCount > 0 && (
                  <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {deliverableCount} deliverable
                  </span>
                )}
              </div>

              {!response.usingRealValidator && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    Running in <strong>DNS + pattern mode</strong> — domain is checked but individual addresses are not SMTP-verified.
                    Add <code className="bg-amber-100 px-1 rounded">BOUNCER_API_KEY</code> or <code className="bg-amber-100 px-1 rounded">ABSTRACT_API_KEY</code> in your <code>.env.local</code> for full verification.
                  </span>
                </div>
              )}

              {/* Best email highlight */}
              {topEmail && (
                <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl">
                  <p className="text-xs font-semibold text-brand-600 mb-2 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />Best match
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-base font-semibold text-slate-900">{topEmail.email}</span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => copyEmail(topEmail.email)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        {copied === topEmail.email ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === topEmail.email ? "Copied" : "Copy"}
                      </button>
                      {onUseEmail && (
                        <Button size="sm" onClick={() => { onUseEmail(topEmail.email); onClose(); }}>
                          Use this email
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {statusConfig[topEmail.status].icon}
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusConfig[topEmail.status].badge)}>
                      {statusConfig[topEmail.status].label}
                    </span>
                    <span className="text-xs text-slate-500">{topEmail.confidence}% confidence</span>
                    <span className="text-xs text-slate-400 ml-auto">{validatorLabel[topEmail.validatedBy]}</span>
                  </div>
                </div>
              )}

              {/* All results table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    All patterns ({response.results.length})
                  </span>
                  <span className="text-xs text-slate-400">Click to copy</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {visibleResults.map((r) => (
                    <div
                      key={r.email}
                      onClick={() => copyEmail(r.email)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors",
                        r.status === "undeliverable" && "opacity-50"
                      )}
                    >
                      {statusConfig[r.status].icon}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-slate-800 truncate">{r.email}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{patternLabel[r.pattern] ?? r.pattern}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-400">{validatorLabel[r.validatedBy]}</span>
                        </div>
                      </div>
                      {/* Confidence bar */}
                      <div className="w-20 shrink-0">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", statusConfig[r.status].bar)}
                            style={{ width: `${r.confidence}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 text-right mt-0.5">{r.confidence}%</p>
                      </div>
                      {/* Copy feedback */}
                      <div className="w-6 shrink-0 flex items-center justify-center">
                        {copied === r.email
                          ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                          : <Copy className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
                {response.results.length > 4 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-brand-600 hover:bg-brand-50 border-t border-slate-100 transition-colors font-medium"
                  >
                    {showAll ? <><ChevronUp className="w-3.5 h-3.5" />Show less</> : <><ChevronDown className="w-3.5 h-3.5" />Show all {response.results.length} patterns</>}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
