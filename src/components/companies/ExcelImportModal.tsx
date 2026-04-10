"use client";
import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  X, Upload, Download, ArrowRight, CheckCircle2, AlertCircle,
  Loader2, FileSpreadsheet, ChevronDown, ShieldCheck, Mail,
  AlertTriangle, XCircle, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CRM_FIELDS = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "phone", label: "Phone", required: false },
  { key: "jobTitle", label: "Job Title", required: false },
  { key: "department", label: "Department", required: false },
  { key: "linkedinUrl", label: "LinkedIn URL", required: false },
  { key: "location", label: "Location", required: false },
  { key: "notes", label: "Notes", required: false },
  { key: "__skip__", label: "— Skip this column —", required: false },
];

type VerifyStatus = "deliverable" | "risky" | "undeliverable" | "unknown" | "pending" | "idle";

interface Employee {
  [key: string]: string;
  _emailStatus: VerifyStatus;
  _emailScore: string;
  _emailReason: string;
}

interface ExcelImportModalProps {
  onClose: () => void;
  onImport: (employees: Employee[]) => void;
}

const statusIcon = (s: VerifyStatus) => {
  if (s === "deliverable") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (s === "risky") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (s === "undeliverable") return <XCircle className="w-4 h-4 text-red-500" />;
  if (s === "pending") return <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />;
  return <HelpCircle className="w-4 h-4 text-slate-400" />;
};

const statusLabel = (s: VerifyStatus) => {
  if (s === "deliverable") return <span className="text-xs font-medium text-emerald-600">Deliverable</span>;
  if (s === "risky") return <span className="text-xs font-medium text-amber-600">Risky</span>;
  if (s === "undeliverable") return <span className="text-xs font-medium text-red-600">Invalid</span>;
  if (s === "pending") return <span className="text-xs font-medium text-brand-600">Verifying...</span>;
  return <span className="text-xs text-slate-400">Not verified</span>;
};

