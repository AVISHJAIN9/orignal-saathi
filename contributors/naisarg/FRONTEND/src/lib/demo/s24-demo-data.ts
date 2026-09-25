import {
  CANONICAL_DEMO_COMPANY,
  DEMO_DISCLAIMER_LABEL,
  DEMO_OFFICIAL_SOURCE,
  DEMO_WATERMARK_TEXT,
} from "./demo-context";

export interface InvoiceLineItem {
  id: string;
  sacCode: string; // e.g. "998341" (Testing, Inspection and Certification Services)
  description: string;
  quantity: number;
  unitRate: number;
  taxableAmount: number;
}

export interface StatutoryInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // ISO date
  dueDate: string;
  category: "APPLICATION_GRANT" | "ANNUAL_MARKING_FEE" | "FACTORY_SURVEILLANCE" | "LAB_TESTING";
  status: "PAID" | "PENDING" | "OVERDUE";
  
  // Entity & Billing
  billedTo: {
    companyName: string;
    legalName: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    stateCode: string;
  };
  issuingAuthority: {
    name: string;
    branch: string;
    gstin: string;
    address: string;
    pan: string;
  };

  // Line items & Tax (Deterministic: Subtotal + CGST + SGST = Total)
  lineItems: InvoiceLineItem[];
  subtotalTaxable: number;
  cgstRate: number; // e.g. 0.09 (9%)
  cgstAmount: number;
  sgstRate: number; // e.g. 0.09 (9%)
  sgstAmount: number;
  igstRate: number; // 0 for intra-state
  igstAmount: number;
  totalPayable: number;

  // Payment & Receipt Details (Clearly marked as DEMO)
  receipt?: {
    receiptNumber: string;
    receiptDate: string;
    paymentMode: "NEFT_RTGS" | "BHIM_UPI" | "NET_BANKING";
    transactionReference: string; // Clearly simulated
    bankName: string;
    amountPaid: number;
    amountInWords: string;
    acknowledgementStatus: "RECONCILED";
    simulatedQrPayload: string;
  };

  // Cross-feature links
  relatedApplicationId?: string;
  relatedCertificateNumber?: string;
  relatedAuditNumber?: string;
  isDemo: boolean;
  demoWatermark: string;
  demoNotice: string;
}

