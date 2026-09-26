import os
import csv
import json
import sqlite3
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_DIR = os.path.join(BASE_DIR, "BIS_CSV") if os.path.exists(os.path.join(BASE_DIR, "BIS_CSV")) else os.path.join(BASE_DIR, "BIS CSV")
DB_PATH = os.path.join(BASE_DIR, "bis_standards.db")
PUBLIC_DATA_DIR = os.path.join(BASE_DIR, "public", "data")
DETAILS_DIR = os.path.join(PUBLIC_DATA_DIR, "standards-detail")

os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)
os.makedirs(DETAILS_DIR, exist_ok=True)

print(f"Ingesting BIS data from {CSV_DIR} into {DB_PATH}...")

# Connect to SQLite
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Enable WAL mode for high concurrency
cursor.execute("PRAGMA journal_mode = WAL;")
cursor.execute("PRAGMA synchronous = NORMAL;")

# 1. Create tables
cursor.execute("""
DROP TABLE IF EXISTS standards_master;
""")
cursor.execute("""
CREATE TABLE standards_master (
    internal_id INTEGER PRIMARY KEY,
    IS_number TEXT NOT NULL,
    clean_number TEXT,
    slug TEXT NOT NULL,
    IS_title TEXT,
    superseding_IS TEXT,
    degree_of_equivalence TEXT,
    number_of_revisions TEXT,
    number_of_amendments TEXT,
    aspect TEXT,
    language TEXT,
    reaffirmation_year TEXT,
    technical_department TEXT,
    technical_committee TEXT,
    member_secretary TEXT,
    group_name TEXT,
    sub_group TEXT,
    sub_sub_group TEXT,
    certification TEXT,
    amendment_count INTEGER DEFAULT 0,
    gazette_document_count INTEGER DEFAULT 0,
    license_count INTEGER DEFAULT 0,
    product_manual_sit_count INTEGER DEFAULT 0,
    laboratory_count INTEGER DEFAULT 0,
    corrigendum_count INTEGER DEFAULT 0,
    catalogue_id TEXT,
    catalogue_is_no TEXT,
    catalogue_title TEXT,
    catalogue_amendments TEXT,
    catalogue_technical_committee TEXT,
    catalogue_aspect TEXT,
    catalogue_reaffirmation TEXT,
    catalogue_withdrawn_status TEXT,
    detail_url TEXT,
    download_url TEXT,
    composition_url TEXT,
    extracted_at TEXT,
    category_key TEXT,
    category_label TEXT,
    status TEXT,
    image_url TEXT
);
""")

cursor.execute("""
DROP TABLE IF EXISTS indian_references;
""")
cursor.execute("""
CREATE TABLE indian_references (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internal_id INTEGER NOT NULL,
    reference_number TEXT,
    reference_is_number TEXT,
    reference_title TEXT,
    reference_committee TEXT
);
""")

cursor.execute("""
DROP TABLE IF EXISTS cross_references;
""")
cursor.execute("""
CREATE TABLE cross_references (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internal_id INTEGER NOT NULL,
    reference_number TEXT,
    reference_is_number TEXT,
    reference_title TEXT,
    reference_committee TEXT
);
""")

cursor.execute("""
DROP TABLE IF EXISTS international_references;
""")
cursor.execute("""
CREATE TABLE international_references (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internal_id INTEGER NOT NULL,
    reference_number TEXT,
    international_standard TEXT
);
""")

cursor.execute("""
DROP TABLE IF EXISTS referred_by;
""")
cursor.execute("""
CREATE TABLE referred_by (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internal_id INTEGER NOT NULL,
    reference_number TEXT,
    reference_is_number TEXT,
    reference_title TEXT,
    reference_committee TEXT
);
""")

cursor.execute("""
DROP TABLE IF EXISTS golden_clauses;
""")
cursor.execute("""
CREATE TABLE golden_clauses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    standard_number TEXT NOT NULL,
    clause_number TEXT NOT NULL,
    title TEXT,
    content TEXT,
    is_mandatory INTEGER DEFAULT 0
);
""")

