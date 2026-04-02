"use client";
import { useState } from "react";
import {
  Mail, Phone, MessageCircle, Linkedin, Globe, Twitter,
  CheckCircle, XCircle, Copy, Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactField {
  type: "email" | "phone" | "whatsapp" | "linkedin" | "website" | "twitter" | "custom";
  label?: string;
  value: string;
  verified?: boolean;
  primary?: boolean;
  note?: string; // e.g. "mobile", "office"
}

interface ContactInfoBlockProps {
  fields: ContactField[];
  showVerification?: boolean;
  showCopyButtons?: boolean;
  masked?: boolean; // blur values until revealed
  className?: string;
}

const typeConfig: Record<ContactField["type"], { Icon: React.ElementType; defaultLabel: string; color: string }> = {
  email:    { Icon: Mail,           defaultLabel: "Email",    color: "text-blue-500 bg-blue-50" },
  phone:    { Icon: Phone,          defaultLabel: "Phone",    color: "text-violet-500 bg-violet-50" },
  whatsapp: { Icon: MessageCircle,  defaultLabel: "WhatsApp", color: "text-emerald-500 bg-emerald-50" },
  linkedin: { Icon: Linkedin,       defaultLabel: "LinkedIn", color: "text-sky-500 bg-sky-50" },
  website:  { Icon: Globe,          defaultLabel: "Website",  color: "text-slate-500 bg-slate-100" },
  twitter:  { Icon: Twitter,        defaultLabel: "Twitter",  color: "text-slate-500 bg-slate-100" },
  custom:   { Icon: Mail,           defaultLabel: "Contact",  color: "text-slate-500 bg-slate-100" },
};

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      title="Copy"
    >
      {copied
        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function ContactInfoBlock({
  fields,
  showVerification = true,
  showCopyButtons = true,
  masked = false,
  className,
}: ContactInfoBlockProps) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const isRevealed = (i: number) => !masked || revealed[i];

  return (
    <div className={cn("divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden bg-white", className)}>
      {fields.map((field, i) => {
        const cfg = typeConfig[field.type];
        const show = isRevealed(i);
        const displayValue = show ? field.value : field.value.replace(/./g, "•").slice(0, 20) + "...";

        return (
          <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
            {/* Icon */}
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
              <cfg.Icon className="w-3.5 h-3.5" />
            </div>

            {/* Label + value */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-slate-400 font-medium">
                  {field.label ?? cfg.defaultLabel}
                  {field.note && <span className="ml-1 text-slate-300">· {field.note}</span>}
                </span>
                {field.primary && (
                  <span className="text-xs bg-brand-100 text-brand-700 px-1.5 py-0 rounded font-medium">Primary</span>
                )}
              </div>
              <span className={cn(
                "text-sm font-medium block truncate",
                field.type === "linkedin" || field.type === "website" ? "text-brand-600 hover:underline cursor-pointer" : "text-slate-800",
                !show && "tracking-widest text-slate-400 select-none"
              )}>
                {displayValue}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {masked && (
                <button
                  onClick={() => setRevealed((p) => ({ ...p, [i]: !p[i] }))}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  title={show ? "Hide" : "Reveal"}
                >
                  {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              )}
              {showCopyButtons && show && <CopyBtn value={field.value} />}
            </div>

            {/* Verification badge */}
            {showVerification && field.verified !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
                field.verified
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
              )}>
                {field.verified
                  ? <><ShieldCheck className="w-3 h-3" />Verified</>
                  : <><XCircle className="w-3 h-3" />Unverified</>}
              </div>
            )}
          </div>
        );
      })}

      {fields.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-slate-400">No contact info available</p>
        </div>
      )}
    </div>
  );
}
