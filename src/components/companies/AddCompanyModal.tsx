"use client";
import { useState } from "react";
import {
  X, Building2, Globe, MapPin, Users, Briefcase, FileSpreadsheet,
  CheckCircle2, ArrowRight, Plus, Trash2, ChevronDown, Link2,
  Calendar, DollarSign, Tag
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ExcelImportModal } from "./ExcelImportModal";

const INDUSTRIES = [
  "Fintech", "SaaS", "E-Commerce", "Healthcare", "EdTech", "Real Estate",
  "Media & Entertainment", "Logistics", "Cybersecurity", "Dev Tools",
  "Data & Analytics", "AI / ML", "Infrastructure", "Design Tools",
  "Communication", "CRM / Marketing", "Productivity", "Other",
];

const COMPANY_SIZES = [
  "1–10", "11–50", "51–200", "201–500", "501–1,000",
  "1,001–5,000", "5,001–10,000", "10,000+",
];

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  linkedinUrl: string;
  location: string;
  notes: string;
  _emailStatus: string;
  _emailScore: string;
  _emailReason: string;
  [key: string]: string;
}

interface CompanyForm {
  name: string;
  website: string;
  industry: string;
  size: string;
  hq: string;
  description: string;
  founded: string;
  revenue: string;
  linkedinUrl: string;
  tags: string;
}

interface AddCompanyModalProps {
  onClose: () => void;
  onSave: (data: { company: CompanyForm; employees: Employee[] }) => void;
}

const STEPS = ["Company Info", "Employees", "Review"] as const;
type Step = (typeof STEPS)[number];

const emptyEmployee = (): Employee => ({
  firstName: "", lastName: "", email: "", phone: "",
  jobTitle: "", department: "", linkedinUrl: "", location: "", notes: "",
  _emailStatus: "idle", _emailScore: "", _emailReason: "",
});

