/**
 * Simple localStorage-backed store for cross-page CRM data.
 * Used to persist companies added from Job Search → Companies list,
 * and leads imported via Excel → Imported Leads list.
 */

export interface StoredCompany {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  size: string;
  source: "job_search" | "manual" | "excel";
  jobTitle?: string;
  platform?: string;
  addedAt: string;
}

export interface StoredLead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  linkedinUrl: string;
  location: string;
  notes: string;
  emailStatus: string;
  source: "excel" | "manual";
  addedAt: string;
}

const COMPANIES_KEY = "nexcrm_added_companies";
const LEADS_KEY = "nexcrm_imported_leads";

function safeGet<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function safeSet<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export const crmStore = {
  // Companies
  getCompanies(): StoredCompany[] {
    return safeGet<StoredCompany>(COMPANIES_KEY);
  },
  addCompany(company: Omit<StoredCompany, "id" | "addedAt">): StoredCompany {
    const companies = safeGet<StoredCompany>(COMPANIES_KEY);
    const newCompany: StoredCompany = { ...company, id: `jc-${Date.now()}`, addedAt: new Date().toISOString() };
    safeSet(COMPANIES_KEY, [newCompany, ...companies]);
    return newCompany;
  },
  removeCompany(id: string) {
    const companies = safeGet<StoredCompany>(COMPANIES_KEY).filter((c) => c.id !== id);
    safeSet(COMPANIES_KEY, companies);
  },

  // Leads
  getLeads(): StoredLead[] {
    return safeGet<StoredLead>(LEADS_KEY);
  },
  addLeads(leads: Omit<StoredLead, "id" | "addedAt">[]): StoredLead[] {
    const existing = safeGet<StoredLead>(LEADS_KEY);
    const newLeads: StoredLead[] = leads.map((l) => ({
      ...l,
      id: `il-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      addedAt: new Date().toISOString(),
    }));
    safeSet(LEADS_KEY, [...newLeads, ...existing]);
    return newLeads;
  },
  clearLeads() {
    safeSet(LEADS_KEY, []);
  },
};
