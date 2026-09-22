"""
M7: Database & Curated Taxonomy / Product Mapping Repository
Phase 3.3 Data Engineering: Expanded to comprehensive statutory Indian Standards catalog.
Phase 5.2 Model 2 Interface: Unified matchProductToStandard function with AWAITING_TRAINED_MODEL hook.
"""
import os
import re
import sqlite3
from typing import List, Dict, Any, Optional

# Comprehensive Curated Indian Standards Catalog Database (Phase 3.3)
SEEDED_RECORDS = [
    # ── Electrical & Appliances (ISI Scheme 1 / CRS Scheme 2) ────────────────
    {
        "id": "IS 1293:2019",
        "standard_number": "IS 1293:2019",
        "title": "Plugs and Socket-Outlets of Rated Voltage up to and including 250 Volts and Rated Current up to and including 16 Amperes",
        "category": "electronics",
        "subcategory": "led_lighting,other_electronics,appliances",
        "keywords": "plug,socket,switch,outlet,pin,electrical,wiring,lighting,250v,16a,wall socket",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 3854:1997",
        "standard_number": "IS 3854:1997",
        "title": "Switches for Domestic and Similar Fixed Electrical Installations",
        "category": "electronics",
        "subcategory": "other_electronics,electrical",
        "keywords": "switch,switches,electrical,toggle,modular,domestic,wall switch,piano switch",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 16046 (Part 1):2018",
        "standard_number": "IS 16046 (Part 1):2018",
        "title": "Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes (Nickel Systems)",
        "category": "electronics",
        "subcategory": "batteries,cells,portable",
        "keywords": "battery,batteries,cell,cells,lithium,nickel,accumulator,portable,rechargeable,nickel cadmium",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },
    {
        "id": "IS 16046 (Part 2):2018",
        "standard_number": "IS 16046 (Part 2):2018",
        "title": "Secondary Cells and Batteries Containing Alkaline - Lithium Systems (Portable)",
        "category": "electronics",
        "subcategory": "batteries,lithium,power_banks",
        "keywords": "lithium ion,li-ion,lithium polymer,power bank,cell,battery pack,mobile battery,laptop battery",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },
    {
        "id": "IS 13252 (Part 1):2010",
        "standard_number": "IS 13252 (Part 1):2010",
        "title": "Information Technology Equipment - Safety (General Requirements)",
        "category": "electronics",
        "subcategory": "laptops,printers,scanners,pos_terminals",
        "keywords": "it equipment,laptop,computer,server,printer,scanner,pos terminal,adapter,smps,power supply",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },
    {
        "id": "IS 616:2017",
        "standard_number": "IS 616:2017",
        "title": "Audio, Video and Similar Electronic Apparatus - Safety Requirements",
        "category": "electronics",
        "subcategory": "television,audio,amplifiers",
        "keywords": "television,tv,led tv,smart tv,speaker,amplifier,soundbar,audio system,dvd",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },
    {
        "id": "IS 302 (Part 2/Sec 3):2007",
        "standard_number": "IS 302 (Part 2/Sec 3):2007",
        "title": "Safety of Household and Similar Electrical Appliances: Electric Irons",
        "category": "electronics",
        "subcategory": "appliances,home",
        "keywords": "electric iron,steam iron,dry iron,clothing iron,laundry appliance",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 10322 (Part 5/Sec 1):2012",
        "standard_number": "IS 10322 (Part 5/Sec 1):2012",
        "title": "Luminaires: Particular Requirements - Fixed General Purpose Luminaires (LED/Lighting)",
        "category": "electronics",
        "subcategory": "lighting,led",
        "keywords": "led bulb,led luminaire,downlight,panel light,flood light,street light,cfl",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },

    # ── Cement & Construction Materials (ISI Scheme 1) ───────────────────────
    {
        "id": "IS 269:2015",
        "standard_number": "IS 269:2015",
        "title": "Ordinary Portland Cement - Specification (33, 43, and 53 Grades)",
        "category": "cement",
        "subcategory": "building_materials",
        "keywords": "cement,portland,clinker,concrete,mortar,construction,33 grade,43 grade,53 grade,opc",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 1489 (Part 1):2015",
        "standard_number": "IS 1489 (Part 1):2015",
        "title": "Portland Pozzolana Cement - Specification (Fly Ash Based)",
        "category": "cement",
        "subcategory": "building_materials,pozzolana",
        "keywords": "ppc,pozzolana cement,fly ash cement,portland pozzolana,green cement,construction",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 455:2015",
        "standard_number": "IS 455:2015",
        "title": "Portland Slag Cement - Specification",
        "category": "cement",
        "subcategory": "building_materials,slag",
        "keywords": "psc,slag cement,blast furnace slag,marine construction,durable cement",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },

    # ── Steel & Metal Products (ISI Scheme 1) ─────────────────────────────────
    {
        "id": "IS 1786:2008",
        "standard_number": "IS 1786:2008",
        "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
        "category": "steel",
        "subcategory": "structural,rebar",
        "keywords": "steel,tmt,rebar,iron,bars,wires,reinforcement,fe500,fe550,fe500d,fe550d,fe600",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 2062:2011",
        "standard_number": "IS 2062:2011",
        "title": "Hot Rolled Medium and High Tensile Structural Steel",
        "category": "steel",
        "subcategory": "structural_sections,plates",
        "keywords": "structural steel,steel angles,channels,beams,girders,plates,e250,e350,e410,fabrication",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 1161:2014",
        "standard_number": "IS 1161:2014",
        "title": "Steel Tubes for Structural Purposes",
        "category": "steel",
        "subcategory": "pipes,tubes",
        "keywords": "steel pipes,structural hollow section,rhs,shs,circular hollow,tubing,scaffolding",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },

    # ── Water, Food & Beverages (ISI Scheme 1) ───────────────────────────────
    {
        "id": "IS 10500:2012",
        "standard_number": "IS 10500:2012",
        "title": "Drinking Water - Specification",
        "category": "food-processing",
        "subcategory": "water,potable,drinking_water,mineral_water",
        "keywords": "water,drinking water,potable water,packaged drinking water,natural mineral water,mineral drinking water,packaged natural mineral drinking water,tap water,municipal water,tds,ph,hardness",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 14543:2004",
        "standard_number": "IS 14543:2004",
        "title": "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
        "category": "food-processing",
        "subcategory": "packaged_water,bottling",
        "keywords": "packaged drinking water,bottled water,20 litre jar,ro water,water bottle",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 13428:2005",
        "standard_number": "IS 13428:2005",
        "title": "Packaged Natural Mineral Water - Specification",
        "category": "food-processing",
        "subcategory": "mineral_water,spring_water",
        "keywords": "natural mineral water,spring water,artesian water,himalayan water,bottled mineral water",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 1165:2002",
        "standard_number": "IS 1165:2002",
        "title": "Milk Powder - Specification",
        "category": "food-processing",
        "subcategory": "dairy",
        "keywords": "milk powder,dairy,skimmed milk powder,smp,infant nutrition,dairy whitener",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },

    # ── Helmets & Automotive Safety (ISI Scheme 1) ───────────────────────────
    {
        "id": "IS 4151:2015",
        "standard_number": "IS 4151:2015",
        "title": "Protective Helmets for Two Wheeler Riders - Specification",
        "category": "automotive",
        "subcategory": "safety_helmets,protective_gear",
        "keywords": "helmet,two wheeler helmet,motorcycle helmet,protective headgear,rider helmet,full face",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 2925:1984",
        "standard_number": "IS 2925:1984",
        "title": "Industrial Safety Helmets - Specification",
        "category": "safety",
        "subcategory": "industrial_safety,ppe",
        "keywords": "hard hat,industrial helmet,construction helmet,ppe,safety hat,workplace safety",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },

    # ── Toys & Child Safety (ISI Scheme 1 / QCO 2020) ────────────────────────
    {
        "id": "IS 9873 (Part 1):2019",
        "standard_number": "IS 9873 (Part 1):2019",
        "title": "Safety of Toys: Mechanical and Physical Properties",
        "category": "toys",
        "subcategory": "children_toys,plastic_toys",
        "keywords": "toys,plastic toys,soft toys,dolls,action figures,child safety,choking hazard,wooden toys",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 15644:2006",
        "standard_number": "IS 15644:2006",
        "title": "Safety of Electric Toys",
        "category": "toys",
        "subcategory": "electric_toys,rc_cars",
        "keywords": "electric toys,battery operated toys,remote control car,electronic games,drones for kids",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },

    # ── Solar & Renewable Energy (CRS Scheme 2 / MNRE) ───────────────────────
    {
        "id": "IS 14286:2010",
        "standard_number": "IS 14286:2010",
        "title": "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules - Design Qualification and Type Approval",
        "category": "renewable-energy",
        "subcategory": "solar_panels,pv_modules",
        "keywords": "solar panel,solar module,pv module,photovoltaic,solar cell,crystalline silicon,solar power",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },
    {
        "id": "IS 16221 (Part 2):2015",
        "standard_number": "IS 16221 (Part 2):2015",
        "title": "Safety of Power Converters for Use in Photovoltaic Power Systems (Solar Inverters)",
        "category": "renewable-energy",
        "subcategory": "solar_inverters",
        "keywords": "solar inverter,power converter,on grid inverter,hybrid solar inverter,micro inverter",
        "scheme": "CRS_SCHEME_2",
        "mandatory_qco": True
    },

    # ── Chemicals & Polymers ──────────────────────────────────────────────────
    {
        "id": "IS 517:2020",
        "standard_number": "IS 517:2020",
        "title": "Methanol (Methyl Alcohol) - Specification",
        "category": "chemicals",
        "subcategory": "industrial_chemicals,solvents",
        "keywords": "methanol,methyl alcohol,wood alcohol,chemical feedstock,solvent",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    },
    {
        "id": "IS 14534:1998",
        "standard_number": "IS 14534:1998",
        "title": "Guidelines for Recovery and Recycling of Plastics",
        "category": "chemicals",
        "subcategory": "polymers,recycled_plastic",
        "keywords": "recycled plastic,pet recycling,polymer recovery,hdpe,plastic granules,circular economy",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": True
    }
]


