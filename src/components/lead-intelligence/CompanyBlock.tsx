import { Globe, MapPin, Users, Building2, Zap, TrendingUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CompanyBlockProps {
  companyId?: string;
  name: string;
  website?: string;
  industry: string;
  size: string;
  headquarters?: string;
  revenue?: string;
  hiringStatus?: string;
  logo?: string;
  logoColor?: string;
  contacts?: number;
  activeCampaigns?: number;
  techStack?: string[];
  description?: string;
  compact?: boolean;
  className?: string;
}

const hiringColors: Record<string, string> = {
  "Actively Hiring": "bg-emerald-100 text-emerald-700",
  "Hiring": "bg-blue-100 text-blue-700",
  "Not Hiring": "bg-slate-100 text-slate-500",
};

export function CompanyBlock({
  companyId, name, website, industry, size, headquarters, revenue,
  hiringStatus, logo, logoColor = "bg-brand-600",
  contacts, activeCampaigns, techStack, description, compact = false, className,
}: CompanyBlockProps) {
  return (
    <div className={cn("bg-white border border-slate-100 rounded-xl p-4 shadow-card", className)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0", logoColor)}>
          {logo ?? name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
            {hiringStatus && (
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", hiringColors[hiringStatus] ?? "bg-slate-100 text-slate-500")}>
                {hiringStatus}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="flex items-center gap-0.5"><Building2 className="w-3 h-3" />{industry}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{size}</span>
            {headquarters && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{headquarters}</span>
              </>
            )}
          </div>
          {website && (
            <a href={`https://${website}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:underline flex items-center gap-0.5 mt-0.5">
              <Globe className="w-3 h-3" />{website}<ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        {companyId && (
          <Link href={`/lead-intelligence/companies/${companyId}`}>
            <button className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-600 transition-colors" title="View company profile">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>
        )}
      </div>

      {description && !compact && (
        <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{description}</p>
      )}

      {/* Stats row */}
      {(contacts !== undefined || activeCampaigns !== undefined || revenue) && (
        <div className={cn("grid gap-2 mb-3", compact ? "grid-cols-2" : "grid-cols-3")}>
          {contacts !== undefined && (
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <div className="text-base font-black text-slate-900">{contacts}</div>
              <div className="text-xs text-slate-500">Contacts</div>
            </div>
          )}
          {activeCampaigns !== undefined && (
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <div className="text-base font-black text-slate-900">{activeCampaigns}</div>
              <div className="text-xs text-slate-500">Campaigns</div>
            </div>
          )}
          {revenue && (
            <div className="bg-slate-50 rounded-lg p-2 text-center">
              <div className="text-base font-black text-slate-900">{revenue}</div>
              <div className="text-xs text-slate-500">Revenue</div>
            </div>
          )}
        </div>
      )}

      {/* Tech stack */}
      {techStack && techStack.length > 0 && !compact && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tech Stack</p>
          <div className="flex flex-wrap gap-1">
            {techStack.map((t) => (
              <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
