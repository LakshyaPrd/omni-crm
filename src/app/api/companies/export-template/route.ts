import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  // Define template columns (exact headers users must use OR map to)
  const headers = [
    "First Name *",
    "Last Name *",
    "Email *",
    "Phone",
    "Job Title",
    "Department",
    "LinkedIn URL",
    "Location",
    "Notes",
  ];

  // Example rows to guide the user
  const exampleRows = [
    ["Jane", "Smith", "jane.smith@acme.com", "+1-555-0100", "VP of Engineering", "Engineering", "https://linkedin.com/in/janesmith", "San Francisco, CA", "Key decision maker"],
    ["Rahul", "Gupta", "rahul.gupta@acme.com", "+91-98765-43210", "Product Manager", "Product", "https://linkedin.com/in/rahulgupta", "Bangalore, India", ""],
    ["", "", "", "", "", "", "", "", "(* = required fields)"],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);

  // Style: column widths
  ws["!cols"] = [
    { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 18 },
    { wch: 22 }, { wch: 18 }, { wch: 35 }, { wch: 22 }, { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="employee_import_template.xlsx"',
    },
  });
}
