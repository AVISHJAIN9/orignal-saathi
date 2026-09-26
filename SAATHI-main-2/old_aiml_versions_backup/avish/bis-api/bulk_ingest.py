import json
import os

# Comprehensive statutory catalog covering mandatory QCO domains
EXPANDED_STANDARDS = [
    # --- CED: Civil Engineering & Cement ---
    {"is_number": "IS 269", "product_name": "Ordinary Portland Cement 33 Grade", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "Specifications for 33 grade ordinary portland cement for general concrete work."},
    {"is_number": "IS 8112", "product_name": "Ordinary Portland Cement 43 Grade", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "Physical and chemical requirements for 43 grade ordinary portland cement."},
    {"is_number": "IS 12269", "product_name": "Ordinary Portland Cement 53 Grade", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "High strength concrete construction and prestressed concrete applications."},
    {"is_number": "IS 1489 Part 1", "product_name": "Portland Pozzolana Cement (Fly-ash based)", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "Fly ash based pozzolana cement for masonry and plastering."},
    {"is_number": "IS 1489 Part 2", "product_name": "Portland Pozzolana Cement (Calcined clay based)", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "Calcined clay based pozzolana cement."},
    {"is_number": "IS 455", "product_name": "Portland Slag Cement", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "Portland slag cement produced by grinding clinker and granulated blast furnace slag."},
    {"is_number": "IS 8041", "product_name": "Rapid Hardening Portland Cement", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "High early strength cement specifications."},
    {"is_number": "IS 12330", "product_name": "Sulphate Resisting Portland Cement", "department": "DPIIT", "qco": "Cement (Quality Control) Order", "scope": "Concrete exposed to sulphate-bearing soils and seawater."},

    # --- MTD: Metallurgical & Structural Steel ---
    {"is_number": "IS 1786", "product_name": "High Strength Deformed Steel Bars (TMT Rebars)", "department": "Ministry of Steel", "qco": "Steel and Steel Products QCO", "scope": "Thermo-mechanically treated rebars for reinforced concrete."},
    {"is_number": "IS 2062", "product_name": "Hot Rolled Medium and High Tensile Structural Steel", "department": "Ministry of Steel", "qco": "Steel and Steel Products QCO", "scope": "Structural steel plates, sections, and flats for bridges and buildings."},
    {"is_number": "IS 1161", "product_name": "Steel Tubes for Structural Purposes", "department": "Ministry of Steel", "qco": "Steel and Steel Products QCO", "scope": "Seamless and welded tubular sections for infrastructure."},
    {"is_number": "IS 1239 Part 1", "product_name": "Mild Steel Tubes and Tubulars (Water/Gas pipes)", "department": "Ministry of Steel", "qco": "Steel and Steel Products QCO", "scope": "Galvanized and plain carbon steel pipes for plumbing and conveyance."},
    {"is_number": "IS 2830", "product_name": "Carbon Steel Cast Billet Ingots and Billets", "department": "Ministry of Steel", "qco": "Steel and Steel Products QCO", "scope": "Raw feed billets for re-rolling into concrete reinforcement bars."},
    {"is_number": "IS 15500", "product_name": "Wrought Aluminium Utensils", "department": "DPIIT", "qco": "Aluminium Utensils QCO", "scope": "Safety, chemical composition, and non-toxicity of cookware."},

    # --- ETD: Electrotechnical, Wiring, Electronics ---
    {"is_number": "IS 694", "product_name": "PVC Insulated Cables up to 1100V", "department": "DPIIT", "qco": "Electrical Wires and Cables QCO", "scope": "Domestic and industrial building wiring and flame-retardant electrical cables."},
    {"is_number": "IS 7098 Part 1", "product_name": "XLPE Insulated Cables up to 1.1 kV", "department": "DPIIT", "qco": "Electrical Wires and Cables QCO", "scope": "Cross-linked polyethylene insulated power distribution cables."},
    {"is_number": "IS 302 Part 1", "product_name": "Safety of Household Electrical Appliances - General", "department": "DPIIT", "qco": "Electrical Appliances QCO", "scope": "Electric shock, heating, leakage current, and insulation requirements."},
    {"is_number": "IS 302 Part 2 Sec 3", "product_name": "Safety of Electric Irons", "department": "DPIIT", "qco": "Electrical Appliances QCO", "scope": "Temperature limiters and thermostat cut-offs for domestic irons."},
    {"is_number": "IS 302 Part 2 Sec 15", "product_name": "Safety of Appliances for Heating Liquids (Kettles)", "department": "DPIIT", "qco": "Electrical Appliances QCO", "scope": "Boil-dry safety and thermal cutouts for liquid heaters."},
    {"is_number": "IS 16046 Part 1", "product_name": "Secondary Nickel Cells and Batteries", "department": "Electronics & IT", "qco": "MeitY Compulsory Registration Scheme", "scope": "Rechargeable nickel battery packs for portable devices."},
    {"is_number": "IS 16046 Part 2", "product_name": "Secondary Lithium Cells and Battery Packs", "department": "Electronics & IT", "qco": "MeitY Compulsory Registration Scheme", "scope": "Safety of pouch and cylindrical lithium-ion battery modules."},
    {"is_number": "IS 616", "product_name": "Audio, Video and Similar Electronic Apparatus", "department": "Electronics & IT", "qco": "MeitY Compulsory Registration Scheme", "scope": "Dielectric strength and radiation shielding for commercial displays."},

    # --- CMD: Chemicals & Petrochemicals ---
    {"is_number": "IS 12795", "product_name": "Linear Alkyl Benzene (LAB)", "department": "Chemicals & Petrochemicals", "qco": "Chemicals and Petrochemicals QCO", "scope": "Raw surfactant feed for synthetic detergent production."},
    {"is_number": "IS 517", "product_name": "Methanol (Methyl Alcohol)", "department": "Chemicals & Petrochemicals", "qco": "Chemicals QCO", "scope": "Chemical purity and moisture restrictions for industrial alcohol."},
    {"is_number": "IS 170", "product_name": "Acetone", "department": "Chemicals & Petrochemicals", "qco": "Chemicals QCO", "scope": "Industrial solvent specifications and non-volatile matter limits."},
    {"is_number": "IS 2833", "product_name": "Aniline", "department": "Chemicals & Petrochemicals", "qco": "Chemicals QCO", "scope": "Dyestuff and pharmaceutical intermediate standard."},
    {"is_number": "IS 1011", "product_name": "Caustic Soda (Sodium Hydroxide)", "department": "Chemicals & Petrochemicals", "qco": "Caustic Soda QCO", "scope": "Pure and technical grade caustic flakes, lye, and solids."},

    # --- TXD: Textiles & Technical Geotextiles ---
    {"is_number": "IS 15852", "product_name": "Cotton Drill Fabrics for Industrial Uniforms", "department": "Ministry of Textiles", "qco": "Textiles QCO", "scope": "Tear strength, yarn count, and shrinkage limits for workwear."},
    {"is_number": "IS 14428", "product_name": "Geotextiles for Subgrade Stabilization", "department": "Ministry of Textiles", "qco": "Geo-textiles QCO", "scope": "Tensile puncture strength for road sub-bases and rail tracks."},
    {"is_number": "IS 16654", "product_name": "High Density Polyethylene (HDPE) Geogrids", "department": "Ministry of Textiles", "qco": "Geo-textiles QCO", "scope": "Soil reinforcement geogrids for reinforced earth walls."},
    {"is_number": "IS 17373", "product_name": "Silk Crepe and Georgette Fabrics", "department": "Ministry of Textiles", "qco": "Silk Textiles Order", "scope": "Pure mulberry silk standards and chemical finishing safety."},

    # --- MED & FAD: Mechanical, Toys & Food Packaging ---
    {"is_number": "IS 9873 Part 1", "product_name": "Safety of Toys - Mechanical and Physical Properties", "department": "DPIIT", "qco": "Toys (Quality Control) Order", "scope": "Sharp edges, choking hazards, and kinetic energy of toy projectiles."},
    {"is_number": "IS 9873 Part 3", "product_name": "Safety of Toys - Migration of Certain Elements", "department": "DPIIT", "qco": "Toys (Quality Control) Order", "scope": "Heavy metal release thresholds (lead, cadmium, arsenic, mercury)."},
    {"is_number": "IS 14625", "product_name": "Polyethylene Pouches for Packaging of Drinking Water", "department": "DPIIT", "qco": "Packaging Materials QCO", "scope": "Non-toxic food-grade film for potable water storage."},
    {"is_number": "IS 14543", "product_name": "Packaged Drinking Water (Other than Natural Mineral Water)", "department": "FSSAI / BIS", "qco": "Packaged Water QCO", "scope": "Microbiological safety, total dissolved solids (TDS), and ozone levels."}
]

# Load master corpus and merge
corpus_file = "model2_corpus.json"
existing_corpus = []
if os.path.exists(corpus_file):
    with open(corpus_file, "r") as f:
        existing_corpus = json.load(f)

seen_is = {d["is_number"] for d in existing_corpus}
added = 0

for item in EXPANDED_STANDARDS:
    if item["is_number"] not in seen_is:
        entry = {
            "is_number": item["is_number"],
            "product_name": item["product_name"],
            "text": f"{item['is_number']}: {item['product_name']} - {item['scope']} Mandated under {item['qco']} ({item['department']}).",
            "department": item["department"],
            "source_url": f"https://standards.bis.gov.in/search_standard/{item['is_number'].replace(' ', '-').lower()}"
        }
        existing_corpus.append(entry)
        seen_is.add(item["is_number"])
        added += 1

with open(corpus_file, "w") as f:
    json.dump(existing_corpus, f, indent=2)

print(f"Bulk Ingestion Complete: Added {added} new standards. Total Master Corpus Size: {len(existing_corpus)} standards.")
