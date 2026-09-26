# SAATHI — National Standards & Regulatory Compliance Platform

SAATHI is an AI-powered compliance and regulatory intelligence platform for Indian Standards (Bureau of Indian Standards / BIS), Quality Control Orders (QCOs), testing workflows, and conformity assessments.

The application features a complete interactive frontend with bilingual and vernacular localization (22+ Indian languages), real-time standards lookup, regulatory radar, compliance vault, sample tracking workflows, and interactive classification wizards.

---

## 🚀 Quick Start (Running in 2 Minutes)

Follow these steps to run SAATHI exactly as it operates right now.

### Prerequisites

- **Node.js**: v20.x or **v22.x+** recommended (Node.js 22 includes built-in `node:sqlite` support used by the local dev API plugin).
- **Package Manager**: `npm` (default), `pnpm`, or `bun`.
- **Python** (optional): Python 3.8+ if you want to rebuild the SQLite database from the raw BIS CSV datasets.

---

### Step 1: Install Dependencies

Clone the repository and install the project dependencies:

```bash
git clone https://github.com/Kartavvya07/SAATHI_FRONTEND_MERGED.git
cd SAATHI_FRONTEND_MERGED
npm install
```

> **Note**: If you use `pnpm` or `bun`, lockfiles (`pnpm-lock.yaml` and `bun.lock`) are also included in the repository.

---

### Step 2: Start the Development Server

Run the development server:

```bash
npm run dev
```

The application will start with Hot Module Replacement (HMR) and will be accessible at:

👉 **http://localhost:8080** (or `http://localhost:5173` if port 8080 is occupied)

---

## 📊 Standards Data & SQLite Database Setup

The platform includes two ways to serve BIS standards:

### 1. Out-of-the-Box Mode (Zero Configuration Required)
The repository comes bundled with:
- `public/data/standards.json`: Master searchable index of standards (~22 MB).
- `public/data/standards-detail/*.json`: Pre-rendered JSON records for major BIS standards (e.g. IS 10500, IS 1293, IS 2062, IS 4984, IS 9873).

The frontend automatically falls back to these static datasets without requiring any external database or backend server.

### 2. Full SQLite Database (Optional — For Full Dynamic Queries)
If you wish to enable the local SQLite API with dynamic SQL queries across all 25,000+ BIS standards:

1. Ensure Python 3 is installed.
2. Run the ingestion script from the repository root:
   ```bash
   python scripts/ingest_bis_data.py
   ```
3. This reads the CSV datasets inside `BIS CSV/` and generates `bis_standards.db`.
4. When you start `npm run dev` with **Node.js 22+**, the Vite dev plugin (`src/server/bis-api-plugin.ts`) automatically detects `bis_standards.db` and mounts `/api/standards/:key` endpoints.

---

## 🛠 Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the local Vite development server with HMR and SSR middleware |
| `npm run build` | Compiles and builds the production bundle with Vite and Nitro |
| `npm run preview` | Runs a local server to preview the production build |
| `npm run lint` | Runs ESLint to inspect code quality |
| `npm run format` | Formats files using Prettier |
| `npx tsc --noEmit` | Verifies TypeScript types without emitting build files |

---

## 🌐 Key Pages & Features

| Route | Feature Description |
| :--- | :--- |
| `/` | **Landing Page**: Animated paper-story presentation, bilingual hero, stats, interactive Ashok Chakra sequence, and interactive typography effects. |
| `/standards` | **Standards Browser**: Search, filter, and explore Indian Standards (IS), QCO mandates, and technical committees. |
| `/standards/:standardKey` | **Standards Detail View**: Deep dive into mandatory clauses, golden clauses, Indian/International cross-references, and QCO status. |
| `/sample-tracker` | **Sample Testing Status Tracker**: End-to-end laboratory testing stages, timeline tracking, parameter-level results, and test reports. |
| `/classification` | **Product Classification Wizard**: Interactive step-by-step product category identifier and scheme recommendation. |
| `/conformity-check` | **Conformity Engine**: Gap analysis against mandatory Indian Standards for manufacturer readiness. |
| `/knowledge-nexus` | **Knowledge Nexus**: Interactive workbench with regulatory filters, intelligence feeds, and document analysis. |
| `/compliance-vault` | **Compliance Vault**: Central repository for verified licenses, test certificates, and compliance records. |
| `/registration` | **Registration Workflow**: Multi-step license application wizard with draft saving and validation. |
| `/developers` | **Developer Portal**: Documentation and schema explorer for BIS and SAATHI APIs. |

---

## 🧩 Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- **UI Library**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [skiper-ui](https://skiper-ui.com/), and [Base UI](https://base-ui.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion) & Canvas particle typography
- **Localization**: [i18next](https://www.i18next.com/) with support for English, Hindi, and 20+ regional Indian languages
- **Charts & Data**: [Recharts](https://recharts.org/) and Lucide React icons
- **Server**: [Nitro](https://nitro.unjs.io/) and Vite dev server SQLite integration

---

## ❓ Troubleshooting

### 1. `Cannot find module 'node:sqlite'` warning during `npm run dev`
- **Cause**: Node.js version is older than v22.5.0.
- **Resolution**: This is a harmless warning. The frontend will automatically use the bundled static JSON data (`public/data/standards.json`) without any loss of functionality. To enable SQLite queries, update to Node.js 22+.

### 2. Port Conflict (`Port 8080 is in use`)
- Vite will automatically attempt the next available port (e.g., `8081` or `5173`). Check your terminal output for the active URL.

### 3. Large File Handling in Git
- Large generated database runtime files (`bis_standards.db`, WAL journals) and build output (`.output/`, `dist/`) are excluded from Git via `.gitignore`.
- Raw source data is fully preserved in `BIS CSV/` and `public/data/`.

---

## 📄 License & Credits

Built for the **SAATHI** National Standards & Regulatory Compliance Initiative.
All Bureau of Indian Standards (BIS) references and citations belong to their respective regulatory bodies.
