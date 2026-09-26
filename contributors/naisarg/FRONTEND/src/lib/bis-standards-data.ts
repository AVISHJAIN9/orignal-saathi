export interface BISStandardMaster {
  internal_id: number;
  IS_number: string;
  clean_number: string;
  slug: string;
  IS_title: string;
  superseding_IS?: string;
  degree_of_equivalence?: string;
  number_of_revisions?: string;
  number_of_amendments?: string;
  aspect?: string;
  language?: string;
  reaffirmation_year?: string;
  technical_department?: string;
  technical_committee?: string;
  member_secretary?: string;
  group_name?: string;
  sub_group?: string;
  sub_sub_group?: string;
  certification?: string;
  amendment_count?: number;
  gazette_document_count?: number;
  license_count?: number;
  product_manual_sit_count?: number;
  laboratory_count?: number;
  corrigendum_count?: number;
  catalogue_id?: string;
  catalogue_is_no?: string;
  catalogue_title?: string;
  catalogue_amendments?: string;
  catalogue_technical_committee?: string;
  catalogue_aspect?: string;
  catalogue_reaffirmation?: string;
  catalogue_withdrawn_status?: string;
  detail_url?: string;
  download_url?: string;
  composition_url?: string;
  extracted_at?: string;
  category_key?: string;
  category_label?: string;
  status: string;
  image_url?: string;
}

export interface BISReference {
  number: string;
  isNumber: string;
  title: string;
  committee?: string;
}

export interface BISInternationalReference {
  number: string;
  standard: string;
}

export interface BISClause {
  clauseNumber: string;
  title: string;
  content: string;
  isMandatory: boolean;
}

export interface BISQcoOrder {
  qcoId: string;
  title: string;
  product: string;
  scope: string;
  effectiveDate: string;
  status: "applicable" | "not_applicable" | string;
  exemptions: string[];
  requirements: string[];
  sourceUrl: string;
  sourceType: string;
}

export interface BISStandardDetail {
  master: BISStandardMaster;
  indianReferences: BISReference[];
  crossReferences: BISReference[];
  internationalReferences: BISInternationalReference[];
  referredBy: BISReference[];
  clauses: BISClause[];
  qco: BISQcoOrder | null;
}

const DETAIL_CACHE = new Map<string, BISStandardDetail>();

export async function fetchStandardDetail(
  key: string,
): Promise<BISStandardDetail | null> {
  const normalizedKey = key.trim().toLowerCase();
  if (DETAIL_CACHE.has(normalizedKey)) {
    return DETAIL_CACHE.get(normalizedKey)!;
  }

  // 1. Try real server API endpoint
  try {
    const res = await fetch(`/api/standards/${encodeURIComponent(normalizedKey)}`);
    if (res.ok) {
      const data: BISStandardDetail = await res.json();
      if (data && data.master) {
        DETAIL_CACHE.set(normalizedKey, data);
        return data;
      }
    }
  } catch {
    // Server API unavailable, proceed to static fallback
  }

  // 2. Try static pre-rendered detail JSON
  try {
    const res = await fetch(
      `/data/standards-detail/${encodeURIComponent(normalizedKey)}.json`,
    );
    if (res.ok) {
      const data: BISStandardDetail = await res.json();
      if (data && data.master) {
        DETAIL_CACHE.set(normalizedKey, data);
        return data;
      }
    }
  } catch {
    // Static pre-rendered file unavailable, proceed to client catalogue lookup
  }

  // 3. Fallback: synthesize from standards.json master index
  try {
    const res = await fetch("/data/standards.json");
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.rows)) {
        const clean = normalizedKey.replace(/^is[-_]?/i, "");
        const row = data.rows.find((r: any[]) => {
          return (
            r[1] === normalizedKey ||
            r[0] === clean ||
            r[2]?.toLowerCase() === `is ${clean}` ||
            r[2]?.toLowerCase().startsWith(`is ${clean} `) ||
            r[2]?.toLowerCase().startsWith(`is ${clean}:`) ||
            r[2]?.toLowerCase().startsWith(`is ${clean}(`)
          );
        });

        if (row) {
          const detail: BISStandardDetail = {
            master: {
              internal_id: Number(row[0]),
              slug: row[1],
              IS_number: row[2],
              clean_number: clean,
              IS_title: row[3],
              aspect: row[10] || "Product Specification",
              technical_department: row[8] || "",
              technical_committee: row[9] || "",
              number_of_revisions: row[11] || "",
              number_of_amendments: row[12] || "",
              reaffirmation_year: row[13] || "",
              gazette_document_count: row[14] || 0,
              license_count: row[15] || 0,
              detail_url:
                row[16] ||
                `https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/Indian_standards/isdetails/${row[0]}`,
              download_url: `https://standardsbis.bsbedge.com/search_redirect.aspx?id=${row[0]}`,
              status: row[7] || "Active",
              category_key: row[5] || "general",
              category_label: row[6] || "General Standards",
            },
            indianReferences: [],
            crossReferences: [],
            internationalReferences: [],
            referredBy: [],
            clauses: [],
            qco: null,
          };
          DETAIL_CACHE.set(normalizedKey, detail);
          return detail;
        }
      }
    }
  } catch {
    // Catalogue lookup failed
  }

  return null;
}
