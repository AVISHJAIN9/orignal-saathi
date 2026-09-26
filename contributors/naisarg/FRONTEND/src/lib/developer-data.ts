// MOCK: illustrative API reference content, not a live-generated spec. Kept
// in English rather than routed through i18n — same reasoning as
// mock-jurisdictions.ts: this is dense technical reference content (request/
// response JSON, code snippets, parameter tables) where translating it would
// be disproportionate to this prototype's Hindi coverage. The page chrome
// around it (section titles, table headers, button labels) is fully
// translated via the developers i18n namespace.

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiEndpoint {
  id: string;
  title: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  description: string;
  headers: { key: string; value: string; description: string }[];
  parameters?: ApiParameter[];
  requestBody?: {
    contentType: string;
    exampleJson: string;
  };
  responseBody: {
    status: number;
    contentType: string;
    exampleJson: string;
  };
  codeSnippets: {
    curl: string;
    javascript: string;
    python: string;
  };
}

export interface ApiSection {
  id: string;
  titleKey: string;
  icon: string;
}

export const API_SECTIONS: ApiSection[] = [
  { id: "overview", titleKey: "sections.overview.navTitle", icon: "BookOpen" },
  {
    id: "authentication",
    titleKey: "sections.authentication.navTitle",
    icon: "Key",
  },
  { id: "quickstart", titleKey: "sections.quickstart.navTitle", icon: "Zap" },
  { id: "assistant-query", titleKey: "nav.assistantApi", icon: "Bot" },
  { id: "standards-list", titleKey: "nav.standardsApi", icon: "FileText" },
  {
    id: "conformity-check",
    titleKey: "nav.conformityApi",
    icon: "ShieldCheck",
  },
  { id: "documents-analyze", titleKey: "nav.documentsApi", icon: "FileSearch" },
  { id: "compliance-chain", titleKey: "nav.chainApi", icon: "GitMerge" },
  {
    id: "rate-limits",
    titleKey: "sections.rateLimits.navTitle",
    icon: "Gauge",
  },
  { id: "errors", titleKey: "sections.errors.navTitle", icon: "AlertTriangle" },
  { id: "changelog", titleKey: "sections.changelog.navTitle", icon: "History" },
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "assistant-query",
    title: "Query Regulatory Assistant",
    method: "POST",
    path: "/api/v1/assistant/query",
    summary:
      "Submit a natural language compliance question and receive a grounded answer with clause-level citations.",
    description:
      "Processes technical queries through the SAATHI RAG pipeline, retrieving relevant IS standards, QCO gazettes, and STI guidelines.",
    headers: [
      {
        key: "Authorization",
        value: "Bearer sat_live_94820af7b8",
        description: "API secret key",
      },
      {
        key: "Content-Type",
        value: "application/json",
        description: "Request payload format",
      },
    ],
    requestBody: {
      contentType: "application/json",
      exampleJson: `{
  "query": "What are the testing requirements for electric irons under IS 302 Part 2?",
  "language": "en",
  "category_filter": ["domestic_appliances", "electrical_safety"],
  "include_citations": true
}`,
    },
    responseBody: {
      status: 200,
      contentType: "application/json",
      exampleJson: `{
  "id": "ans_01HX98Z",
  "answer": "Electric irons are governed by IS 302 (Part 2/Sec 3):2007 read in conjunction with IS 302 (Part 1). Key testing requirements include:\\n1. Input power and current rating validation (Clause 10)\\n2. Heating & temperature rise on soleplate and handles (Clause 11)",
  "citations": [
    {
      "code": "IS 302 (Part 2/Sec 3):2007",
      "clause": "Clause 11 & 13",
      "title": "Safety of Household Electrical Appliances — Electric Irons",
      "confidence": 0.96
    }
  ],
  "latency_ms": 384
}`,
    },
    codeSnippets: {
      curl: `curl -X POST https://api.saathi.bis.gov.in/v1/assistant/query \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What are the testing requirements for electric irons under IS 302 Part 2?",
    "include_citations": true
  }'`,
      javascript: `const response = await fetch('https://api.saathi.bis.gov.in/v1/assistant/query', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'What are the testing requirements for electric irons under IS 302 Part 2?',
    include_citations: true,
  }),
});
const data = await response.json();
console.log(data.answer, data.citations);`,
      python: `import requests

url = "https://api.saathi.bis.gov.in/v1/assistant/query"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "query": "What are the testing requirements for electric irons under IS 302 Part 2?",
    "include_citations": True
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print("Answer:", data["answer"])`,
    },
  },
  {
    id: "standards-list",
    title: "Search & List Standards",
    method: "GET",
    path: "/api/v1/standards",
    summary:
      "Search the Indian Standards registry with filter by division council, QCO mandatory status, and keyword.",
    description:
      "Returns metadata, current amendment edition, gazette enforcement dates, and applicable conformity schemes for matching standards.",
    headers: [
      {
        key: "Authorization",
        value: "Bearer sat_live_94820af7b8",
        description: "API secret key",
      },
    ],
    parameters: [
      {
        name: "query",
        type: "string",
        required: false,
        description: "Search term or IS code keyword",
      },
      {
        name: "mandatory_only",
        type: "boolean",
        required: false,
        description: "Filter only QCO-notified mandatory standards",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Number of results to return (max 100)",
      },
      {
        name: "offset",
        type: "integer",
        required: false,
        description: "Pagination offset",
      },
    ],
    responseBody: {
      status: 200,
      contentType: "application/json",
      exampleJson: `{
  "total": 1,
  "limit": 20,
  "offset": 0,
  "items": [
    {
      "code": "IS 302 (Part 1):2008",
      "title": "Safety of Household and Similar Electrical Appliances — General Requirements",
      "division": "Electrotechnical Division (ETD)",
      "is_mandatory": true,
      "scheme": "Scheme I (ISI Mark)",
      "effective_date": "2009-04-01"
    }
  ]
}`,
    },
    codeSnippets: {
      curl: `curl -X GET "https://api.saathi.bis.gov.in/v1/standards?query=IS%20302&mandatory_only=true" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      javascript: `const url = new URL('https://api.saathi.bis.gov.in/v1/standards');
url.searchParams.set('query', 'IS 302');
url.searchParams.set('mandatory_only', 'true');

const res = await fetch(url, {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});
const { items } = await res.json();`,
      python: `import requests

params = {"query": "IS 302", "mandatory_only": "true"}
res = requests.get(
    "https://api.saathi.bis.gov.in/v1/standards",
    params=params,
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
standards = res.json()["items"]`,
    },
  },
  {
    id: "conformity-check",
    title: "Run Product Conformity Assessment",
    method: "POST",
    path: "/api/v1/conformity/check",
    summary:
      "Evaluate product specifications against BIS mandatory regimes and determine required certification schemes.",
    description:
      "Performs automated classification, risk categorization, testing pathway derivation, and factory audit requirements mapping.",
    headers: [
      {
        key: "Authorization",
        value: "Bearer sat_live_94820af7b8",
        description: "API secret key",
      },
      {
        key: "Content-Type",
        value: "application/json",
        description: "Request payload",
      },
    ],
    requestBody: {
      contentType: "application/json",
      exampleJson: `{
  "product_name": "Smart Wi-Fi Air Purifier with HEPA Filter",
  "category": "electrical_appliances",
  "manufacturer_status": "importer",
  "electrical": true,
  "technical_tags": ["230V AC", "Wi-Fi 2.4GHz", "Plastic Enclosure"]
}`,
    },
    responseBody: {
      status: 200,
      contentType: "application/json",
      exampleJson: `{
  "classification_id": "cls_994X",
  "risk_tier": "High",
  "mandatory_schemes": [
    {
      "name": "Scheme I — ISI Mark (QCO)",
      "code": "SCHEME-I",
      "applicable_standards": ["IS 302 (Part 2/Sec 65)", "IS 13252 (Part 1)"]
    }
  ],
  "estimated_lead_time_days": 45,
  "required_documentation": ["Factory STI Quality Manual", "NABL Lab Type Test Report"]
}`,
    },
    codeSnippets: {
      curl: `curl -X POST https://api.saathi.bis.gov.in/v1/conformity/check \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "product_name": "Smart Wi-Fi Air Purifier",
    "category": "electrical_appliances",
    "manufacturer_status": "importer"
  }'`,
      javascript: `const res = await fetch('https://api.saathi.bis.gov.in/v1/conformity/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    product_name: 'Smart Wi-Fi Air Purifier',
    category: 'electrical_appliances',
    manufacturer_status: 'importer'
  })
});
const result = await res.json();`,
      python: `import requests

payload = {
    "product_name": "Smart Wi-Fi Air Purifier",
    "category": "electrical_appliances",
    "manufacturer_status": "importer"
}
res = requests.post(
    "https://api.saathi.bis.gov.in/v1/conformity/check",
    json=payload,
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
print(res.json()["mandatory_schemes"])`,
    },
  },
  {
    id: "documents-analyze",
    title: "Analyze Laboratory Test Report",
    method: "POST",
    path: "/api/v1/documents/analyze",
    summary:
      "Upload and parse a laboratory test certificate or STI document for automated compliance verification.",
    description:
      "Document Cortex engine parses test clauses, measured values, pass/fail thresholds, and flags non-conformities.",
    headers: [
      {
        key: "Authorization",
        value: "Bearer sat_live_94820af7b8",
        description: "API secret key",
      },
      {
        key: "Content-Type",
        value: "multipart/form-data",
        description: "File upload",
      },
    ],
    parameters: [
      {
        name: "file",
        type: "file (PDF, PNG, JPG)",
        required: true,
        description: "Document binary file (max 25MB)",
      },
      {
        name: "standard_code",
        type: "string",
        required: false,
        description: "Target standard to compare against (e.g. IS 4151)",
      },
    ],
    responseBody: {
      status: 200,
      contentType: "application/json",
      exampleJson: `{
  "document_id": "doc_99182AB",
  "file_name": "ERT_Test_Report_Helmet_2024.pdf",
  "lab_name": "ERTL (North) Delhi",
  "standard_evaluated": "IS 4151:2015",
  "summary": {
    "clauses_tested": 14,
    "passed": 13,
    "failed": 0,
    "flagged_for_review": 1
  }
}`,
    },
    codeSnippets: {
      curl: `curl -X POST https://api.saathi.bis.gov.in/v1/documents/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/test_report.pdf" \\
  -F "standard_code=IS 4151:2015"`,
      javascript: `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('standard_code', 'IS 4151:2015');

const res = await fetch('https://api.saathi.bis.gov.in/v1/documents/analyze', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData
});
const analysis = await res.json();`,
      python: `import requests

with open("test_report.pdf", "rb") as f:
    files = {"file": f}
    data = {"standard_code": "IS 4151:2015"}
    res = requests.post(
        "https://api.saathi.bis.gov.in/v1/documents/analyze",
        files=files,
        data=data,
        headers={"Authorization": "Bearer YOUR_API_KEY"}
    )
print(res.json()["summary"])`,
    },
  },
];

export const API_BASE_URL = "https://api.saathi.bis.gov.in/v1";