export const S24_DEMO_INVOICES: StatutoryInvoice[] = [
  {
    id: "inv-2026-001",
    invoiceNumber: "INV-2026-04812",
    invoiceDate: "2026-08-10T10:00:00.000Z",
    dueDate: "2026-09-10T23:59:59.000Z",
    category: "APPLICATION_GRANT",
    status: "PAID",
    billedTo: {
      companyName: CANONICAL_DEMO_COMPANY.name,
      legalName: CANONICAL_DEMO_COMPANY.legalName,
      gstin: CANONICAL_DEMO_COMPANY.gstin,
      address: CANONICAL_DEMO_COMPANY.address,
      city: CANONICAL_DEMO_COMPANY.city,
      state: CANONICAL_DEMO_COMPANY.state,
      pincode: CANONICAL_DEMO_COMPANY.pincode,
      stateCode: "06 (Haryana)",
    },
    issuingAuthority: {
      name: "Bureau of Indian Standards",
      branch: "Delhi Regional Office & Central Accounts",
      gstin: "GSTIN-000002",
      address: "Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002",
      pan: "PAN-000002",
    },
    lineItems: [
      {
        id: "li-01",
        sacCode: "998341",
        description: "Application Scrutiny & Grant Fee (Scheme-I Product Certification for Submersible Pumps)",
        quantity: 1,
        unitRate: 15000,
        taxableAmount: 15000,
      },
      {
        id: "li-02",
        sacCode: "998341",
        description: "Preliminary Technical Evaluation & Documentation Verification Charge",
        quantity: 1,
        unitRate: 7500,
        taxableAmount: 7500,
      },
    ],
    subtotalTaxable: 22500,
    cgstRate: 0.09,
    cgstAmount: 2025,
    sgstRate: 0.09,
    sgstAmount: 2025,
    igstRate: 0,
    igstAmount: 0,
    totalPayable: 26550,
    receipt: {
      receiptNumber: "RCPT-2026-09124",
      receiptDate: "2026-08-12T14:22:10.000Z",
      paymentMode: "NEFT_RTGS",
      transactionReference: "UTR-SIH2026-001",
      bankName: "Simulated Sandbox Gateway",
      amountPaid: 26550,
      amountInWords: "Rupees Twenty-Six Thousand Five Hundred and Fifty Only",
      acknowledgementStatus: "RECONCILED",
      simulatedQrPayload: "SAATHI_PAYMENT_VERIFY:RCPT-2026-09124:AMOUNT=26550:FOR_SIH_2026_EVALUATION_ONLY",
    },
    relatedApplicationId: "APP-2026-8841",
    relatedCertificateNumber: "LIC-8842109",
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
    demoNotice: "SAATHI DEMONSTRATION INVOICE — FOR SIH 2026 EVALUATION ONLY — NOT AN OFFICIAL GOVERNMENT TAX INVOICE",
  },
  {
    id: "inv-2026-002",
    invoiceNumber: "INV-2026-09144",
    invoiceDate: "2026-09-02T11:30:00.000Z",
    dueDate: "2026-10-02T23:59:59.000Z",
    category: "FACTORY_SURVEILLANCE",
    status: "PAID",
    billedTo: {
      companyName: CANONICAL_DEMO_COMPANY.name,
      legalName: CANONICAL_DEMO_COMPANY.legalName,
      gstin: CANONICAL_DEMO_COMPANY.gstin,
      address: CANONICAL_DEMO_COMPANY.address,
      city: CANONICAL_DEMO_COMPANY.city,
      state: CANONICAL_DEMO_COMPANY.state,
      pincode: CANONICAL_DEMO_COMPANY.pincode,
      stateCode: "06 (Haryana)",
    },
    issuingAuthority: {
      name: "Bureau of Indian Standards",
      branch: "Delhi Branch Office-II (DEL-II)",
      gstin: "GSTIN-000002",
      address: "Plot 4-A, Sahibabad Industrial Area, Ghaziabad, UP / Del-II",
      pan: "PAN-000002",
    },
    lineItems: [
      {
        id: "li-03",
        sacCode: "998341",
        description: "Pre-Licence / Surveillance Factory Audit Inspection Fee (2 Technical Auditors, 1 Full Day)",
        quantity: 1,
        unitRate: 18000,
        taxableAmount: 18000,
      },
      {
        id: "li-04",
        sacCode: "998341",
        description: "Travel & Logistical Regulatory Assessment Surcharge",
        quantity: 1,
        unitRate: 3500,
        taxableAmount: 3500,
      },
    ],
    subtotalTaxable: 21500,
    cgstRate: 0.09,
    cgstAmount: 1935,
    sgstRate: 0.09,
    sgstAmount: 1935,
    igstRate: 0,
    igstAmount: 0,
    totalPayable: 25370,
    receipt: {
      receiptNumber: "RCPT-2026-11849",
      receiptDate: "2026-09-05T16:08:44.000Z",
      paymentMode: "BHIM_UPI",
      transactionReference: "UPI-SIH2026-002",
      bankName: "Simulated Sandbox Gateway",
      amountPaid: 25370,
      amountInWords: "Rupees Twenty-Five Thousand Three Hundred and Seventy Only",
      acknowledgementStatus: "RECONCILED",
      simulatedQrPayload: "SAATHI_PAYMENT_VERIFY:RCPT-2026-11849:AMOUNT=25370:FOR_SIH_2026_EVALUATION_ONLY",
    },
    relatedApplicationId: "APP-2026-8841",
    relatedAuditNumber: "AUD/DEL-II/2026/0418",
    relatedCertificateNumber: "LIC-8842109",
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
    demoNotice: "SAATHI DEMONSTRATION INVOICE — FOR SIH 2026 EVALUATION ONLY — NOT AN OFFICIAL GOVERNMENT TAX INVOICE",
  },
  {
    id: "inv-2026-003",
    invoiceNumber: "INV-2026-11092",
    invoiceDate: "2026-09-12T09:00:00.000Z",
    dueDate: "2026-10-15T23:59:59.000Z",
    category: "ANNUAL_MARKING_FEE",
    status: "PENDING",
    billedTo: {
      companyName: CANONICAL_DEMO_COMPANY.name,
      legalName: CANONICAL_DEMO_COMPANY.legalName,
      gstin: CANONICAL_DEMO_COMPANY.gstin,
      address: CANONICAL_DEMO_COMPANY.address,
      city: CANONICAL_DEMO_COMPANY.city,
      state: CANONICAL_DEMO_COMPANY.state,
      pincode: CANONICAL_DEMO_COMPANY.pincode,
      stateCode: "06 (Haryana)",
    },
    issuingAuthority: {
      name: "Bureau of Indian Standards",
      branch: "Central Accounts Directorate",
      gstin: "GSTIN-000002",
      address: "Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi - 110002",
      pan: "PAN-000002",
    },
    lineItems: [
      {
        id: "li-05",
        sacCode: "998341",
        description: "Advance Annual Minimum Marking Fee (Scheme-I Standard Mark renewal block 2026-2027)",
        quantity: 1,
        unitRate: 48000,
        taxableAmount: 48000,
      },
    ],
    subtotalTaxable: 48000,
    cgstRate: 0.09,
    cgstAmount: 4320,
    sgstRate: 0.09,
    sgstAmount: 4320,
    igstRate: 0,
    igstAmount: 0,
    totalPayable: 56640,
    relatedCertificateNumber: "LIC-8842109",
    isDemo: true,
    demoWatermark: DEMO_WATERMARK_TEXT,
    demoNotice: "SAATHI DEMONSTRATION INVOICE — FOR SIH 2026 EVALUATION ONLY — NOT AN OFFICIAL GOVERNMENT TAX INVOICE",
  },
];
