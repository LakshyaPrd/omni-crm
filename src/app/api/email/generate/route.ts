import { NextRequest, NextResponse } from "next/server";

type EmailStatus = "deliverable" | "risky" | "undeliverable" | "unknown";

interface EmailResult {
  email: string;
  pattern: string;
  status: EmailStatus;
  confidence: number; // 0–100
  reason: string;
  validatedBy: "bouncer" | "abstract" | "dns" | "heuristic";
}

// ─── Pattern generators ───────────────────────────────────────────────────────
function generatePatterns(firstName: string, lastName: string, domain: string): { email: string; pattern: string }[] {
  const f = firstName.toLowerCase().replace(/[^a-z]/g, "");
  const l = lastName.toLowerCase().replace(/[^a-z]/g, "");
  const fi = f[0] ?? "";
  const li = l[0] ?? "";

  if (!f || !l || !domain) return [];

  return [
    { pattern: "firstname.lastname",   email: `${f}.${l}@${domain}` },
    { pattern: "firstname",            email: `${f}@${domain}` },
    { pattern: "f.lastname",           email: `${fi}.${l}@${domain}` },
    { pattern: "flastname",            email: `${fi}${l}@${domain}` },
    { pattern: "firstnamelastname",    email: `${f}${l}@${domain}` },
    { pattern: "firstname_lastname",   email: `${f}_${l}@${domain}` },
    { pattern: "lastname.firstname",   email: `${l}.${f}@${domain}` },
    { pattern: "firstnamel",           email: `${f}${li}@${domain}` },
  ].filter((p, i, arr) => arr.findIndex((a) => a.email === p.email) === i); // dedupe
}

// ─── Bouncer validation ───────────────────────────────────────────────────────
async function validateWithBouncer(email: string, apiKey: string): Promise<Pick<EmailResult, "status" | "confidence" | "reason" | "validatedBy"> | null> {
  try {
    const res = await fetch(`https://api.usebouncer.com/v1/email/verify?email=${encodeURIComponent(email)}`, {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const d = await res.json();
    const statusMap: Record<string, EmailStatus> = {
      deliverable: "deliverable", risky: "risky", undeliverable: "undeliverable", unknown: "unknown",
    };
    return {
      status: statusMap[d.status] ?? "unknown",
      confidence: d.status === "deliverable" ? 95 : d.status === "risky" ? 55 : 5,
      reason: d.reason ?? d.status,
      validatedBy: "bouncer",
    };
  } catch { return null; }
}

// ─── Abstract API validation ──────────────────────────────────────────────────
async function validateWithAbstract(email: string, apiKey: string): Promise<Pick<EmailResult, "status" | "confidence" | "reason" | "validatedBy"> | null> {
  try {
    const res = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const d = await res.json();
    // d.deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN"
    const statusMap: Record<string, EmailStatus> = {
      DELIVERABLE: "deliverable", UNDELIVERABLE: "undeliverable", RISKY: "risky", UNKNOWN: "unknown",
    };
    const status = statusMap[d.deliverability] ?? "unknown";
    return {
      status,
      confidence: status === "deliverable" ? 85 : status === "risky" ? 45 : 5,
      reason: d.is_smtp_valid?.text ?? d.deliverability,
      validatedBy: "abstract",
    };
  } catch { return null; }
}

// ─── DNS MX check (always free, no key) ──────────────────────────────────────
// Checks whether the domain has mail servers. Cannot verify individual addresses,
// so deliverable domains get "risky" and invalid domains get "undeliverable".
async function validateWithDNS(domain: string): Promise<{ hasMX: boolean }> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return { hasMX: Array.isArray(data.Answer) && data.Answer.length > 0 };
  } catch { return { hasMX: false }; }
}

// ─── Heuristic scoring ────────────────────────────────────────────────────────
// Used when all validators fail (offline / keys not set)
function heuristicScore(email: string, pattern: string): Pick<EmailResult, "status" | "confidence" | "reason" | "validatedBy"> {
  // Most common patterns have higher prior probability
  const patternScore: Record<string, number> = {
    "firstname.lastname": 78,
    "firstname": 65,
    "f.lastname": 60,
    "flastname": 55,
    "firstnamelastname": 48,
    "firstname_lastname": 40,
    "lastname.firstname": 35,
    "firstnamel": 30,
  };
  const score = patternScore[pattern] ?? 40;
  return {
    status: score >= 70 ? "risky" : score >= 45 ? "unknown" : "unknown",
    confidence: score,
    reason: "pattern_probability",
    validatedBy: "heuristic",
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, domain } = body as { firstName: string; lastName: string; domain: string };

    if (!firstName || !lastName || !domain) {
      return NextResponse.json({ error: "firstName, lastName, and domain are required" }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, "").split("/")[0].toLowerCase();
    const patterns = generatePatterns(firstName, lastName, cleanDomain);

    const bouncerKey = process.env.BOUNCER_API_KEY ?? "";
    const abstractKey = process.env.ABSTRACT_API_KEY ?? "";

    // Check domain MX once (not per-email to save API calls)
    const { hasMX } = await validateWithDNS(cleanDomain);

    const results: EmailResult[] = [];

    for (const { email, pattern } of patterns) {
      let validation: Pick<EmailResult, "status" | "confidence" | "reason" | "validatedBy"> | null = null;

      // Try Bouncer first (most accurate)
      if (bouncerKey) {
        validation = await validateWithBouncer(email, bouncerKey);
      }

      // Fallback: Abstract API
      if (!validation && abstractKey) {
        validation = await validateWithAbstract(email, abstractKey);
      }

      // Fallback: DNS + heuristic
      if (!validation) {
        if (!hasMX) {
          validation = { status: "undeliverable", confidence: 5, reason: "domain_no_mx", validatedBy: "dns" };
        } else {
          // Domain is valid (has MX), use pattern heuristic for confidence
          const h = heuristicScore(email, pattern);
          validation = { ...h, status: "risky", reason: "domain_valid_address_unconfirmed", validatedBy: "dns" };
        }
      }

      results.push({ email, pattern, ...validation });
    }

    // Sort: deliverable → risky → unknown → undeliverable, then by confidence desc
    const order: Record<EmailStatus, number> = { deliverable: 0, risky: 1, unknown: 2, undeliverable: 3 };
    results.sort((a, b) => order[a.status] - order[b.status] || b.confidence - a.confidence);

    return NextResponse.json({
      domain: cleanDomain,
      hasMX,
      validator: bouncerKey ? "bouncer" : abstractKey ? "abstract" : "dns+heuristic",
      usingRealValidator: !!(bouncerKey || abstractKey),
      results,
    });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