cursor.execute("""
DROP TABLE IF EXISTS qco_orders;
""")
cursor.execute("""
CREATE TABLE qco_orders (
    qco_id TEXT PRIMARY KEY,
    standard_number TEXT NOT NULL,
    title TEXT NOT NULL,
    product TEXT,
    scope TEXT,
    effective_date TEXT,
    status TEXT,
    exemptions_json TEXT,
    requirements_json TEXT,
    source_url TEXT,
    source_type TEXT
);
""")

def extract_clean_number(is_num: str) -> str:
    # Extracts main IS number digits, e.g. "IS 302 (Part 1)" -> "302"
    m = re.search(r'\bIS\s*(?:/[A-Z0-9]+)?\s*(\d+)', is_num, re.IGNORECASE)
    if m:
        return m.group(1)
    m2 = re.search(r'(\d+)', is_num)
    return m2.group(1) if m2 else ""

def determine_category(is_num: str, dept: str, title: str):
    clean = extract_clean_number(is_num)
    lower_title = title.lower()

    # Specific well-known standards
    if clean == "4151" or "helmet" in lower_title:
        return ("helmets", "Helmets", "/images/products/helmets.jpg")
    if clean == "302" or ("appliances" in lower_title and "electrical" in lower_title):
        return ("appliances", "Appliances", "/images/products/appliances.png")
    if clean == "1417" or "gold" in lower_title or "hallmark" in lower_title:
        return ("gold", "Gold Jewellery", "/images/products/gold-jewellery.png")
    if clean in ("14543", "13428") or "drinking water" in lower_title or "mineral water" in lower_title:
        return ("water", "Packaged Water", "/images/products/water.jpg")
    if clean == "2347" or "pressure cooker" in lower_title:
        return ("cookers", "Pressure Cookers", "/images/products/pressure-cooker.png")
    if clean == "9873" or "toy" in lower_title:
        return ("toys", "Toys", "/images/products/toys.jpg")

    # Technical Department mappings
    d = dept.upper()
    if "FAD" in d or "FOOD" in d:
        return ("food", "Food & Agriculture", "/images/products/standard-fallback.jpg")
    if "ETD" in d or "ELECTROTECHNICAL" in d:
        return ("electrotechnical", "Electrotechnical", "/images/products/standard-fallback.jpg")
    if "LITD" in d or "ELECTRONICS" in d:
        return ("electronics", "Electronics & IT", "/images/products/standard-fallback.jpg")
    if "CHD" in d or "CHEMICAL" in d:
        return ("chemicals", "Chemicals", "/images/products/standard-fallback.jpg")
    if "CED" in d or "CIVIL" in d:
        return ("civil", "Civil Engineering", "/images/products/standard-fallback.jpg")
    if "MED" in d or "MECHANICAL" in d:
        return ("mechanical", "Mechanical Eng.", "/images/products/standard-fallback.jpg")
    if "MTD" in d or "METALLURG" in d:
        return ("metallurgy", "Metallurgy", "/images/products/standard-fallback.jpg")
    if "TXD" in d or "TEXTILE" in d:
        return ("textiles", "Textiles", "/images/products/standard-fallback.jpg")
    if "MHD" in d or "MEDICAL" in d:
        return ("medical", "Medical Equipment", "/images/products/standard-fallback.jpg")
    if "PCD" in d or "PETROLEUM" in d:
        return ("petroleum", "Petroleum & Coal", "/images/products/standard-fallback.jpg")
    if "TED" in d or "TRANSPORT" in d:
        return ("transport", "Transport Eng.", "/images/products/standard-fallback.jpg")
    if "MSD" in d or "MANAGEMENT" in d:
        return ("management", "Management Systems", "/images/products/standard-fallback.jpg")
    if "WRD" in d or "WATER RES" in d:
        return ("water-res", "Water Resources", "/images/products/water.jpg")
    if "PGD" in d or "PRODUCTION" in d:
        return ("production", "Production & General Eng.", "/images/products/standard-fallback.jpg")
    if "SSD" in d or "SERVICE" in d:
        return ("services", "Service Sector", "/images/products/standard-fallback.jpg")

    return ("general", "General Standards", "/images/products/standard-fallback.jpg")