class TaxonomyRepository:
    def __init__(self):
        self.conn = sqlite3.connect(":memory:", check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._init_db()

    def _init_db(self):
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS product_standards (
                id TEXT PRIMARY KEY,
                standard_number TEXT,
                title TEXT,
                category TEXT,
                subcategory TEXT,
                keywords TEXT,
                scheme TEXT,
                mandatory_qco BOOLEAN
            )
        """)
        for item in SEEDED_RECORDS:
            cursor.execute("""
                INSERT OR REPLACE INTO product_standards 
                (id, standard_number, title, category, subcategory, keywords, scheme, mandatory_qco)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item["id"], item["standard_number"], item["title"],
                item["category"], item["subcategory"], item["keywords"],
                item["scheme"], item["mandatory_qco"]
            ))
        self.conn.commit()

    def find_matches(self, search_tokens: List[str], category_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        cursor = self.conn.cursor()
        query = "SELECT * FROM product_standards"
        params = []
        if category_filter:
            query += " WHERE category LIKE ?"
            params.append(f"%{category_filter.lower()}%")
        cursor.execute(query, params)
        rows = cursor.fetchall()

        results = []
        for r in rows:
            record = dict(r)
            title_clean = re.sub(r'\(other than [^)]+\)', '', record['title'], flags=re.I)
            combined_text = f"{title_clean} {record['keywords']} {record['category']} {record['subcategory']}".lower()
            
            # Score based on token overlap with title emphasis
            score = 0.0
            for token in search_tokens:
                if len(token) < 3:
                    continue
                if token in title_clean.lower():
                    score += 0.45
                elif token in combined_text:
                    score += 0.35
            
            if score > 0.0 or not search_tokens:
                base_score = min(0.98, max(0.40, score))
                results.append({
                    "id": record["id"],
                    "score": round(base_score, 2),
                    "title": record["title"],
                    "standard_number": record["standard_number"],
                    "category": record["category"].upper(),
                    "scheme": record["scheme"],
                    "mandatory_qco": bool(record["mandatory_qco"])
                })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results


# Global taxonomy repo singleton
_repo = TaxonomyRepository()


# ==============================================================================
# Phase 5.2 — Model 2 Interface: Product -> Standard Classifier
# ==============================================================================
# AWAITING_TRAINED_MODEL: Model 2 (Product->Standard bi-encoder/classifier)
# Config flag: PRODUCT_CLASSIFIER_MODE=rules|trained-model (defaults to 'rules')
def match_product_to_standard(description: str, category_hint: Optional[str] = None) -> Dict[str, Any]:
    """
    Unified entrypoint for Product->Standard matching.
    Consolidates call sites from D9 Wizard, C1 QCO engine, and C21 Product Classification Assistant.
    """
    mode = os.getenv("PRODUCT_CLASSIFIER_MODE", "rules")

    if mode == "trained-model":
        # AWAITING_TRAINED_MODEL: Bi-encoder cosine similarity matching endpoint hook
        # Contract: { standard: str, title: str, confidence: float, alternates: list, mode: str }
        pass

    # Interim rule-based implementation backed by expanded statutory taxonomy
    tokens = [t.strip().lower() for t in description.replace('-', ' ').replace('/', ' ').split() if len(t.strip()) > 2]
    matches = _repo.find_matches(tokens, category_hint)

    if matches:
        top = matches[0]
        alternates = matches[1:5]
        return {
            "standard_number": top["standard_number"],
            "title": top["title"],
            "scheme": top["scheme"],
            "mandatory_qco": top["mandatory_qco"],
            "confidence": top["score"],
            "alternates": alternates,
            "mode": mode,
            "match_count": len(matches)
        }

    return {
        "standard_number": None,
        "title": "No confident statutory standard match found in catalog",
        "scheme": "ISI_SCHEME_1",
        "mandatory_qco": False,
        "confidence": 0.0,
        "alternates": [],
        "mode": mode,
        "match_count": 0
    }