export function ExcelImportModal({ onClose, onImport }: ExcelImportModalProps) {
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [bouncerKey, setBouncerKey] = useState(process.env.NEXT_PUBLIC_BOUNCER_API_KEY ?? "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as string[][];
      if (rows.length < 2) return;
      const headers = (rows[0] as string[]).map(String);
      setExcelHeaders(headers);
      setRawRows(rows.slice(1) as string[][]);
      setFileName(file.name);

      // Auto-map columns that match CRM field labels
      const autoMap: Record<string, string> = {};
      headers.forEach((h) => {
        const normalized = h.replace(/[^a-z]/gi, "").toLowerCase();
        const match = CRM_FIELDS.find((f) => {
          const fl = f.label.replace(/[^a-z]/gi, "").toLowerCase();
          return fl === normalized || f.key === normalized;
        });
        autoMap[h] = match?.key ?? "__skip__";
      });
      setMapping(autoMap);
      setStep("map");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".csv"))) {
      parseFile(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const applyMapping = () => {
    const mapped = rawRows
      .filter((row) => row.some((cell) => String(cell).trim()))
      .map((row) => {
        const emp: Employee = { _emailStatus: "idle", _emailScore: "", _emailReason: "" };
        excelHeaders.forEach((h, i) => {
          const crmKey = mapping[h];
          if (crmKey && crmKey !== "__skip__") {
            emp[crmKey] = String(row[i] ?? "").trim();
          }
        });
        return emp;
      });
    setEmployees(mapped);
    setStep("preview");
  };

  const verifyEmails = async () => {
    const emails = employees.map((e) => e.email).filter(Boolean);
    if (!emails.length) return;

    setVerifying(true);
    // Set all to pending
    setEmployees((prev) => prev.map((e) => ({ ...e, _emailStatus: e.email ? "pending" : "idle" })));

    try {
      const res = await fetch("/api/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      const resultMap: Record<string, { status: VerifyStatus; score: number; reason: string }> = {};
      (data.results ?? []).forEach((r: { email: string; status: VerifyStatus; score: number; reason: string }) => {
        resultMap[r.email] = r;
      });

      setEmployees((prev) =>
        prev.map((e) => {
          const r = resultMap[e.email];
          return r
            ? { ...e, _emailStatus: r.status, _emailScore: String(r.score), _emailReason: r.reason }
            : e;
        })
      );
    } catch {
      setEmployees((prev) => prev.map((e) => ({ ...e, _emailStatus: "unknown" as VerifyStatus })));
    } finally {
      setVerifying(false);
    }
  };

  const deliverableCount = employees.filter((e) => e._emailStatus === "deliverable").length;
  const invalidCount = employees.filter((e) => e._emailStatus === "undeliverable").length;
  const verified = employees.some((e) => e._emailStatus !== "idle");

  const requiredMapped = CRM_FIELDS.filter((f) => f.required).every((f) =>
    Object.values(mapping).includes(f.key)
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Import Employees from Excel</h2>
              <p className="text-xs text-slate-500">Upload your Excel file, map columns, verify emails</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center px-6 py-3 gap-2 border-b border-slate-50 bg-slate-50/50">
          {(["upload", "map", "preview"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                step === s ? "bg-brand-600 text-white" :
                  (["upload", "map", "preview"].indexOf(step) > i ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500")
              )}>
                {["upload", "map", "preview"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              <span className={cn("text-xs font-medium capitalize", step === s ? "text-slate-900" : "text-slate-400")}>
                {s === "upload" ? "Upload File" : s === "map" ? "Map Fields" : "Preview & Verify"}
              </span>
              {i < 2 && <ArrowRight className="w-3.5 h-3.5 text-slate-300 mx-1" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── Step 1: Upload ── */}
          {step === "upload" && (
            <div className="space-y-5">
              {/* Template download */}
              <div className="flex items-center justify-between p-4 bg-brand-50 border border-brand-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-brand-800">Download the template first</p>
                  <p className="text-xs text-brand-600 mt-0.5">Avoid mapping errors — use our pre-formatted Excel template</p>
                </div>
                <a
                  href="/api/companies/export-template"
                  download
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Template.xlsx
                </a>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
                  dragging ? "border-brand-400 bg-brand-50" : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                )}
              >
                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">Drop your Excel file here</p>
                <p className="text-sm text-slate-500 mt-1">or click to browse — .xlsx, .xls, .csv supported</p>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          )}

          {/* ── Step 2: Map Fields ── */}
          {step === "map" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  File: <span className="font-medium text-slate-800">{fileName}</span>
                  <span className="text-slate-400 ml-2">({rawRows.length} rows detected)</span>
                </p>
                <button onClick={() => setStep("upload")} className="text-xs text-brand-600 hover:underline">
                  Change file
                </button>
              </div>

              {!requiredMapped && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Please map all required fields: <strong>First Name</strong>, <strong>Last Name</strong>, <strong>Email</strong></span>
                </div>
              )}

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50 rounded-lg">
                  <span>Excel Column</span>
                  <span>Maps to CRM Field</span>
                </div>
                {excelHeaders.map((h) => (
                  <div key={h} className="grid grid-cols-2 gap-2 items-center p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="text-sm font-medium text-slate-800">{h}</span>
                    </div>
                    <div className="relative">
                      <select
                        value={mapping[h] ?? "__skip__"}
                        onChange={(e) => setMapping((m) => ({ ...m, [h]: e.target.value }))}
                        className="input-field pr-8 appearance-none h-9 text-sm"
                      >
                        {CRM_FIELDS.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}{f.required ? " *" : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Preview & Verify ── */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Total Employees</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-600">{deliverableCount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Valid Emails</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-red-500">{invalidCount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Invalid Emails</p>
                </div>
              </div>

              {/* Bouncer verification panel */}
              <div className="p-4 border border-slate-200 rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span className="text-sm font-semibold text-slate-800">Bouncer Email Verification</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Powered by Bouncer</span>
                  </div>
                  <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-xs text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    {showKeyInput ? "Hide" : "API Key settings"}
                  </button>
                </div>

                {showKeyInput && (
                  <div className="mt-3 flex gap-2">
                    <input
                      className="input-field flex-1 h-9 text-sm"
                      placeholder="Enter your Bouncer API key (or leave blank for demo mode)"
                      value={bouncerKey}
                      onChange={(e) => setBouncerKey(e.target.value)}
                    />
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {!bouncerKey
                      ? "Running in demo mode — add your Bouncer API key for real verification"
                      : "Real-time verification via Bouncer API"}
                  </p>
                  <Button
                    size="sm"
                    onClick={verifyEmails}
                    disabled={verifying}
                    className="gap-1.5"
                  >
                    {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    {verifying ? "Verifying..." : "Verify All Emails"}
                  </Button>
                </div>
              </div>

              {/* Preview table */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left table-header">Name</th>
                      <th className="px-4 py-2.5 text-left table-header">Email</th>
                      <th className="px-4 py-2.5 text-left table-header">Email Status</th>
                      <th className="px-4 py-2.5 text-left table-header">Job Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, i) => (
                      <tr key={i} className="table-row">
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-slate-800">
                            {[emp.firstName, emp.lastName].filter(Boolean).join(" ") || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">
                          {emp.email || "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          {emp.email ? (
                            <div className="flex items-center gap-1.5">
                              {statusIcon(emp._emailStatus)}
                              {statusLabel(emp._emailStatus)}
                            </div>
                          ) : <span className="text-xs text-slate-400">No email</span>}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{emp.jobTitle || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            {step === "map" && (
              <Button variant="secondary" onClick={() => setStep("upload")}>Back</Button>
            )}
            {step === "preview" && (
              <Button variant="secondary" onClick={() => setStep("map")}>Back</Button>
            )}
            {step === "map" && (
              <Button onClick={applyMapping} disabled={!requiredMapped}>
                Preview <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {step === "preview" && (
              <Button
                onClick={() => onImport(employees.filter((e) => e._emailStatus !== "undeliverable" || !verified))}
              >
                <CheckCircle2 className="w-4 h-4" />
                Import {verified ? `${deliverableCount} Valid` : employees.length} Employees
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