export function AddCompanyModal({ onClose, onSave }: AddCompanyModalProps) {
  const [step, setStep] = useState<Step>("Company Info");
  const [showExcelImport, setShowExcelImport] = useState(false);

  const [form, setForm] = useState<CompanyForm>({
    name: "", website: "", industry: "", size: "",
    hq: "", description: "", founded: "", revenue: "", linkedinUrl: "", tags: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([emptyEmployee()]);

  const setField = (key: keyof CompanyForm, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setEmpField = (i: number, key: keyof Employee, val: string) =>
    setEmployees((prev) => prev.map((e, idx) => idx === i ? { ...e, [key]: val } : e));

  const addEmployee = () => setEmployees((prev) => [...prev, emptyEmployee()]);
  const removeEmployee = (i: number) => setEmployees((prev) => prev.filter((_, idx) => idx !== i));

  const stepIndex = STEPS.indexOf(step);
  const canGoNext =
    step === "Company Info" ? !!form.name.trim()
    : step === "Employees" ? true
    : true;

  const companyInitials = form.name
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "CO";

  const colorPalette = ["bg-violet-600", "bg-blue-600", "bg-emerald-600", "bg-orange-600", "bg-pink-600"];
  const avatarColor = colorPalette[form.name.length % colorPalette.length];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm", avatarColor)}>
                {companyInitials}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">{form.name || "New Company"}</h2>
                <p className="text-xs text-slate-500">Step {stepIndex + 1} of {STEPS.length}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps */}
          <div className="flex gap-0 border-b border-slate-100">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => i <= stepIndex && setStep(s)}
                className={cn(
                  "flex-1 py-3 text-xs font-medium transition-colors relative",
                  s === step
                    ? "text-brand-600 border-b-2 border-brand-600"
                    : i < stepIndex
                    ? "text-slate-500 hover:text-slate-700"
                    : "text-slate-300 cursor-default"
                )}
              >
                {i < stepIndex && <span className="mr-1 text-emerald-500">✓</span>}
                {s}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── Step 1: Company Info ── */}
            {step === "Company Info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="e.g. Acme Corp"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="https://acme.com"
                        value={form.website}
                        onChange={(e) => setField("website", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">LinkedIn URL</label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="https://linkedin.com/company/..."
                        value={form.linkedinUrl}
                        onChange={(e) => setField("linkedinUrl", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Industry</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        className="input-field pl-9 appearance-none"
                        value={form.industry}
                        onChange={(e) => setField("industry", e.target.value)}
                      >
                        <option value="">Select industry...</option>
                        {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Size</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        className="input-field pl-9 appearance-none"
                        value={form.size}
                        onChange={(e) => setField("size", e.target.value)}
                      >
                        <option value="">Select size...</option>
                        {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">HQ Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="e.g. San Francisco, CA"
                        value={form.hq}
                        onChange={(e) => setField("hq", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Founded Year</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="e.g. 2015"
                        value={form.founded}
                        onChange={(e) => setField("founded", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Annual Revenue</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="e.g. $5M ARR"
                        value={form.revenue}
                        onChange={(e) => setField("revenue", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tags</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="input-field pl-9"
                        placeholder="e.g. SaaS, Enterprise, Hot Lead (comma separated)"
                        value={form.tags}
                        onChange={(e) => setField("tags", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                    <textarea
                      className="input-field resize-none"
                      rows={3}
                      placeholder="What does this company do?"
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Employees ── */}
            {step === "Employees" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Add employees manually or import from Excel
                  </p>
                  <button
                    onClick={() => setShowExcelImport(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold rounded-lg hover:bg-brand-100 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Import from Excel
                  </button>
                </div>

                {employees.map((emp, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Employee {i + 1}</span>
                      {employees.length > 1 && (
                        <button
                          onClick={() => removeEmployee(i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input-field h-9 text-sm" placeholder="First Name *" value={emp.firstName} onChange={(e) => setEmpField(i, "firstName", e.target.value)} />
                      <input className="input-field h-9 text-sm" placeholder="Last Name *" value={emp.lastName} onChange={(e) => setEmpField(i, "lastName", e.target.value)} />
                      <input className="input-field h-9 text-sm" placeholder="Email *" value={emp.email} onChange={(e) => setEmpField(i, "email", e.target.value)} type="email" />
                      <input className="input-field h-9 text-sm" placeholder="Phone" value={emp.phone} onChange={(e) => setEmpField(i, "phone", e.target.value)} />
                      <input className="input-field h-9 text-sm" placeholder="Job Title" value={emp.jobTitle} onChange={(e) => setEmpField(i, "jobTitle", e.target.value)} />
                      <input className="input-field h-9 text-sm" placeholder="Department" value={emp.department} onChange={(e) => setEmpField(i, "department", e.target.value)} />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addEmployee}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Employee
                </button>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === "Review" && (
              <div className="space-y-5">
                {/* Company summary */}
                <div className="p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0", avatarColor)}>
                      {companyInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{form.name}</h3>
                      {form.industry && <p className="text-sm text-slate-500 mt-0.5">{form.industry}</p>}
                      {form.description && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{form.description}</p>}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                        {form.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{form.website}</span>}
                        {form.hq && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{form.hq}</span>}
                        {form.size && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{form.size} employees</span>}
                        {form.founded && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Est. {form.founded}</span>}
                        {form.revenue && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{form.revenue}</span>}
                      </div>
                      {form.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                            <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Employees summary */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Employees ({employees.filter((e) => e.firstName || e.email).length})
                  </h4>
                  <div className="space-y-2">
                    {employees.filter((e) => e.firstName || e.email).map((emp, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold">
                          {(emp.firstName[0] ?? "") + (emp.lastName[0] ?? "") || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">
                            {[emp.firstName, emp.lastName].filter(Boolean).join(" ") || "Unnamed"}
                          </p>
                          <p className="text-xs text-slate-500">{emp.email || "No email"}{emp.jobTitle ? ` · ${emp.jobTitle}` : ""}</p>
                        </div>
                        {emp._emailStatus === "deliverable" && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                    ))}
                    {employees.filter((e) => e.firstName || e.email).length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">No employees added</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 rounded-b-2xl">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <div className="flex gap-2">
              {stepIndex > 0 && (
                <Button variant="secondary" onClick={() => setStep(STEPS[stepIndex - 1])}>
                  Back
                </Button>
              )}
              {step !== "Review" ? (
                <Button onClick={() => setStep(STEPS[stepIndex + 1])} disabled={!canGoNext}>
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => onSave({ company: form, employees })}>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Company
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Excel Import Sub-modal */}
      {showExcelImport && (
        <ExcelImportModal
          onClose={() => setShowExcelImport(false)}
          onImport={(imported) => {
            setEmployees(imported as Employee[]);
            setShowExcelImport(false);
          }}
        />
      )}
    </>
  );
}
