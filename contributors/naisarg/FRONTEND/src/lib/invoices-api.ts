import { API_BASE_URL } from "./developer-data";
import {
  S24_DEMO_INVOICES,
  type StatutoryInvoice,
  type InvoiceLineItem,
} from "./demo/s24-demo-data";

export interface GstCalculationResult {
  subtotalTaxable: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalPayable: number;
}

/**
 * Centralized deterministic GST calculation helper.
 * Subtotal + CGST (9%) + SGST (9%) = Total Payable.
 */
export function calculateGst(
  lineItems: InvoiceLineItem[],
  cgstRate = 0.09,
  sgstRate = 0.09,
  isInterState = false
): GstCalculationResult {
  const subtotalTaxable = lineItems.reduce((acc, item) => acc + item.taxableAmount, 0);

  if (isInterState) {
    const igstRate = cgstRate + sgstRate;
    const igstAmount = Math.round(subtotalTaxable * igstRate);
    return {
      subtotalTaxable,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate,
      igstAmount,
      totalPayable: subtotalTaxable + igstAmount,
    };
  }

  const cgstAmount = Math.round(subtotalTaxable * cgstRate);
  const sgstAmount = Math.round(subtotalTaxable * sgstRate);
  return {
    subtotalTaxable,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate: 0,
    igstAmount: 0,
    totalPayable: subtotalTaxable + cgstAmount + sgstAmount,
  };
}

export interface InvoicesResult {
  invoices: StatutoryInvoice[];
  isDemoFallback: boolean;
  summary: {
    totalInvoices: number;
    totalPaidAmount: number;
    pendingAmount: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
  };
}

const INVOICES_STORAGE_KEY = "saathi:demo_invoices_data";

export const invoicesApi = {
  /**
   * Fetches statutory invoices and receipt records.
   */
  async getInvoices(params?: {
    status?: "ALL" | "PAID" | "PENDING" | "OVERDUE";
    search?: string;
  }): Promise<InvoicesResult> {
    const targetUrl = `${API_BASE_URL}/invoices`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        const invoices: StatutoryInvoice[] = Array.isArray(data) ? data : data.invoices || [];
        return this.formatInvoicesResult(invoices, false, params);
      }
    } catch {
      // Fallback to demo
    }

    // Local storage persistence for interactive demo actions (e.g. paying an invoice)
    let invoices = S24_DEMO_INVOICES;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(INVOICES_STORAGE_KEY);
        if (saved) {
          invoices = JSON.parse(saved);
        } else {
          localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(S24_DEMO_INVOICES));
        }
      } catch {
        // Ignore local storage error
      }
    }

    return this.formatInvoicesResult(invoices, true, params);
  },

  /**
   * Fetches a single invoice by ID.
   */
  async getInvoiceById(id: string): Promise<StatutoryInvoice | null> {
    const res = await this.getInvoices();
    return res.invoices.find((inv) => inv.id === id) || null;
  },

  /**
   * Simulates settlement of a pending statutory invoice in demo mode.
   */
  async payDemoInvoice(
    invoiceId: string,
    paymentMode: "NEFT_RTGS" | "BHIM_UPI" | "NET_BANKING" = "BHIM_UPI"
  ): Promise<StatutoryInvoice> {
    const targetUrl = `${API_BASE_URL}/invoices/${encodeURIComponent(invoiceId)}/pay`;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMode }),
      });
      if (response.ok) {
        return (await response.json()) as StatutoryInvoice;
      }
    } catch {
      // Demo fallback
    }

    const { invoices } = await this.getInvoices();
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) throw new Error(`Invoice ${invoiceId} not found`);

    const now = new Date();
    const updated: StatutoryInvoice = {
      ...inv,
      status: "PAID",
      receipt: {
        receiptNumber: `RCPT-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        receiptDate: now.toISOString(),
        paymentMode,
        transactionReference: `UPI-SIH2026-${Math.floor(1000 + Math.random() * 9000)}`,
        bankName: "Simulated Sandbox Gateway",
        amountPaid: inv.totalPayable,
        amountInWords: `Rupees ${inv.totalPayable.toLocaleString("en-IN")} Only`,
        acknowledgementStatus: "RECONCILED",
        simulatedQrPayload: `SAATHI_PAYMENT_VERIFY:${inv.id}:AMOUNT=${inv.totalPayable}:FOR_SIH_2026_EVALUATION_ONLY`,
      },
    };

    if (typeof window !== "undefined") {
      try {
        const newInvoices = invoices.map((i) => (i.id === invoiceId ? updated : i));
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(newInvoices));
      } catch {
        // ignore
      }
    }

    return updated;
  },

  formatInvoicesResult(
    allInvoices: StatutoryInvoice[],
    isDemo: boolean,
    params?: { status?: string; search?: string }
  ): InvoicesResult {
    let filtered = [...allInvoices];

    if (params?.status && params.status !== "ALL") {
      filtered = filtered.filter((i) => i.status === params.status);
    }

    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(s) ||
          i.category.toLowerCase().includes(s) ||
          i.lineItems.some((li) => li.description.toLowerCase().includes(s))
      );
    }

    const paid = allInvoices.filter((i) => i.status === "PAID");
    const pending = allInvoices.filter((i) => i.status === "PENDING" || i.status === "OVERDUE");

    return {
      invoices: filtered,
      isDemoFallback: isDemo,
      summary: {
        totalInvoices: allInvoices.length,
        totalPaidAmount: paid.reduce((acc, i) => acc + i.totalPayable, 0),
        pendingAmount: pending.reduce((acc, i) => acc + i.totalPayable, 0),
        paidCount: paid.length,
        pendingCount: allInvoices.filter((i) => i.status === "PENDING").length,
        overdueCount: allInvoices.filter((i) => i.status === "OVERDUE").length,
      },
    };
  },
};