# 2. Ingest bis_standards_master.csv
print("Ingesting bis_standards_master.csv...")
master_path = os.path.join(CSV_DIR, "bis_standards_master.csv")

slug_counts = {}
standards_rows_for_json = []

with open(master_path, "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    records = []
    for r in reader:
        iid = int(r["internal_id"])
        is_num = r["IS_number"].strip()
        title = r["IS_title"].strip()
        clean = extract_clean_number(is_num)

        # Canonical slug: if clean exists and is unique, use is{clean}, else is-{iid}
        base_slug = f"is{clean}" if clean else f"is-{iid}"
        
        # We ensure key standards get the canonical slug
        if clean == "302" and ("Part 1" in is_num or ":2024" in is_num):
            slug = "is302"
        elif clean == "1417" and "2016" in is_num:
            slug = "is1417"
        elif clean == "2347" and ("2023" in is_num or "2017" in is_num):
            slug = "is2347"
        elif clean == "4151" and "2015" in is_num:
            slug = "is4151"
        elif clean == "14543" and "2024" in is_num:
            slug = "is14543"
        elif clean == "9873" and "Part 1" in is_num:
            slug = "is9873"
        elif clean == "10500":
            slug = "is10500"
        else:
            # disambiguate duplicate slugs
            slug = f"is-{iid}"

        cat_key, cat_label, img_url = determine_category(is_num, r["technical_department"], title)
        status = "Withdrawn" if "withdrawn" in r.get("catalogue_withdrawn_status", "").lower() else "Active"

        records.append((
            iid,
            is_num,
            clean,
            slug,
            title,
            r.get("superseding_IS", ""),
            r.get("degree_of_equivalence", ""),
            r.get("number_of_revisions", ""),
            r.get("number_of_amendments", ""),
            r.get("aspect", ""),
            r.get("language", ""),
            r.get("reaffirmation_year", ""),
            r.get("technical_department", ""),
            r.get("technical_committee", ""),
            r.get("member_secretary", ""),
            r.get("group", ""),
            r.get("sub_group", ""),
            r.get("sub_sub_group", ""),
            r.get("certification", ""),
            int(r.get("amendment_count", 0) or 0),
            int(r.get("gazette_document_count", 0) or 0),
            int(r.get("license_count", 0) or 0),
            int(r.get("product_manual_sit_count", 0) or 0),
            int(r.get("laboratory_count", 0) or 0),
            int(r.get("corrigendum_count", 0) or 0),
            r.get("catalogue_id", ""),
            r.get("catalogue_is_no", ""),
            r.get("catalogue_title", ""),
            r.get("catalogue_amendments", ""),
            r.get("catalogue_technical_committee", ""),
            r.get("catalogue_aspect", ""),
            r.get("catalogue_reaffirmation", ""),
            r.get("catalogue_withdrawn_status", ""),
            r.get("detail_url", ""),
            r.get("download_url", ""),
            r.get("composition_url", ""),
            r.get("extracted_at", ""),
            cat_key,
            cat_label,
            status,
            img_url
        ))

        # Compact row for standards.json
        # [id, slug, is_num, title, description, cat_key, cat_label, status, dept, committee, aspect, revisions, amendments, reaffirmation, gazette_count, license_count, detail_url]
        desc = f"{r.get('aspect', 'Specification')} under {r.get('technical_committee', '')}. Department: {r.get('technical_department', '')}. Revisions: {r.get('number_of_revisions', 'None')}. Amendments: {r.get('number_of_amendments', 'None')}."
        standards_rows_for_json.append([
            str(iid),
            slug,
            is_num,
            title,
            desc,
            cat_key,
            cat_label,
            status,
            r.get("technical_department", ""),
            r.get("technical_committee", ""),
            r.get("aspect", ""),
            r.get("number_of_revisions", ""),
            r.get("number_of_amendments", ""),
            r.get("reaffirmation_year", ""),
            int(r.get("gazette_document_count", 0) or 0),
            int(r.get("license_count", 0) or 0),
            r.get("detail_url", "")
        ])

    cursor.executemany("""
    INSERT INTO standards_master VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    """, records)
    conn.commit()
    print(f"Inserted {len(records)} records into standards_master.")

# 3. Ingest bis_indian_references.csv
print("Ingesting bis_indian_references.csv...")
with open(os.path.join(CSV_DIR, "bis_indian_references.csv"), "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    batch = []
    for r in reader:
        batch.append((
            int(r["internal_id"]),
            r.get("reference_number", ""),
            r.get("reference_is_number", ""),
            r.get("reference_title", ""),
            r.get("reference_committee", "")
        ))
    cursor.executemany("INSERT INTO indian_references (internal_id, reference_number, reference_is_number, reference_title, reference_committee) VALUES (?,?,?,?,?);", batch)
    conn.commit()
    print(f"Inserted {len(batch)} indian_references.")

# 4. Ingest bis_cross_references.csv
print("Ingesting bis_cross_references.csv...")
with open(os.path.join(CSV_DIR, "bis_cross_references.csv"), "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    batch = []
    for r in reader:
        batch.append((
            int(r["internal_id"]),
            r.get("reference_number", ""),
            r.get("reference_is_number", ""),
            r.get("reference_title", ""),
            r.get("reference_committee", "")
        ))
    cursor.executemany("INSERT INTO cross_references (internal_id, reference_number, reference_is_number, reference_title, reference_committee) VALUES (?,?,?,?,?);", batch)
    conn.commit()
    print(f"Inserted {len(batch)} cross_references.")

# 5. Ingest bis_international_references.csv
print("Ingesting bis_international_references.csv...")
with open(os.path.join(CSV_DIR, "bis_international_references.csv"), "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    batch = []
    for r in reader:
        batch.append((
            int(r["internal_id"]),
            r.get("reference_number", ""),
            r.get("international_standard", "")
        ))
    cursor.executemany("INSERT INTO international_references (internal_id, reference_number, international_standard) VALUES (?,?,?);", batch)
    conn.commit()
    print(f"Inserted {len(batch)} international_references.")

# 6. Ingest bis_referred_by.csv
print("Ingesting bis_referred_by.csv...")
with open(os.path.join(CSV_DIR, "bis_referred_by.csv"), "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    batch = []
    for r in reader:
        batch.append((
            int(r["internal_id"]),
            r.get("reference_number", ""),
            r.get("reference_is_number", ""),
            r.get("reference_title", ""),
            r.get("reference_committee", "")
        ))
    cursor.executemany("INSERT INTO referred_by (internal_id, reference_number, reference_is_number, reference_title, reference_committee) VALUES (?,?,?,?,?);", batch)
    conn.commit()
    print(f"Inserted {len(batch)} referred_by.")

# 7. Ingest Golden Clauses
print("Ingesting verified golden clauses...")
golden_clauses_data = [
    # IS 10500:2012
    ("IS 10500:2012", "Clause 4.1", "Essential Requirements (Table 1)", "pH value must be between 6.5 and 8.5 without relaxation. Total Dissolved Solids (TDS) acceptable limit is 500 mg/l, permissible up to 2000 mg/l in the absence of an alternate source.", 1),
    ("IS 10500:2012", "Clause 4.2", "Bacteriological Quality", "All water intended for drinking shall not contain E. coli or thermotolerant coliform bacteria in any 100 ml sample.", 1),
    ("IS 10500:2012", "Clause 4.3", "Toxic Substances (Table 2)", "Lead (as Pb) max 0.01 mg/l, Arsenic (as As) max 0.01 mg/l, Fluoride (as F) max 1.0 mg/l (permissible up to 1.5 mg/l).", 1),
    # IS 4984:2016
    ("IS 4984:2016", "Clause 5.1", "Raw Material Classification", "Pipes shall be manufactured from virgin polyethylene material of designation PE-63, PE-80, or PE-100 containing 2.0 to 2.5% carbon black.", 1),
    ("IS 4984:2016", "Clause 8.1", "Hydrostatic Strength Test", "Pipes must withstand internal hydrostatic pressure test at 80°C for 165 hours without failure or leakage.", 1),
    # IS 2062:2011
    ("IS 2062:2011", "Clause 6.1", "Chemical Composition", "Carbon content shall not exceed 0.20% for Grade E250 Quality A, with Carbon Equivalent (CE) max 0.42%.", 1),
    ("IS 2062:2011", "Clause 9.1", "Tensile Strength and Yield Stress", "Minimum yield stress for Grade E250 is 250 MPa for thickness < 20 mm; minimum tensile strength is 410 MPa with 23% elongation.", 1),
    # IS 14543
    ("IS 14543:2004", "Clause 4.1", "Hygienic Practice Requirements", "The water shall be processed, handled, packaged, and stored under strict hygienic conditions conforming to Good Manufacturing Practices (GMP).", 1),
    ("IS 14543:2004", "Clause 5.1", "Microbiological Requirements", "Total coliforms, faecal streptococci, Salmonella, and Pseudomonas aeruginosa must be completely absent in 250 ml packaged samples.", 1),
    # IS 694:2010
    ("IS 694:2010", "Clause 7.1", "Conductor Resistance", "The electrical resistance of conductors shall not exceed the values specified in IS 8130 for annealed copper and aluminium.", 1),
    ("IS 694:2010", "Clause 10.2", "Insulation Resistance & Spark Test", "Cables shall pass spark testing at 6 kV AC or 9 kV DC during extrusion without insulation puncture.", 1),
    # IS 13252 (Part 1):2010
    ("IS 13252 (Part 1):2010", "Clause 1.5", "Components Safety", "Components installed in information technology equipment must comply with the relevant safety requirements to protect operators against electric shock.", 1),
    ("IS 13252 (Part 1):2010", "Clause 2.1", "Protection Against Electric Shock", "Accessible parts shall not be live under normal and single-fault conditions; insulation clearances and creepage distances must be strictly maintained.", 1),
    # IS 1293:2019
    ("IS 1293:2019", "Clause 9.1", "Dimensions of Plugs and Socket-Outlets", "Plugs and sockets rated 6A, 10A, and 16A must conform to the standard gauge dimensions to prevent hazardous or incomplete pin engagement.", 1),
    ("IS 1293:2019", "Clause 13.1", "Temperature Rise", "Temperature rise of terminals shall not exceed 45 K during continuous rated current load testing.", 1),
    # IS 1786:2008
    ("IS 1786:2008", "Clause 4.2", "Chemical Requirements", "Maximum carbon content shall be 0.30% for Fe 415, 0.25% for Fe 500D; sulphur and phosphorus shall not exceed 0.040% each for D grades.", 1),
    ("IS 1786:2008", "Clause 8.1", "Mechanical Properties", "Proof stress (0.2%) min 500 N/mm² for Fe 500D, tensile strength min 565 N/mm², elongation min 16.0%, and total elongation at max force min 5%.", 1),
    # IS 814:2004
    ("IS 814:2004", "Clause 5.1", "Covered Electrodes Classification", "Covered electrodes for manual metal arc welding of carbon and carbon manganese steels shall meet specified coating, deposition efficiency, and tensile properties.", 1),
    # IS 15885 (Part 2/Sec 13):2012
    ("IS 15885 (Part 2/Sec 13):2012", "Clause 6.1", "LED Controlgear Safety", "DC or AC supplied electronic controlgear for LED modules shall provide SELV equivalent isolation and protection against abnormal overheating and voltage surges.", 1),
]

cursor.executemany("INSERT INTO golden_clauses (standard_number, clause_number, title, content, is_mandatory) VALUES (?,?,?,?,?);", golden_clauses_data)
conn.commit()
print(f"Inserted {len(golden_clauses_data)} golden clauses.")

# 8. Ingest Real QCO Orders
print("Ingesting verified QCO orders...")
qco_records = [
    (
        "QCO-HELMET-2021",
        "IS 4151",
        "Protective Helmets for Two-Wheeler Riders (Quality Control) Order, 2021",
        "Protective helmets for two-wheeler riders",
        "Mandatory BIS certification for all protective helmets manufactured, imported, stored for sale, or sold for use by two-wheeler riders and pillion passengers in India under Gazette Notification S.O. 4252(E).",
        "2021-06-01",
        "applicable",
        json.dumps(["Helmets manufactured solely for export, and not sold within India, are exempt from this Order."]),
        json.dumps([
            "Valid BIS Licence (ISI mark) under IS 4151 prior to manufacture or import.",
            "Each helmet must bear the Standard Mark (ISI mark) legibly and indelibly.",
            "Compliance with impact absorption, penetration resistance, and retention system tests specified in IS 4151."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    ),
    (
        "QCO-APPLIANCE-2020",
        "IS 302",
        "Electrical Appliances and Equipment (Quality Control) Order, 2020",
        "Household and similar electrical appliances",
        "Mandatory BIS certification for household electrical appliances covered under IS 302 before they are manufactured, stored for sale, sold, or distributed in India under Ministry of Commerce and Industry Gazette Order.",
        "2020-11-13",
        "applicable",
        json.dumps(["Appliances manufactured exclusively for export are exempt from this Order."]),
        json.dumps([
            "Valid BIS Licence (ISI mark) under IS 302 before manufacture, sale, or import.",
            "Registration and testing at a BIS-recognised laboratory against general and specific safety requirements.",
            "Display of the Standard Mark on every unit placed in the market."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    ),
    (
        "QCO-WATER-2021",
        "IS 14543",
        "Drinking Water (Packaged) (Quality Control) Order, 2021",
        "Packaged natural mineral water and packaged drinking water",
        "Mandatory BIS certification for packaged natural mineral water and packaged drinking water manufactured or sold in India, enforced jointly with FSSAI.",
        "2021-01-01",
        "applicable",
        json.dumps([]),
        json.dumps([
            "Valid BIS Licence under IS 14543 before packaging and sale.",
            "Compliance with composition, contaminant, and hygiene limits specified in IS 14543.",
            "Batch-wise testing records maintained at the manufacturing unit."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    ),
    (
        "QCO-TOYS-2020",
        "IS 9873",
        "Toys (Quality Control) Order, 2020",
        "Toys intended for use by children under 14 years",
        "Mandatory BIS certification under Scheme I (ISI mark) for toys manufactured, imported, or sold in India, covering mechanical, physical, and chemical safety under DPIIT Gazette Notification S.O. 853(E).",
        "2020-09-25",
        "applicable",
        json.dumps(["Toys manufactured exclusively for export are exempt from this Order."]),
        json.dumps([
            "Valid BIS Licence (ISI mark) under IS 9873 prior to manufacture or import.",
            "Compliance with mechanical and physical safety requirements, including small-parts and sharp-edge tests.",
            "Every toy or its packaging must bear the Standard Mark."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    ),
    (
        "QCO-COOKER-2020",
        "IS 2347",
        "Domestic Pressure Cookers (Quality Control) Order, 2020",
        "Domestic pressure cookers",
        "Mandatory BIS certification under DPIIT Order S.O. 371(E). All domestic pressure cookers manufactured, imported, or sold in India must conform to IS 2347 and bear the Standard Mark (ISI mark).",
        "2020-08-01",
        "applicable",
        json.dumps(["Goods or articles meant exclusively for export are exempt from this Order."]),
        json.dumps([
            "Mandatory BIS certification under Scheme-I (ISI Mark) under IS 2347.",
            "Verification of thermal and pressure relief safety mechanisms and burst pressure test compliance.",
            "Prohibition of manufacture, import, sale, distribution, storage, or exhibition without valid BIS Licence."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    ),
    (
        "QCO-GOLD-2020",
        "IS 1417",
        "Hallmarking of Gold Jewellery and Gold Artefacts Order, 2020",
        "Gold jewellery and gold artefacts",
        "Mandatory hallmarking in notified districts under Ministry of Consumer Affairs, Food and Public Distribution, S.O. 322(E), enforcing certified fineness grades under IS 1417.",
        "2021-06-16",
        "applicable",
        json.dumps(["Export jewellery, medical artefacts, and manufacturers below threshold turnover are exempt."]),
        json.dumps([
            "Registration with BIS for gold jewellery retailing.",
            "Assaying and hallmarking exclusively at BIS-recognized Assaying and Hallmarking Centres (AHC).",
            "Mandatory 6-digit alphanumeric HUID (Hallmark Unique Identification) stamped alongside BIS logo and purity grade."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    ),
    (
        "QCO-STEEL-2020",
        "IS 1786",
        "Steel and Steel Products (Quality Control) Order, 2020",
        "High strength deformed steel bars and wires for concrete reinforcement",
        "Mandatory ISI mark certification under Ministry of Steel Order S.O. 2452(E). Conformance to IS 1786 is compulsory for manufacturing, import, and commercial sale in India.",
        "2020-10-01",
        "applicable",
        json.dumps([]),
        json.dumps([
            "Mandatory BIS Licence (ISI Mark) under IS 1786.",
            "Strict adherence to chemical limits (carbon, sulphur, phosphorus) and bend/rebend tests."
        ]),
        "https://www.services.bis.gov.in",
        "gazette_notification"
    )
]

cursor.executemany("INSERT INTO qco_orders VALUES (?,?,?,?,?,?,?,?,?,?,?);", qco_records)
conn.commit()
print(f"Inserted {len(qco_records)} QCO orders.")

# 9. Create indexes for high-speed queries
print("Creating database indexes...")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_standards_slug ON standards_master (slug);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_standards_clean ON standards_master (clean_number);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_standards_isnum ON standards_master (IS_number);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_standards_cat ON standards_master (category_key);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_standards_dept ON standards_master (technical_department);")

cursor.execute("CREATE INDEX IF NOT EXISTS idx_ind_ref_id ON indian_references (internal_id);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_cross_ref_id ON cross_references (internal_id);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_intl_ref_id ON international_references (internal_id);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_ref_by_id ON referred_by (internal_id);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_golden_std ON golden_clauses (standard_number);")
cursor.execute("CREATE INDEX IF NOT EXISTS idx_qco_std ON qco_orders (standard_number);")
conn.commit()
print("Indexes created.")

# 10. Write enriched public/data/standards.json
print(f"Writing enriched public/data/standards.json with {len(standards_rows_for_json)} rows...")
standards_json_path = os.path.join(PUBLIC_DATA_DIR, "standards.json")
with open(standards_json_path, "w", encoding="utf-8") as out:
    json.dump({
        "total": len(standards_rows_for_json),
        "activeCount": sum(1 for r in standards_rows_for_json if r[7] == "Active"),
        "cols": [
            "id", "slug", "isNumber", "title", "description",
            "categoryKey", "categoryLabel", "status", "department",
            "committee", "aspect", "revisions", "amendments",
            "reaffirmationYear", "gazetteCount", "licenseCount", "detailUrl"
        ],
        "rows": standards_rows_for_json
    }, out, separators=(',', ':'))
print("standards.json written.")

# 11. Generate static detail files for key/golden standards so they are immediately accessible even if server is offline
print("Generating static detail files for key standards...")
key_slugs = ["is302", "is1417", "is2347", "is4151", "is10500", "is14543", "is9873", "is694", "is2062", "is4984", "is13252", "is1293", "is1786", "is814", "is15885"]

for slug in key_slugs:
    row = cursor.execute("SELECT * FROM standards_master WHERE slug = ? OR clean_number = ? LIMIT 1", (slug, slug.replace("is", ""))).fetchone()
    if not row:
        continue
    
    col_names = [d[0] for d in cursor.description]
    item = dict(zip(col_names, row))
    iid = item["internal_id"]
    clean = item["clean_number"]
    is_num = item["IS_number"]

    # Indian references
    ind_refs = cursor.execute("SELECT reference_number, reference_is_number, reference_title, reference_committee FROM indian_references WHERE internal_id = ?", (iid,)).fetchall()
    # Cross references
    cross_refs = cursor.execute("SELECT reference_number, reference_is_number, reference_title, reference_committee FROM cross_references WHERE internal_id = ?", (iid,)).fetchall()
    # International references
    intl_refs = cursor.execute("SELECT reference_number, international_standard FROM international_references WHERE internal_id = ?", (iid,)).fetchall()
    # Referred by
    ref_by = cursor.execute("SELECT reference_number, reference_is_number, reference_title, reference_committee FROM referred_by WHERE internal_id = ?", (iid,)).fetchall()
    # Golden clauses
    clauses = cursor.execute("SELECT clause_number, title, content, is_mandatory FROM golden_clauses WHERE standard_number LIKE ? OR standard_number LIKE ?", (f"%{clean}%", f"%{is_num}%")).fetchall()
    # QCO
    qco = cursor.execute("SELECT qco_id, title, product, scope, effective_date, status, exemptions_json, requirements_json, source_url, source_type FROM qco_orders WHERE standard_number LIKE ? OR standard_number LIKE ?", (f"%{clean}%", f"%{is_num}%")).fetchone()

    detail_obj = {
        "master": item,
        "indianReferences": [{"number": r[0], "isNumber": r[1], "title": r[2], "committee": r[3]} for r in ind_refs],
        "crossReferences": [{"number": r[0], "isNumber": r[1], "title": r[2], "committee": r[3]} for r in cross_refs],
        "internationalReferences": [{"number": r[0], "standard": r[1]} for r in intl_refs],
        "referredBy": [{"number": r[0], "isNumber": r[1], "title": r[2], "committee": r[3]} for r in ref_by],
        "clauses": [{"clauseNumber": c[0], "title": c[1], "content": c[2], "isMandatory": bool(c[3])} for c in clauses],
        "qco": {
            "qcoId": qco[0],
            "title": qco[1],
            "product": qco[2],
            "scope": qco[3],
            "effectiveDate": qco[4],
            "status": qco[5],
            "exemptions": json.loads(qco[6]) if qco[6] else [],
            "requirements": json.loads(qco[7]) if qco[7] else [],
            "sourceUrl": qco[8],
            "sourceType": qco[9]
        } if qco else None
    }

    out_file = os.path.join(DETAILS_DIR, f"{slug}.json")
    with open(out_file, "w", encoding="utf-8") as f_out:
        json.dump(detail_obj, f_out, indent=2)

    # Also save by internal_id
    id_file = os.path.join(DETAILS_DIR, f"is-{iid}.json")
    with open(id_file, "w", encoding="utf-8") as f_out:
        json.dump(detail_obj, f_out, indent=2)

print(f"Generated detail files in {DETAILS_DIR}.")

conn.close()
print("Ingestion complete successfully!")
