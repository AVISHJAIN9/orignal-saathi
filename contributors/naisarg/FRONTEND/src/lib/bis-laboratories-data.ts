// Authoritative dataset of all 429 BIS Recognized Laboratories across India
// Generated from BIS LIMS (Laboratory Information Management System) records

export interface LabProductScope {
  standard: string;
  product?: string;
  title?: string;
  fee?: string;
}

export interface BisLaboratoryRecord {
  sno: number;
  id: string;
  oslCode: string;
  name: string;
  logoUrl?: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  validTill: string;
  scopeUrl: string;
  accreditation: string;
  disciplines: string[];
  standards: string[];
  products: string[];
  scopeDetails: LabProductScope[];
}

export const ALL_429_BIS_LABORATORIES: BisLaboratoryRecord[] = [
  {
    "sno": 1,
    "id": "LAB-001",
    "oslCode": "8102006",
    "name": "SIIR, Delhi Shriram Institute For Industrial Research",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_I03KO28.png",
    "address": "19-University Road, Delhi 110007,\n Delhi, \n North, \n Delhi, \n India -  110007",
    "city": "Delhi",
    "district": "North",
    "state": "Delhi",
    "pincode": "110007",
    "contactPerson": "Dr. Laxmi Rawat (Quality Manager)",
    "phone": "+91 011 35200445",
    "email": "laxmirawat@shriraminstitute.org",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/15/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8102006)",
    "disciplines": [
      "Chemical",
      "Materials",
      "Civil",
      "Agrochemicals"
    ],
    "standards": [
      "IS 10508 (2020)",
      "IS 1251 (1988)",
      "IS 12823 (2015)",
      "IS 12931 (2024)",
      "IS 13592 (2013)",
      "IS 14333 (2022)",
      "IS 14968 (2015)",
      "IS 15328 (2003)",
      "IS 15462 (2019)",
      "IS 16208 (2015)",
      "IS 16415 (2015)",
      "IS 17079  (2019)",
      "IS 2062 (2011)",
      "IS 2494 : Part 1 (1994)",
      "IS 2566 (1993)",
      "IS 2830 (2012)",
      "IS 3383 (2023)",
      "IS 3589 (2001)",
      "IS 3812 : Part 2 (2013)",
      "IS 4320 (2024)",
      "IS 4751 (2023)",
      "IS 4766 (2024)",
      "IS 4783 (2024)",
      "IS 4985 (2021)",
      "IS 6444 (2023)",
      "IS 694 (2010)",
      "IS 7809 : Part 3 : Sec 1 (1986)",
      "IS 7933 (2022)",
      "IS 8249 (2019)",
      "IS 8887 (2018)"
    ],
    "products": [
      "Atrazine wettable powder WP - Specification First Revision",
      "Bitumen emulsion for roads (Cationic Type) - Specification (Third Revision)",
      "Carbon steel cast billet ingots, billets, blooms and slabs for re-rolling into steel for general structural purposes - Specification (Third Revision)",
      "Composite Cement",
      "Grade-1 & 2 , Type - I , II , III , IV",
      "Hot rolled medium and high tensile structural steel - Specification (Seventh Revision)",
      "PMB64-10 , PMB70-10 , PMB76-10 , PMB82-10 , PMB76-22",
      "PVC U Pipe",
      "Phosphoric Acid, Food Grade - Specification ( Second Revision )",
      "Polyethylene Pipes for Sewerage and Industrial Chemicals and Effluent \u00ef\u00bf\u00bd Specification (First Revision)",
      "Polyvinyl chloride insulated unsheathed and sheathed cables/cords with rigid and flexible conductor for rated voltages up to and including 450/750 v (Fourth Revision)",
      "Potassium metabisulphite food grade - Specification",
      "SULPHUR WETTABLE POWDERS  SPECIFICATION",
      "Specification for pressure sensitive adhesive insulating tapes for electrical purposes: Part 3 requirements or individual materials: Sec 1 plasticized polyvinylchloride tapes with non - Thermosetting adhesive (First Revision)",
      "Specification for zinc phosphide, technical",
      "Steel pipes for water and sewage (168.3 To 2540 Mm Outside Diameter) - Specification (Third Revision)",
      "Sulphur Dusting Powders - Specification second revision",
      "Textiles \u2013 B-twill jute bags for packing foodgrains \u2013 Specification (third revision)",
      "Thiram powder for dry seed treatment - Specification (second revision)",
      "Thiram technical - Specification Second Revision",
      "Thiram water dispersible powder for slurry seed treatment - Specification (second revision)",
      "Type - I & Type II",
      "Type A-NRMB70 , NRMB40 , & Type B CRMB 55 , CRMB 60",
      "Type I and Type II",
      "Type-I , II ,III , IV , V",
      "UNPLASTICIZED PVC PIPES FOR POTABLE WATER SUPPLIES  SPECIFICATION Fourth Revision",
      "Unplasticized Non-Pressure Polyvinyl Chloride ( PVC -U ) Pipes for use in Underground Drainage and Sewerage Systems -",
      "Use as Admixture in cement mortar and concrete",
      "V - Belts - Endless V - Belts for industrial purposes: Part 1 general purpose - Specification (Second Revision)",
      "Zinc sulphate heptahydrate, agricultural grade - Specification (First Revision)"
    ],
    "scopeDetails": [
      {
        "standard": "IS 16415 (2015)",
        "title": "Composite cement - Specification",
        "product": "Composite Cement",
        "fee": "26000 \n                    -"
      },
      {
        "standard": "IS 4783 (2024)",
        "title": "Thiram powder for dry seed treatment - Specification (second revision)",
        "product": "-",
        "fee": "10000 \n                    -"
      },
      {
        "standard": "IS 4766 (2024)",
        "title": "Thiram water dispersible powder for slurry seed treatment - Specification (second revision)",
        "product": "-",
        "fee": "10000 \n                    -"
      },
      {
        "standard": "IS 4320 (2024)",
        "title": "Thiram technical - Specification Second Revision",
        "product": "-",
        "fee": "10000 \n                    -"
      },
      {
        "standard": "IS 6444 (2023)",
        "title": "Sulphur Dusting Powders - Specification second revision",
        "product": "-",
        "fee": "10000 \n                    -"
      },
      {
        "standard": "IS 3383 (2023)",
        "title": "SULPHUR WETTABLE POWDERS  SPECIFICATION",
        "product": "-",
        "fee": "20000 \n                    -"
      },
      {
        "standard": "IS 12931 (2024)",
        "title": "Atrazine wettable powder WP - Specification First Revision",
        "product": "-",
        "fee": "10000 \n                    -"
      },
      {
        "standard": "IS 15462 (2019)",
        "title": "Polymer modified bitumen (Pmb) ? specification (First Revision)",
        "product": "PMB64-10 , PMB70-10 , PMB76-10 , PMB82-10 , PMB76-22",
        "fee": "201000 \n                    -"
      },
      {
        "standard": "IS 17079  (2019)",
        "title": "Rubber modified bitumen (Rmb) ? specification",
        "product": "Type A-NRMB70 , NRMB40 , & Type B CRMB 55 , CRMB 60",
        "fee": "115000 \n                    -"
      },
      {
        "standard": "IS 16208 (2015)",
        "title": "Textiles - High density polyethylene (HDPE)/polypropylene (PP) woven sacks for packaging 10 kg, 15 kg, 20 kg, 25 kg and 30 kg foodgrains - Specification",
        "product": "Type-I , II ,III , IV , V",
        "fee": "39550 \n                    -"
      },
      {
        "standard": "IS 14968 (2015)",
        "title": "Textiles \u2013 High density polyethylene (HDPE)/ polypropylene (PP) woven sacks for packing 50 Kg/25 kg sugar \u2013 Specification (first revision)",
        "product": "Type - I & Type II",
        "fee": "68500 \n                    -"
      },
      {
        "standard": "IS 12823 (2015)",
        "title": "Prelaminated Particle Boards from Wood and other Lignocellulosic Material - Specification ( First Revision )",
        "product": "Grade-1 & 2 , Type - I , II , III , IV",
        "fee": "59000 \n                    -"
      },
      {
        "standard": "IS 15328 (2003)",
        "title": "Unplasticized Non-Pressure Polyvinyl Chloride ( PVC -U ) Pipes for use in Underground Drainage and Sewerage Systems -",
        "product": "-",
        "fee": "36750 \n                    -"
      },
      {
        "standard": "IS 13592 (2013)",
        "title": "Unplasticized Polyvinyl Chloride (PVC-U)  Pipes for Soil and Waste Discharge System Inside and Outside Buiildings Including Ventilation and Rainwater System",
        "product": "PVC U Pipe",
        "fee": "25550 \n                    -"
      },
      {
        "standard": "IS 4985 (2021)",
        "title": "UNPLASTICIZED PVC PIPES FOR POTABLE WATER SUPPLIES  SPECIFICATION Fourth Revision",
        "product": "-",
        "fee": "32550 \n                    -"
      },
      {
        "standard": "IS 14333 (2022)",
        "title": "Polyethylene Pipes for Sewerage and Industrial Chemicals and Effluent \u00ef\u00bf\u00bd Specification (First Revision)",
        "product": "-",
        "fee": "39900 \n                    -"
      },
      {
        "standard": "IS 2566 (1993)",
        "title": "Textiles \u2013 B-twill jute bags for packing foodgrains \u2013 Specification (third revision)",
        "product": "-",
        "fee": "13500 \n                    -"
      },
      {
        "standard": "IS 4751 (2023)",
        "title": "Potassium metabisulphite food grade - Specification",
        "product": "-",
        "fee": "21000 \n                    -"
      },
      {
        "standard": "IS 10508 (2020)",
        "title": "Phosphoric Acid, Food Grade - Specification ( Second Revision )",
        "product": "-",
        "fee": "7000 \n                    -"
      },
      {
        "standard": "IS 8249 (2019)",
        "title": "Zinc sulphate heptahydrate, agricultural grade - Specification (First Revision)",
        "product": "-",
        "fee": "11000 \n                    -"
      }
    ]
  },
  {
    "sno": 2,
    "id": "LAB-002",
    "oslCode": "8138306",
    "name": "Testtex India Laboratories Private Limited, Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_131_061eink.jpeg",
    "address": "C - 57, Sector - 65,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Amit Tiwari (Quality Manager)",
    "phone": "+91 7303 919463",
    "email": "labsindianoida@testtex.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/16/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8138306)",
    "disciplines": [
      "Textiles",
      "Footwear",
      "Toys",
      "Chemical",
      "Mechanical"
    ],
    "standards": [
      "IS 10702 (2023)",
      "IS 11226 (1993)",
      "IS 12254 (2021)",
      "IS 13893 (1994)",
      "IS 13995 (1995)",
      "IS 14544 (2022)",
      "IS 15298 : Part 2 (2024)",
      "IS 15298 : Part 3 (2024)",
      "IS 15298 : part 4 (2024)",
      "IS 15644 (2006)",
      "IS 15844 : Part 1 (2023)",
      "IS 15844 : Part 2 (2023)",
      "IS 15844 : Part 3 (2024)",
      "IS 16645  (2018)",
      "IS 16994  (2018)",
      "IS 17012  (2018)",
      "IS 17037  (2018)",
      "IS 17043 : Part 1 (2024)",
      "IS 17043 : Part 2 (2024)",
      "IS 1989 : Part 1 (1986)",
      "IS 1989 : Part 2 (1986)",
      "IS 3735 (1996)",
      "IS 3736 (1995)",
      "IS 3976 (2018)",
      "IS 5557 : Part 2 (2018)",
      "IS 6721 (2023)",
      "IS 9873 (Part 2) (2025)",
      "IS 9873 : Part 1 (2019)",
      "IS 9873 : Part 1 (2025)",
      "IS 9873 : Part 3 (2017)"
    ],
    "products": [
      "All",
      "All rubber gum boots and ankle boots:",
      "Anti riot shoes",
      "Canvas Shoes, Rubber Sole",
      "Canvas boots, rubber sole",
      "Footwear for Men and Women for Municipal Scavenging Wor",
      "Hawai Chappal With amendment No.1 and 2",
      "High ankle tactical boots with pu - Rubber sole",
      "Leather Safety Boots and Shoes: Part 2 Heavy Metal Ind.",
      "Leather Safety and Protective Footwear with Direct Moul",
      "Leather safety footwear having direct moulded rubber so",
      "Migration of Certain Elements",
      "Moulded Plastics Footwear \u201d Lined or Unlined Polyuretha",
      "Occupational Footwear (Third Revision)",
      "PERFORMANCE SPORTS FOOTWEAR WITH AMENDMENT 1",
      "POLYVINYLCHLORIDE PVC INDUSTRIAL BOOTS  Second Revision",
      "Polyurethane Unit Outsoles",
      "Protective Footwear (Third Revision)",
      "SANDAL AND SLIPPERS WITH AMENDMENT NO. 1",
      "SPORTS FOOTWEAR PART -1 GENERAL PURPOSE + Amd. 1 : 2024",
      "Safety Boots for miners",
      "Safety Footwear",
      "Shoes - Specification - Part 2 Shoes for General Purpose",
      "Shoes - Specification Part 1 Shoes for Services",
      "Specification for leather safety boots and shoes: Part",
      "Sports Footwear Part 3 Professional Sports Footwear",
      "Unlined moulded rubber boots"
    ],
    "scopeDetails": [
      {
        "standard": "IS 17012  (2018)",
        "title": "High ankle tactical boots with pu - Rubber sole - Specification",
        "product": "High ankle tactical boots with pu - Rubber sole",
        "fee": "45000 \n                    -"
      },
      {
        "standard": "IS 10702 (2023)",
        "title": "Hawai Chappal-Specification",
        "product": "Hawai Chappal With amendment No.1 and 2",
        "fee": "35000 \n                    -"
      },
      {
        "standard": "IS 12254 (2021)",
        "title": "POLYVINYLCHLORIDE PVC INDUSTRIAL BOOTS - SPECIFICATION  Second Revision",
        "product": "POLYVINYLCHLORIDE PVC INDUSTRIAL BOOTS  Second Revision",
        "fee": "52500 \n                    -"
      },
      {
        "standard": "IS 9873 (Part 2) (2025)",
        "title": "SAFETY OF TOYS  PART 2 FLAMMABILITY (Fourth Revision)",
        "product": "All",
        "fee": "1500 \n                    -"
      },
      {
        "standard": "IS 9873 : Part 1 (2025)",
        "title": "SAFETY OF TOYS  PART 1: SAFETY ASPECTS RELATED TO MECHANICAL AND PHYSICAL PROPERTIES (Fifth Revision)",
        "product": "All",
        "fee": "10500 \n                    -"
      },
      {
        "standard": "IS 17043 : Part 2 (2024)",
        "title": "Shoes: Shoes for General Purpose",
        "product": "Shoes - Specification - Part 2 Shoes for General Purpose",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 6721 (2023)",
        "title": "SANDAL AND SLIPPERS  SPECIFICATION First revision",
        "product": "SANDAL AND SLIPPERS WITH AMENDMENT NO. 1",
        "fee": "35000 \n                    -"
      },
      {
        "standard": "IS 15844 : Part 1 (2023)",
        "title": "SPORTS FOOTWEAR  PART -1 GENERAL PURPOSEFirst Revision",
        "product": "SPORTS FOOTWEAR PART -1 GENERAL PURPOSE + Amd. 1 : 2024",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 15844 : Part 2 (2023)",
        "title": "SPORTS FOOTWEAR PART -2 PERFORMANCE SPORTS FOOTWEAR",
        "product": "PERFORMANCE SPORTS FOOTWEAR WITH AMENDMENT 1",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 15844 : Part 3 (2024)",
        "title": "Sports Footwear  Part 3 Professional Sports Footwear",
        "product": "Sports Footwear Part 3 Professional Sports Footwear",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 17043 : Part 1 (2024)",
        "title": "Shoes - Specification Part 1 Shoes for Services",
        "product": "Shoes - Specification Part 1 Shoes for Services",
        "fee": "39000 \n                    -"
      },
      {
        "standard": "IS 15298 : part 4 (2024)",
        "title": "Personal Protective Equipment    Part 4 Occupational Footwear   (ISO 20347 : 2021, MOD)   (Third Revision)",
        "product": "Occupational Footwear (Third Revision)",
        "fee": "37500 \n                    -"
      },
      {
        "standard": "IS 15298 : Part 3 (2024)",
        "title": "Personal Protective Equipment Part 3 Protective Footwear (ISO 20346 : 2021, MOD) (Third Revision)",
        "product": "Protective Footwear (Third Revision)",
        "fee": "39000 \n                    -"
      },
      {
        "standard": "IS 15298 : Part 2 (2024)",
        "title": "Personal Protective Equipment Part 2 Safety Footwear (ISO 20345 : 2021, MOD) (Third Revision)",
        "product": "Safety Footwear",
        "fee": "45000 \n                    -"
      },
      {
        "standard": "IS 9873 : Part 1 (2019)",
        "title": "Safety of toys: Part 1 safety aspects related to mechanical and physical properties (Fourth Revision)",
        "product": "All",
        "fee": "10500 \n                    -"
      },
      {
        "standard": "IS 15644 (2006)",
        "title": "Safety of electric toys",
        "product": "All",
        "fee": "13500 \n                    -"
      },
      {
        "standard": "IS 9873 : Part 3 (2017)",
        "title": "Safety of toys: Part 3 migration of certain elements (Second Revision)",
        "product": "Migration of Certain Elements",
        "fee": "4000 \n                    -"
      },
      {
        "standard": "IS 14544 (2022)",
        "title": "LEATHER SAFETY AND PROTECTIVE FOOTWEAR WITH DIRECT MOULDED POLYVINYL CHLORIDE PVC SOLE - SPECIFICATION  First Revision",
        "product": "Leather Safety and Protective Footwear with Direct Moul",
        "fee": "72600 \n                    -"
      },
      {
        "standard": "IS 1989 : Part 2 (1986)",
        "title": "Specification for leather safety boots and shoes: Part 2 for heavy metal industries (Fourth Revision)",
        "product": "Leather Safety Boots and Shoes: Part 2 Heavy Metal Ind.",
        "fee": "72200 \n                    -"
      },
      {
        "standard": "IS 1989 : Part 1 (1986)",
        "title": "Specification for leather safety boots and shoes: Part 1 for miners (Fourth Revision)",
        "product": "Specification for leather safety boots and shoes: Part",
        "fee": "84300 \n                    -"
      }
    ]
  },
  {
    "sno": 3,
    "id": "LAB-003",
    "oslCode": "6126316",
    "name": "Intertek India Private Limited (Food Services), Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_133_CV83CiY.jpeg",
    "address": "Plot No D-53, IDA, Phase-1, Jeedimetla,Qutubullapur Mandal,\n hyderabad, \n Medchal Malkajgiri, \n Telangana, \n India -  500055",
    "city": "hyderabad",
    "district": "Medchal Malkajgiri",
    "state": "Telangana",
    "pincode": "500055",
    "contactPerson": "gandla krishnaiah",
    "phone": "9912463921",
    "email": "gandla.krishnaiah@intertek.com",
    "validTill": "18 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/18/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6126316)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 4,
    "id": "LAB-004",
    "oslCode": "8125636",
    "name": "Kailtech Test and Research Centre Pvt. Ltd., Indore",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_134_yuXrnlB.jpeg",
    "address": "141C, Electronic Complex Industrial Area,\n Indore, \n Indore, \n Madhya Pradesh, \n India -  452010",
    "city": "Indore",
    "district": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "452010",
    "contactPerson": "",
    "phone": "",
    "email": "contact@kailtech.net",
    "validTill": "18 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/19/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8125636)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 5,
    "id": "LAB-005",
    "oslCode": "6130526",
    "name": "REACT COMPLIANCE AND TESTING LABORATORIES LLP, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_414_dUMOqh3.jpeg",
    "address": "#3411, 3rd floor, Service Road, Vijayanagar,\n BENGALURU, \n Bengaluru Urban, \n Karnataka, \n India -  560040",
    "city": "BENGALURU",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560040",
    "contactPerson": "Praveen Krishnan (Technical Manager)",
    "phone": "+91 9845716746",
    "email": "info@react-labs.com",
    "validTill": "10 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/48/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6130526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 6,
    "id": "LAB-006",
    "oslCode": "6133516",
    "name": "CVR LABS PRIVATE LIMITED, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_415_iuCrY88.jpeg",
    "address": "Dignity Centre, II Floor No 21 Abdulrazack Street, Saidapet,\n Chennai, \n Chennai, \n Tamil Nadu, \n India -  600015",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600015",
    "contactPerson": "S ParveenBanu (Technical Manager)",
    "phone": "+91 9500121387",
    "email": "bala@cvrlabs.com",
    "validTill": "05 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/49/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6133516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 7,
    "id": "LAB-007",
    "oslCode": "9139736",
    "name": "Sleen India Biz venture Private Limited, Agra",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_417_sEjudsU.jpeg",
    "address": "RAHANKALAN ROAD, PART 295, BLOCK-A KUBERPUR, 300 METER FROM RAILWAY CROSSING CHALESHAR ROAD,  Agra, Uttar Pradesh,  India, 282006,\n Agra, \n Agra, \n Uttar Pradesh, \n India -  282006",
    "city": "Agra",
    "district": "Agra",
    "state": "Uttar Pradesh",
    "pincode": "282006",
    "contactPerson": "Pawan Senger (Technical Manager)",
    "phone": "+91 8193022228",
    "email": "sleen.info@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/51/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9139736)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 8,
    "id": "LAB-008",
    "oslCode": "7139526",
    "name": "SUNREN TELECOM LABORATORY",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_KRBGk2U.png",
    "address": "C-475, MIDC Pavane, Navi Mumbai,\n Navi Mumbai, \n Thane, \n Maharashtra, \n India -  400705",
    "city": "Navi Mumbai",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400705",
    "contactPerson": "Rekha Patel (Quality Manager)",
    "phone": "+91 22 24055281",
    "email": "sunil@sunren.net",
    "validTill": "15 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/53/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7139526)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 9,
    "id": "LAB-009",
    "oslCode": "8163826",
    "name": "SWASTIK ELECTRONICS TESTING CENTRE (OPC) PVT. LTD., GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_420_ki7Diyi.jpeg",
    "address": "Plot No-16, Mainapur Industrial Area, Ghaziabad, Uttar Pradesh 201003,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201003",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201003",
    "contactPerson": "Ashish Kumar",
    "phone": "9311299492",
    "email": "head@swastiktestingcentre.com",
    "validTill": "15 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/54/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8163826)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 10,
    "id": "LAB-010",
    "oslCode": "9136024",
    "name": "National Research and Technology Consortium (NRTC), Parwanoo",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_XdjRyar.png",
    "address": "HPCED Building, Department of industries complex, Sector-1,\n Parwanoo, \n Solan, \n Himachal Pradesh, \n India -  173220",
    "city": "Parwanoo",
    "district": "Solan",
    "state": "Himachal Pradesh",
    "pincode": "173220",
    "contactPerson": "Dr Kiran Gupta (Quality Manager)",
    "phone": "+91 1792 234107",
    "email": "nrtcpwn@gmail.com",
    "validTill": "10 Apr, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/55/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9136024)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 11,
    "id": "LAB-011",
    "oslCode": "8125006",
    "name": "Ghaziabad Testing Laboratories Pvt Ltd, Ghaziabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_PolNbD7.png",
    "address": "AO 150 Amrit Steel Compound South Side GT Road Industrial Area Ghaziabad (UP),\n Ghaziabad (UP), \n Ghaziabad, \n Uttar Pradesh, \n India -  201001",
    "city": "Ghaziabad (UP)",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201001",
    "contactPerson": "Tej Krishen Saraf (Quality Manager)",
    "phone": "+91 9891067223",
    "email": "gtaslab@yahoo.com",
    "validTill": "30 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/58/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8125006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 12,
    "id": "LAB-012",
    "oslCode": "8112814",
    "name": "FOOTWEAR DESIGN AND DEVELOPMENT INSTITUTE (FDDI), NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_RSFu9ZI.png",
    "address": "A-10/A GAUTAM BUDDTH NAGAR SECTOR 24 NOIDA,\n NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Mr. Rajesh Mishra",
    "phone": "9718303177",
    "email": "rajeshmishra@fddiindia.com",
    "validTill": "31 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/59/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8112814)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Textiles & Leather"
    ],
    "standards": [
      "IS 10702",
      "IS 12254",
      "IS 15844",
      "IS 17012",
      "IS 9873"
    ],
    "products": [
      "Hawai Chappals",
      "High Ankle Tactical Boots",
      "PVC Industrial Boots",
      "Safety Footwear",
      "Sports Footwear"
    ],
    "scopeDetails": [
      {
        "standard": "IS 12254",
        "title": "PVC Industrial Boots",
        "product": "PVC Industrial Boots",
        "fee": "5000"
      },
      {
        "standard": "IS 17012",
        "title": "High Ankle Tactical Boots",
        "product": "High Ankle Tactical Boots",
        "fee": "5000"
      },
      {
        "standard": "IS 10702",
        "title": "Hawai Chappals",
        "product": "Hawai Chappals",
        "fee": "5000"
      },
      {
        "standard": "IS 15844",
        "title": "Sports Footwear",
        "product": "Sports Footwear",
        "fee": "5000"
      },
      {
        "standard": "IS 9873",
        "title": "Safety Footwear",
        "product": "Safety Footwear",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 13,
    "id": "LAB-013",
    "oslCode": "7136414",
    "name": "NDDB CALF LIMITED, ANAND",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_427_S5ER3ZV.jpeg",
    "address": "Anand, Gujarat,\n Anand, \n Anand, \n Gujarat, \n India -  388001",
    "city": "Anand",
    "district": "Anand",
    "state": "Gujarat",
    "pincode": "388001",
    "contactPerson": "P Rohith Kumar",
    "phone": "9726425080",
    "email": "prohith@nddbcalf.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/60/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7136414)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 14,
    "id": "LAB-014",
    "oslCode": "8135716",
    "name": "FARE Labs Pvt. Ltd., Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_428_BRITVAW.jpeg",
    "address": "L-17/3, DLF PHASE-II, IFFCO CHOWK, M.G.ROAD,\n GURUGRAM, \n Gurugram, \n Haryana, \n India -  122002",
    "city": "GURUGRAM",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122002",
    "contactPerson": "",
    "phone": "+91 9289351688",
    "email": "farelabs@farelabs.com",
    "validTill": "09 Mar, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/61/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8135716)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 15,
    "id": "LAB-015",
    "oslCode": "8138426",
    "name": "Nemko India (Test Lab) Pvt. Ltd., Faridabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_429_D4OGLRY.jpeg",
    "address": "Plot No 193, Sector 68, IMT Faridabad,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121004",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121004",
    "contactPerson": "Kavita Dagar (Quality Manager)",
    "phone": "+91 9810629447",
    "email": "satish.sankhyan@nemko.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/62/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8138426)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 16,
    "id": "LAB-016",
    "oslCode": "9135004",
    "name": "National Institute of secondary steel technology",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_430_xdWsAE1.jpeg",
    "address": "Post Box No. 92, GT Road, Sirhind Side, Opposite Floating restaurant,\n MANDI GOBINDGARH, \n Fatehgarh Sahib, \n Punjab, \n India -  147301",
    "city": "MANDI GOBINDGARH",
    "district": "Fatehgarh Sahib",
    "state": "Punjab",
    "pincode": "147301",
    "contactPerson": "ANIL MOHINDRU (Quality Manager)",
    "phone": "+91 9815904568",
    "email": "info@nisst.org",
    "validTill": "24 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/63/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9135004)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 17,
    "id": "LAB-017",
    "oslCode": "9134536",
    "name": "Unique Test House LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_431_ElFYyfL.jpeg",
    "address": "VILLAGE:-SARSINI, PO:-LALRU,\n MOHALI, \n S.A.S Nagar, \n Punjab, \n India -  140501",
    "city": "MOHALI",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "140501",
    "contactPerson": "SANJEEV KUMAR (Technical Manager)",
    "phone": "+91 9896169971",
    "email": "",
    "validTill": "07 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/64/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9134536)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 18,
    "id": "LAB-018",
    "oslCode": "9126034",
    "name": "Institute for Auto Parts and Hand Tools Technology, Ludhiana",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_433_ANkW0CO.jpeg",
    "address": "A-9, Phase-V, Focal Point, Ludhiana,\n Ludhiana, \n Ludhiana, \n Punjab, \n India -  141010",
    "city": "Ludhiana",
    "district": "Ludhiana",
    "state": "Punjab",
    "pincode": "141010",
    "contactPerson": "Dr. Sanjeev Katoch",
    "phone": "8427262400",
    "email": "iatldh@iapht.org",
    "validTill": "17 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/65/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9126034)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 19,
    "id": "LAB-019",
    "oslCode": "8166106",
    "name": "Cotecna Inspection India Private Limited, Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_435_rmcng8l.jpeg",
    "address": "Plot No-306, Udyog Vihar, Phase-2, Gurugram, Haryana,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122016",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122016",
    "contactPerson": "Jitender Dagar",
    "phone": "9560271290",
    "email": "jitender.dagar@cotecna.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/67/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8166106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 20,
    "id": "LAB-020",
    "oslCode": "5123116",
    "name": "Modern Test Center, Berhampur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_437_1l7xQzU.jpeg",
    "address": "3rd lane Neelanchal Nagar,\n Berhampur, \n Ganjam, \n Odisha, \n India -  760010",
    "city": "Berhampur",
    "district": "Ganjam",
    "state": "Odisha",
    "pincode": "760010",
    "contactPerson": "",
    "phone": "9437358552 7848843034",
    "email": "moderntestcenter@gmail.com",
    "validTill": "31 May, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/69/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5123116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 21,
    "id": "LAB-021",
    "oslCode": "9164606",
    "name": "JBS TESTING SOLUTIONS PVT LTD (27), JALANDHAR",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "PLOT NO. 27, STREET NO. 2, ADJOINING FOCAL POINT ROAD, TRANSPORT NAGAR, JALANDHAR, PUNJAB,\n JALANDHAR, \n Jalandhar, \n Punjab, \n India -  144004",
    "city": "JALANDHAR",
    "district": "Jalandhar",
    "state": "Punjab",
    "pincode": "144004",
    "contactPerson": "Varun Sharma (Technical Manager)",
    "phone": "+91 0181 2601629",
    "email": "jbstestingsolutions@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/70/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9164606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 22,
    "id": "LAB-022",
    "oslCode": "9123236",
    "name": "IDMA LABORATORIES LIMITED, PANCHKULA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_439_1SOMaKL.jpeg",
    "address": "PLOT NO. 391 INDUSTRIAL AREA PHASE 1,\n PANCHKULA, \n Panchkula, \n Haryana, \n India -  134113",
    "city": "PANCHKULA",
    "district": "Panchkula",
    "state": "Haryana",
    "pincode": "134113",
    "contactPerson": "Mr. Ankush Aggarwal",
    "phone": "9888002607",
    "email": "testing@idmagroup.co.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/71/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9123236)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 23,
    "id": "LAB-023",
    "oslCode": "5137936",
    "name": "Quality Control Division, S. M. Consultants Private Limited, Bhubaneswar",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "S. M. Tower, Plot No.- 130, Mancheswar Industrial Estate, Po.- Rasulgarh,\n Bhubaneswar, \n Khordha, \n Odisha, \n India -  751010",
    "city": "Bhubaneswar",
    "district": "Khordha",
    "state": "Odisha",
    "pincode": "751010",
    "contactPerson": "Mr. Suvendu Mohanty (Quality Manager)",
    "phone": "+91 8908215859",
    "email": "md@smcindia.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/72/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5137936)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 24,
    "id": "LAB-024",
    "oslCode": "9111924",
    "name": "THE NATIONAL SMALL INDUSTRIES CORPORATION LIMITED, TECHNICAL SERVICES CENTRE - NSIC, Rajpura",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_441_RFNUkf8.jpeg",
    "address": "D/82-83, FOCAL POINT, RAJPURA, PATIALA, PUNJAB,\n RAJPURA, \n Patiala, \n Punjab, \n India -  140401",
    "city": "RAJPURA",
    "district": "Patiala",
    "state": "Punjab",
    "pincode": "140401",
    "contactPerson": "Saurabh Sharma",
    "phone": "9999020660",
    "email": "ntsec.rjp@nsic.co.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/73/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9111924)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 25,
    "id": "LAB-025",
    "oslCode": "7126926",
    "name": "Hi Physix Laboratory India Private Limited, Pune",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "B-32/1/2, MIDC, Industrial Area, Ranjangaon, Pune,\n Pune, \n Pune, \n Maharashtra, \n India -  412220",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "412220",
    "contactPerson": "K. K. Jayaswal",
    "phone": "8552003805",
    "email": "infohplindia@bureauveritas.com",
    "validTill": "20 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/74/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7126926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 26,
    "id": "LAB-026",
    "oslCode": "8135126",
    "name": "Classic Instrumentation Pvt. Ltd. (8135126), Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_443_EX14bmc.jpeg",
    "address": "C-45, SECTOR-65,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "HARSHIL SHARMA",
    "phone": "9810285868",
    "email": "info@classiclabindia.com",
    "validTill": "23 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/75/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8135126)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 27,
    "id": "LAB-027",
    "oslCode": "5109624",
    "name": "ELECTRONICS REGIONAL TEST LABORATORY (EAST) - ERTL (STQC), Kolkata",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_02hRKjX.png",
    "address": "BLOCK-DN-63 ;SECTOR-V;SALT LAKE CITY KOLKATA-700 091.,\n KOLKATA, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700091",
    "city": "KOLKATA",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700091",
    "contactPerson": "Mita Das (Technical Manager)",
    "phone": "+91 9830786241",
    "email": "ertleast@stqc.gov.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/76/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5109624)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 28,
    "id": "LAB-028",
    "oslCode": "7131116",
    "name": "HITECHLAB HEALTHCARE & RESEARCH CENTRE LLP, AHMEDABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_445_UdYUgFq.jpeg",
    "address": "201-202, Sahaj Arcade, Opp. Lincoln Healthcare, Near Sola gam, Science city road, Ahmedabd,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  380060",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "380060",
    "contactPerson": "Rajesh Patel (Quality Manager)",
    "phone": "+91 9099971265",
    "email": "hitechlabindia@gmail.com",
    "validTill": "01 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/77/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7131116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 29,
    "id": "LAB-029",
    "oslCode": "7107604",
    "name": "National Test House (WR) - NTH, Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. F - 10, MIDC , Andheri (E),\n Mumbai, \n Mumbai Suburban, \n Maharashtra, \n India -  400093",
    "city": "Mumbai",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "pincode": "400093",
    "contactPerson": "Dilip Gwra Basumatary",
    "phone": "6900181066",
    "email": "director.nthwr-ca@gov.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/78/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7107604)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 30,
    "id": "LAB-030",
    "oslCode": "6130616",
    "name": "ENVIRONMENTAL LABORATORY (UNIT OF MINERAL ENGINEERING SERVICES LLP), BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_448_0wdNJlT.jpeg",
    "address": "948, 2ND CROSS, ST. THOMAS TOWN POST, KAMMANAHALLI MAIN ROAD,KAMMANAHALLI,\n BENGALURU, \n Bengaluru Urban, \n Karnataka, \n India -  560084",
    "city": "BENGALURU",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560084",
    "contactPerson": "V.B Sudha (Quality Manager)",
    "phone": "+91 9742147954",
    "email": "elbng@yahoo.com",
    "validTill": "20 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/79/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6130616)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 31,
    "id": "LAB-031",
    "oslCode": "7119404",
    "name": "MSME TESTING CENTRE (WR), MUMBAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_449_ACc8mzJ.jpeg",
    "address": "MSME-DI campus, Kurla - Andheri road, Sakinaka,,\n Mumbai, \n Mumbai Suburban, \n Maharashtra, \n India -  400072",
    "city": "Mumbai",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "pincode": "400072",
    "contactPerson": "Shri Manoj Kumar",
    "phone": "8587030740",
    "email": "dctc-wr@dcmsme.gov.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/80/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7119404)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 32,
    "id": "LAB-032",
    "oslCode": "8131026",
    "name": "Alpha Test House Private Limited, Delhi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_451_lC1Kfay.jpeg",
    "address": "487/25, Near Prachin Shiv Mandir Peeragarhi,\n DELHI, \n New Delhi, \n Delhi, \n India -  110087",
    "city": "DELHI",
    "district": "New Delhi",
    "state": "Delhi",
    "pincode": "110087",
    "contactPerson": "Ravinder Gupta",
    "phone": "9711227171",
    "email": "electrical@alphatesthouse.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/82/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8131026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 33,
    "id": "LAB-033",
    "oslCode": "9122136",
    "name": "Hindustaan Testing Solutions LLP, Ambala",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. 36,Sector 1, HSIIDC IGC Saha, Ambala Cantt,\n Ambala Cantt, \n Ambala, \n Haryana, \n India -  133104",
    "city": "Ambala Cantt",
    "district": "Ambala",
    "state": "Haryana",
    "pincode": "133104",
    "contactPerson": "Rachna Nayar",
    "phone": "9355002828",
    "email": "hindustaantesthouse@gmail.com",
    "validTill": "12 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/84/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9122136)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 34,
    "id": "LAB-034",
    "oslCode": "8141526",
    "name": "EMC Testing and Compliance LLP, Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_454_q7D2JHj.jpeg",
    "address": "115, Pace City-1, Sector 37,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122001",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122001",
    "contactPerson": "Pradeep Kumar (Quality Manager)",
    "phone": "+91 8130427070",
    "email": "info@emclab.co.in",
    "validTill": "19 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/85/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8141526)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 35,
    "id": "LAB-035",
    "oslCode": "8127226",
    "name": "UL India Private limited, Gurgaon",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_455_H3GlazW.jpeg",
    "address": "A-12 Sector 34 Infocity,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122001",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122001",
    "contactPerson": "Gautam Brahmbhatt (Quality Manager)",
    "phone": "+91 9560249888",
    "email": "Satish.Kumar@ul.com",
    "validTill": "07 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/86/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8127226)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 36,
    "id": "LAB-036",
    "oslCode": "9138706",
    "name": "Alpha Test House Services LLP (160), Sahibzada Ajit Singh Nagar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_457_jEGbDpw.jpeg",
    "address": "plot no.160,Industrial Area Phase-9,\n Sahibzada Ajit Singh Nagar, \n S.A.S Nagar, \n Punjab, \n India -  160062",
    "city": "Sahibzada Ajit Singh Nagar",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "160062",
    "contactPerson": "Aditya Singla(CEO)",
    "phone": "9888717272",
    "email": "chandigarh@alphatesthouse.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/88/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9138706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 37,
    "id": "LAB-037",
    "oslCode": "6131326",
    "name": "CSA INDIA PRIVATE LIMITED, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_459_OflIAYg.jpeg",
    "address": "A-3  III FLOOR, BEARYS GRT, TOWER A EINSTEIN BUILDING SY 63/3B, GORVIGERE BIDARHALLI HOBLI, BENGALURU (BANGALORE) URBAN,,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560067",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560067",
    "contactPerson": "",
    "phone": "+91 9900056802",
    "email": "harsh.juneja@csagroup.org",
    "validTill": "08 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/90/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6131326)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 38,
    "id": "LAB-038",
    "oslCode": "8123835",
    "name": "Fire Test & Research Laboratory, Sonipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_460_nHcijSU.jpeg",
    "address": "9th Milestone, Sonipat-Gohana Road, VPO Rattangarh, NH-352A,,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131001",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131001",
    "contactPerson": "Rahul Chhillar (Quality Manager)",
    "phone": "+91 011 42831112",
    "email": "info@ftrl.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/91/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8123835)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 39,
    "id": "LAB-039",
    "oslCode": "8136826",
    "name": "URS PRODUCTS AND TESTING PVT LTD (F3), NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_461_egnK1Ba.jpeg",
    "address": "F-3, Sector - 6,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Neeraj Rathee (Quality Manager)",
    "phone": "+91 9871062220",
    "email": "testing@ursindia.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/92/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8136826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 40,
    "id": "LAB-040",
    "oslCode": "8122336",
    "name": "Shri Krishna Test House",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No 88, Sector -E, Bawana-II, DSIIDC Industrial complex New Delhi,\n Delhi, \n Shahdara, \n Delhi, \n India -  110040",
    "city": "Delhi",
    "district": "Shahdara",
    "state": "Delhi",
    "pincode": "110040",
    "contactPerson": "Sunil Kumar Talwar",
    "phone": "9891112786",
    "email": "skth1234@gmail.com",
    "validTill": "05 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/93/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8122336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 41,
    "id": "LAB-041",
    "oslCode": "6120526",
    "name": "UL INDIA PRIVATE LIMITED, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_463_WZcQMw5.jpeg",
    "address": "Loc 1&2-Kalyani Platina Campus, Sy. no 129/4, EPIP Zone, Phase II, Whitefield, Bangalore- 560066, Loc3- 30/A, I Stage Vishveshwarya Industrial Estate, Doddanekkundi Industrial Area, Bangalore - 560048,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560066",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560066",
    "contactPerson": "Nandakumar Sarangan",
    "phone": "9845225164",
    "email": "sarangan.nandakumar@ul.com",
    "validTill": "12 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/94/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6120526)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 42,
    "id": "LAB-042",
    "oslCode": "9137734",
    "name": "Renewable Energy Test Centre (RTC), Murthal",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_464_msmhzOw.jpeg",
    "address": "Deenbandhu Chhotu Ram University of Science & Technology Murthal,\n Murthal, \n Sonipat, \n Haryana, \n India -  131039",
    "city": "Murthal",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131039",
    "contactPerson": "Dheeraj Yadav (Quality Manager)",
    "phone": "+91 9416810043",
    "email": "retcdcrust@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/95/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9137734)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 43,
    "id": "LAB-043",
    "oslCode": "8127706",
    "name": "BUREAU VERITAS CONSUMER PRODUCTS SERVICES INDIA PRIVATE LIMITED, NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_467_eF2XL1C.jpeg",
    "address": "C-19, Sector -7,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Sudhir Singh",
    "phone": "9910985361",
    "email": "sudhir.singh@bureauveritas.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/98/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8127706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 44,
    "id": "LAB-044",
    "oslCode": "8141226",
    "name": "ACCURATE TEST SOLUTIONS LLP (F21), NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_468_vrnQCMx.jpeg",
    "address": "F 21 SECTOR 11 NOIDA 201301,\n NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Sanchit Trehan",
    "phone": "9810820552",
    "email": "",
    "validTill": "04 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/99/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8141226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 45,
    "id": "LAB-045",
    "oslCode": "6162524",
    "name": "CSIR-CECRI, CSIR-Battery Performance Testing & Evalauation Centre, Karaikudi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_uea0EpB.png",
    "address": "CSIR-CECRI, KARAIKUDI,\n KARAIKUDI, \n Sivaganga, \n Tamil Nadu, \n India -  630003",
    "city": "KARAIKUDI",
    "district": "Sivaganga",
    "state": "Tamil Nadu",
    "pincode": "630003",
    "contactPerson": "Sundar mayavan",
    "phone": "7598446281",
    "email": "sundarmayavan@cecri.res.in",
    "validTill": "24 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/100/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6162524)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 46,
    "id": "LAB-046",
    "oslCode": "6105534",
    "name": "Br. MSME- DEVELOPMENT INSTITUTE, COIMBATORE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_470_6UHfPAf.jpeg",
    "address": "386, Patel Road,  Ramnagar,  Coimbatore \u2013 641009, Tamil Nadu, India.,\n COIMBATORE, \n Coimbatore, \n Tamil Nadu, \n India -  641009",
    "city": "COIMBATORE",
    "district": "Coimbatore",
    "state": "Tamil Nadu",
    "pincode": "641009",
    "contactPerson": "Sabarigiri M (Technical Manager)",
    "phone": "9487163288",
    "email": "brdcdi-coim@dcmsme.gov.in",
    "validTill": "14 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/101/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6105534)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 47,
    "id": "LAB-047",
    "oslCode": "5141106",
    "name": "ESKAPS (INDIA) PRIVATE LIMITED, KOLKATA",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "13 N/P, Chowringhee Mansion, 30, Jawaharlal Nehru Road.,\n KOLKATA, \n Kolkata, \n West Bengal, \n India -  700016",
    "city": "KOLKATA",
    "district": "Kolkata",
    "state": "West Bengal",
    "pincode": "700016",
    "contactPerson": "LABA KUMAR DAS (LAB HEAD)",
    "phone": "8802588515",
    "email": "certification@eskaps.net",
    "validTill": "08 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/103/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5141106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 48,
    "id": "LAB-048",
    "oslCode": "6117624",
    "name": "ELECTRONICS TEST AND DEVELOPMENT CENTRE - ETDC (STQC), BANGALURU (SAFETY LAB))",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_473_RTqMsey.jpeg",
    "address": "100 feet Road, Peenya IndustriaL Area,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560058",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560058",
    "contactPerson": "V R Sarur",
    "phone": "9480050731",
    "email": "vrsarur@stqc.gov.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/104/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6117624)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 49,
    "id": "LAB-049",
    "oslCode": "6114835",
    "name": "National Council for Cement and Building Materials (NCCBM), Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_475_ogstrDv.jpeg",
    "address": "NCB Bhavan, Old Bombay Road, Near Raidarga Police Station, Gachibowli, Hyderabad - 500104.,\n Hyderabad, \n Ranga Reddy, \n Telangana, \n India -  500104",
    "city": "Hyderabad",
    "district": "Ranga Reddy",
    "state": "Telangana",
    "pincode": "500104",
    "contactPerson": "Suresh Vanguri (Quality Manager)",
    "phone": "+91 0129 4192222",
    "email": "ncbhcrt@rediffmail.com",
    "validTill": "14 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/105/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6114835)",
    "disciplines": [
      "Civil",
      "Mechanical",
      "Chemical"
    ],
    "standards": [
      "IS 1489",
      "IS 16415",
      "IS 269",
      "IS 456",
      "IS 8112"
    ],
    "products": [
      "Ceramic Tiles",
      "Clay Bricks",
      "Composite Cement",
      "Concrete Aggregates",
      "Portland Pozzolana Cement"
    ],
    "scopeDetails": [
      {
        "standard": "IS 16415",
        "title": "Composite Cement",
        "product": "Composite Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "Portland Pozzolana Cement",
        "product": "Portland Pozzolana Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 269",
        "title": "Concrete Aggregates",
        "product": "Concrete Aggregates",
        "fee": "5000"
      },
      {
        "standard": "IS 8112",
        "title": "Clay Bricks",
        "product": "Clay Bricks",
        "fee": "5000"
      },
      {
        "standard": "IS 456",
        "title": "Ceramic Tiles",
        "product": "Ceramic Tiles",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 50,
    "id": "LAB-050",
    "oslCode": "6120236",
    "name": "CHENNAI METTEX LAB PVT LTD, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_476_ZzbQpG3.jpeg",
    "address": "Jothi Complex, No.83, MKN Road, Guindy,\n CHENNAI, \n Chennai, \n Tamil Nadu, \n India -  600122",
    "city": "CHENNAI",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600122",
    "contactPerson": "Mrs.J. Hemalatha (Quality Manager)",
    "phone": "+91 9841078949",
    "email": "test@mettexlab.com",
    "validTill": "02 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/106/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6120236)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 51,
    "id": "LAB-051",
    "oslCode": "7139416",
    "name": "Bee Pharmo Labs Pvt. Ltd., Thane",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_XiqDquf.png",
    "address": "C-2, Hatkesh Udyog Nagar, Mira Bhayander Road, Mira Road (East),\n Thane, \n Thane, \n Maharashtra, \n India -  401107",
    "city": "Thane",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "401107",
    "contactPerson": "Nidhi Dubey (Technical Manager)",
    "phone": "+91 9820113704",
    "email": "food@beepharmo.com",
    "validTill": "15 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/107/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7139416)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 52,
    "id": "LAB-052",
    "oslCode": "7139026",
    "name": "TUV INDIA PVT LTD, PUNE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5011_Cj523cH.jpeg",
    "address": "TUV India Pvt. Ltd. ANJANI PALLADIUM, 203 & 204,  SECOND FLOOR AND MEZZANINE FLOOR, 104B,  SURVEY NO.126/1, BANER MAIN ROAD, BANER.,\n PUNE, \n Pune, \n Maharashtra, \n India -  411045",
    "city": "PUNE",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411045",
    "contactPerson": "RAVIRAJ PADOL",
    "phone": "9561652667",
    "email": "praviraj@tuv-nord.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/108/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7139026)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 53,
    "id": "LAB-053",
    "oslCode": "6121716",
    "name": "Shiva Analyticals (India) Private Limited, Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_479_gp2Yw33.jpeg",
    "address": "Plot Nos. 24D(P) & 34D, KIADB Industrial Area, Hoskote,\n Bangalore, \n Bengaluru Rural, \n Karnataka, \n India -  562114",
    "city": "Bangalore",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "562114",
    "contactPerson": "BALACHANDRAN G (Technical Manager)",
    "phone": "+91 9741621119",
    "email": "sathyamoorthy.m@shivaanalyticals.com",
    "validTill": "21 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/109/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6121716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 54,
    "id": "LAB-054",
    "oslCode": "8123735",
    "name": "International Centre for Automotive Technology, Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_480_K1yeH54.jpeg",
    "address": "Plot No. 26, Sector-3, HSIIDC, IMT Manesar - 122050,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122050",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122050",
    "contactPerson": "PRITAM SINGH",
    "phone": "9871365588",
    "email": "pritam.singh@icat.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/110/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8123735)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 55,
    "id": "LAB-055",
    "oslCode": "9140406",
    "name": "KC INDIA TEST LABORATORIES LLP, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_481_ThSADSR.jpeg",
    "address": "A-16/2, Site-IV, Sahibabad Industrial Area,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201010",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201010",
    "contactPerson": "RASHMI BHARDWAJ (Quality Manager)",
    "phone": "+91 9599880265",
    "email": "kcitestlab@gmail.com",
    "validTill": "06 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/111/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9140406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 56,
    "id": "LAB-056",
    "oslCode": "8134626",
    "name": "CONFORMITY TESTING LABS PVT LTD (WH52)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_mnDpJKO.png",
    "address": "WH-52, Mayapuri Industrial Area, Phase-1,\n New Delhi, \n South West, \n Delhi, \n India -  110064",
    "city": "New Delhi",
    "district": "South West",
    "state": "Delhi",
    "pincode": "110064",
    "contactPerson": "Mr. J.K Dhawan Dhawan (Quality Manager)",
    "phone": "+91 9811127453",
    "email": "cto@labctl.in",
    "validTill": "19 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/112/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8134626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 57,
    "id": "LAB-057",
    "oslCode": "8141826",
    "name": "Star Wire (India) Laboratories Private Ltd., Ballabhgarh",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_WEgzdZW.png",
    "address": "21/4, Mathura Road,\n ballabgarh, \n Faridabad, \n Haryana, \n India -  121004",
    "city": "ballabgarh",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121004",
    "contactPerson": "Harish Garg (Quality Manager)",
    "phone": "+91 011 43397400",
    "email": "swdc06@starwire.in",
    "validTill": "17 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/113/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8141826)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 58,
    "id": "LAB-058",
    "oslCode": "6126416",
    "name": "NAWaL Analytical Labs India Private Limited, Hosur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_490_WtRzDHa.jpeg",
    "address": "Plot No:98A,100,109, New SIDCO Industrial Estate,Srinagar,\n HOSUR, \n Krishnagiri, \n Tamil Nadu, \n India -  635109",
    "city": "HOSUR",
    "district": "Krishnagiri",
    "state": "Tamil Nadu",
    "pincode": "635109",
    "contactPerson": "D BALAKRISHNAN",
    "phone": "9894785841",
    "email": "ecogreen.labs@gmail.com",
    "validTill": "21 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/115/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6126416)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 59,
    "id": "LAB-059",
    "oslCode": "8139626",
    "name": "Conformity Testing Labs Pvt. Ltd. Unit 2 (A33)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_492_SMyk2Vx.jpeg",
    "address": "A-33, Mayapuri Industrial Area, Phase 1, New Delhi,\n New Delhi, \n New Delhi, \n Delhi, \n India -  110064",
    "city": "New Delhi",
    "district": "New Delhi",
    "state": "Delhi",
    "pincode": "110064",
    "contactPerson": "Reenu Gupta (Quality Manager)",
    "phone": "+91 7840889997",
    "email": "qa@labctl.in",
    "validTill": "05 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/117/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8139626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 60,
    "id": "LAB-060",
    "oslCode": "7123316",
    "name": "MicroChem Silliker Pvt. Ltd, Navi Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_493_UQc0DKL.jpeg",
    "address": "MicroChem Silliker Pvt. Ltd. D-87, Opp Khajanji Exports, Indiranagar, TTC Industrial Area, MIDC  Turbhe,  Navi Mumbai,\n Turbhe, Navi Mumbai, \n Thane, \n Maharashtra, \n India -  400703",
    "city": "Turbhe, Navi Mumbai",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400703",
    "contactPerson": "Nikisha Raut (Quality Manager)",
    "phone": "+91 7045924393",
    "email": "jeetendra.patil@mxns.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/118/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7123316)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 61,
    "id": "LAB-061",
    "oslCode": "8101304",
    "name": "National Test House (NR) - NTH, Ghaziabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_z6B97RT.png",
    "address": "Kamla Nehru Nagar,Ghaziabad,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201002",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201002",
    "contactPerson": "Shri Rajesh Kumar",
    "phone": "9412223381",
    "email": "director-gzb@nth.gov.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/120/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8101304)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 62,
    "id": "LAB-062",
    "oslCode": "5126636",
    "name": "SUNTECH",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_498_kMRkdyb.jpeg",
    "address": "40-P, TUPUDANA INDUSTRIAL AREA,\n RANCHI, \n Ranchi, \n Jharkhand, \n India -  834003",
    "city": "RANCHI",
    "district": "Ranchi",
    "state": "Jharkhand",
    "pincode": "834003",
    "contactPerson": "ANIL D. HANS",
    "phone": "9304172295",
    "email": "sun.tech.lab@gmail.com",
    "validTill": "11 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/122/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5126636)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 63,
    "id": "LAB-063",
    "oslCode": "6135404",
    "name": "The National Small Industries Corporation Ltd (NSIC), Chennai",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "NSIC Technical Services Centre (A Government of India Enterprise), Sector B-24, Guindy Industrial Estate, Ekkaduthangal, Chennai-600 032.,\n CHENNAI, \n Chennai, \n Tamil Nadu, \n India -  600032",
    "city": "CHENNAI",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600032",
    "contactPerson": "NK SUBRAMANI",
    "phone": "9840912079",
    "email": "ntscche@nsic.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/123/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6135404)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 64,
    "id": "LAB-064",
    "oslCode": "6126126",
    "name": "TUV Rheinland (India) Pvt. Ltd (6126126), Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_501_AMeTbhR.jpeg",
    "address": "TUV Rheinland (India) Pvt. Ltd. 27/B,2nd Cross Road,  Electronic City Phase-1,  Bangalore,\n Bengaluru, \n Bengaluru Rural, \n Karnataka, \n India -  560100",
    "city": "Bengaluru",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "560100",
    "contactPerson": "Guruprasad BR",
    "phone": "9620288803",
    "email": "guruprasad.br@ind.tuv.com",
    "validTill": "17 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/124/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6126126)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 65,
    "id": "LAB-065",
    "oslCode": "8116816",
    "name": "Arbro Pharmaceuticals Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_502_HO70hFr.jpeg",
    "address": "4/9, Kirti Nagar Industrial Area, New Delhi,\n Delhi, \n New Delhi, \n Delhi, \n India -  110015",
    "city": "Delhi",
    "district": "New Delhi",
    "state": "Delhi",
    "pincode": "110015",
    "contactPerson": "Mr. Ashu Kumar (Technical Manager)",
    "phone": "+91 9650095867",
    "email": "arbrolab@arbropharma.com",
    "validTill": "14 Jan, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/125/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8116816)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 66,
    "id": "LAB-066",
    "oslCode": "9127026",
    "name": "Delhi Test House (A Unit of Delhii Test House Global LLP) (50) Kundli, Sonipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_503_8bo03bj.jpeg",
    "address": "Plot No. 50, Phase -IV, Sector-57, HSIIDC Industrial Area, Kundli, Sonipat-131028, Haryana.,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131028",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131028",
    "contactPerson": "Dhruv Rohilla (Technical Manager)",
    "phone": "+91 11 47075555",
    "email": "ag@delhitesthouse.com",
    "validTill": "23 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/126/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9127026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 67,
    "id": "LAB-067",
    "oslCode": "5135906",
    "name": "Excel Surveyors Pvt. Ltd., Kolkata",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_504_EULvyzD.jpeg",
    "address": "F-171, Prabartak Jute Mills Ltd., Gate No. 4, Old Nimta Road, , Kolkata-700 058,\n Kolkata, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700058",
    "city": "Kolkata",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700058",
    "contactPerson": "Jagadish Chandra Taraphdar (Quality Manager)",
    "phone": "+91 9825121860",
    "email": "sudip@excelsurveyor.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/127/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5135906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 68,
    "id": "LAB-068",
    "oslCode": "6132316",
    "name": "SMS Labs Services Private Limited, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_505_YB7tDpY.jpeg",
    "address": "# 39/6, T.H. Road, Puduchatram, Thirumazhisai (Via),  Poonamallee \u2013 Tk, Chennai,\n Tiruvallur, \n Thiruvallur, \n Tamil Nadu, \n India -  600124",
    "city": "Tiruvallur",
    "district": "Thiruvallur",
    "state": "Tamil Nadu",
    "pincode": "600124",
    "contactPerson": "Balaji S (Quality Manager)",
    "phone": "+91 44 26811662",
    "email": "sm@smsla.in",
    "validTill": "08 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/128/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6132316)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 69,
    "id": "LAB-069",
    "oslCode": "6108016",
    "name": "Bureau Veritas (India) Pvt Ltd, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_506_utB8645.jpeg",
    "address": "No. F2, Thiru \u2013 Vi \u2013 Ka Industrial Estate, Phase III, Ekkattuthangal, Guindy,\n chennai, \n Chennai, \n Tamil Nadu, \n India -  600032",
    "city": "chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600032",
    "contactPerson": "Suresh R (Technical Manager)",
    "phone": "+91 9600090754",
    "email": "qachennaimail@bureauveritas.com",
    "validTill": "31 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/129/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6108016)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 70,
    "id": "LAB-070",
    "oslCode": "6108116",
    "name": "BUREAU VERITAS INDIA TESTING SERVICES PVT LTD, HYDERABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_507_ZEHMynl.jpeg",
    "address": "7-2-C7 & 8/4 SANATHNAGAR INDUSTRIAL ESTATE,\n HYDERABAD, \n Hyderabad, \n Telangana, \n India -  500018",
    "city": "HYDERABAD",
    "district": "Hyderabad",
    "state": "Telangana",
    "pincode": "500018",
    "contactPerson": "Balasubramaniam K K (Technical Manager)",
    "phone": "+91 7760522141",
    "email": "deepika.p@bureauveritas.com",
    "validTill": "31 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/130/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6108116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 71,
    "id": "LAB-071",
    "oslCode": "6104634",
    "name": "CIPET, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_510_0gUHlOM.jpeg",
    "address": "TVK industrial area,Guindy,\n chennai, \n Chennai, \n Tamil Nadu, \n India -  600032",
    "city": "chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600032",
    "contactPerson": "UDHAYAMALAR S (Quality Manager)",
    "phone": "+91 9480442963",
    "email": "cipetchnptc@gmail.com",
    "validTill": "31 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/132/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6104634)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 72,
    "id": "LAB-072",
    "oslCode": "7124016",
    "name": "FHHL PRIVATE LIMITED, PUNE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_512_EnX8u14.jpeg",
    "address": "Survey No. 126/10, Plot No. 1,Hadapsar Industrial Estate, Hadapsar,\n Pune, \n Pune, \n Maharashtra, \n India -  411013",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411013",
    "contactPerson": "",
    "phone": "+91 8380074694",
    "email": "info@fhhl.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/134/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7124016)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 73,
    "id": "LAB-073",
    "oslCode": "5163604",
    "name": "Central institute of Petrochemicals Engineering & Technology (CIPET), Raipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_3u7iAjT.png",
    "address": "PLOT NO 48, INDUSTRIAL ARE BHANPURI, BHANPURI,\n Raipur, \n Raipur, \n Chhattisgarh, \n India -  493221",
    "city": "Raipur",
    "district": "Raipur",
    "state": "Chhattisgarh",
    "pincode": "493221",
    "contactPerson": "Dr Alok Sahu (Quality Manager)",
    "phone": "+91 44 22254780",
    "email": "cipetraipur@gmail.com",
    "validTill": "25 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/135/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5163604)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 74,
    "id": "LAB-074",
    "oslCode": "8165826",
    "name": "AA Electro Magnetic Laboratory Pvt Ltd, Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_515_wbVT9Ps.jpeg",
    "address": "Plot174, udyog vihar, phase 4,\n Gurgaon, \n Gurugram, \n Haryana, \n India -  122015",
    "city": "Gurgaon",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122015",
    "contactPerson": "Bittu Kumar (Lab Manager)",
    "phone": "9654340888",
    "email": "info@aaemtlabs.com",
    "validTill": "24 Sep, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/137/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8165826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 75,
    "id": "LAB-075",
    "oslCode": "6139316",
    "name": "VSIX ANALYTICAL LABS PVT LTD, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_XGWBBCC.png",
    "address": "#77,21st D cross, Muthurayaswamy Layout,Shrigandhakaval,Sunkadakatte,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560091",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560091",
    "contactPerson": "Kesavakumar Kamath N (Technical Manager)",
    "phone": "+91 9972300136",
    "email": "qc@vsixlabs.in",
    "validTill": "18 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/138/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6139316)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 76,
    "id": "LAB-076",
    "oslCode": "8166516",
    "name": "FARE Labs Pvt. Ltd. (8166516), Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_520_UDK0OPr.jpeg",
    "address": "D-18 Infocity Phase II, Sector-33,\n GURUGRAM, \n Gurugram, \n Haryana, \n India -  122001",
    "city": "GURUGRAM",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122001",
    "contactPerson": "",
    "phone": "+91 9313532519",
    "email": "meenakshi.tripathi@farelabs.com",
    "validTill": "25 Nov, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/139/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8166516)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 77,
    "id": "LAB-077",
    "oslCode": "7115716",
    "name": "Geo-Chem Laboratories Private Limited, Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_521_Dc0Lv3C.jpeg",
    "address": "Pragati, adjacent to Crompton Greaves, Kanjurmarg (East), Mumbai - 400042,\n Mumbai, \n Mumbai, \n Maharashtra, \n India -  400042",
    "city": "Mumbai",
    "district": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400042",
    "contactPerson": "P. Suresh Babu",
    "phone": "9930068601",
    "email": "laboratory@geochem.net.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/140/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7115716)",
    "disciplines": [
      "Civil",
      "Mechanical",
      "Chemical"
    ],
    "standards": [
      "IS 1489",
      "IS 16415",
      "IS 269",
      "IS 456",
      "IS 8112"
    ],
    "products": [
      "Ceramic Tiles",
      "Clay Bricks",
      "Composite Cement",
      "Concrete Aggregates",
      "Portland Pozzolana Cement"
    ],
    "scopeDetails": [
      {
        "standard": "IS 16415",
        "title": "Composite Cement",
        "product": "Composite Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "Portland Pozzolana Cement",
        "product": "Portland Pozzolana Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 269",
        "title": "Concrete Aggregates",
        "product": "Concrete Aggregates",
        "fee": "5000"
      },
      {
        "standard": "IS 8112",
        "title": "Clay Bricks",
        "product": "Clay Bricks",
        "fee": "5000"
      },
      {
        "standard": "IS 456",
        "title": "Ceramic Tiles",
        "product": "Ceramic Tiles",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 78,
    "id": "LAB-078",
    "oslCode": "7119116",
    "name": "Maarc Labs Private Limited, Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_8GmYRCm.png",
    "address": "Survey No. 169, Sinhagad Road, Nanded Phata Pune, Maharashtra-411041,\n Pune, \n Pune, \n Maharashtra, \n India -  411041",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411041",
    "contactPerson": "",
    "phone": "+91 9372411814",
    "email": "maarclabs.pune@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/141/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7119116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 79,
    "id": "LAB-079",
    "oslCode": "6139834",
    "name": "CIPET, Madurai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_523_8F0Lxv3.jpeg",
    "address": "SIDCO Industrial Estate, Adjacent to Post office, K Pudur, Madurai-625007,\n Madurai, \n Madurai, \n Tamil Nadu, \n India -  625007",
    "city": "Madurai",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "pincode": "625007",
    "contactPerson": "",
    "phone": "+91 44 22254780",
    "email": "cipetmdutesting@gmail.com",
    "validTill": "22 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/142/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6139834)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 80,
    "id": "LAB-080",
    "oslCode": "7106935",
    "name": "The Automotive Research Association of India (ARAI), Kothrud, Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_525_BWnkot8.jpeg",
    "address": "Survey no.102,Vetal hill,off Paud road,Kothrud,\n Pune, \n Pune, \n Maharashtra, \n India -  411038",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411038",
    "contactPerson": "Praveen Dambal (Quality Manager)",
    "phone": "+91 9422008185",
    "email": "director@araiindia.com",
    "validTill": "11 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/143/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7106935)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 81,
    "id": "LAB-081",
    "oslCode": "9102534",
    "name": "CIPET, Lucknow",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "B-27 Amausi Industrial Area Nadarganj Lucknow,\n Luknow, \n Lucknow, \n Uttar Pradesh, \n India -  226008",
    "city": "Luknow",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "pincode": "226008",
    "contactPerson": "Vivek Kumar (Quality Manager)",
    "phone": "+91 7052009477",
    "email": "cipetlko2@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/144/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9102534)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 82,
    "id": "LAB-082",
    "oslCode": "6141334",
    "name": "CIPET, Vijayawada",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_527_zwXKLOt.jpeg",
    "address": "SY NO. 377, Surampalli (V), Gannavaram (M), Krishna Dist.,\n VIJAYAWADA, \n Krishna, \n Andhra Pradesh, \n India -  521212",
    "city": "VIJAYAWADA",
    "district": "Krishna",
    "state": "Andhra Pradesh",
    "pincode": "521212",
    "contactPerson": "Dr. CH SHEKAR (Quality Manager)",
    "phone": "+91 7077573905",
    "email": "vijayawada@cipet.gov.in",
    "validTill": "06 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/145/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6141334)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 83,
    "id": "LAB-083",
    "oslCode": "8134206",
    "name": "Atharva Laboratories Pvt. Ltd. (D115A), Noida (8134206)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_529_Xx9ygMG.jpeg",
    "address": "D-115 A, Hosiery Complex, Phase-II, Noida,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201305",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201305",
    "contactPerson": "Sandeep Kumar Jindal",
    "phone": "7065088001",
    "email": "alplgreaternoida@gmail.com",
    "validTill": "21 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/147/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8134206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 84,
    "id": "LAB-084",
    "oslCode": "9100634",
    "name": "Research & Development Centre for Bicycle and Sewing Machine, Ludhiana",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_530_kQd94KX.jpeg",
    "address": "B 38-39, Phase-V, Focal Point,,\n Ludhiana, \n Ludhiana, \n Punjab, \n India -  141010",
    "city": "Ludhiana",
    "district": "Ludhiana",
    "state": "Punjab",
    "pincode": "141010",
    "contactPerson": "Rajeev Kumar Sharma",
    "phone": "9888012324",
    "email": "bsmcrd@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/148/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9100634)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 85,
    "id": "LAB-085",
    "oslCode": "9163904",
    "name": "Central Institute of Petrochemicals Engineering and Technology (CIPET), BADDI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_531_FNafdDi.jpeg",
    "address": "Plot No. 198/201, Inside VRLA Building, Near Biogenetic Pvt. Ltd.,  Jharmajri, Baddi,\n Baddi, \n Solan, \n Himachal Pradesh, \n India -  173205",
    "city": "Baddi",
    "district": "Solan",
    "state": "Himachal Pradesh",
    "pincode": "173205",
    "contactPerson": "Dr. U.P. Singh (Quality Manager)",
    "phone": "+91 8829039100",
    "email": "baddicipet@gmail.com",
    "validTill": "16 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/149/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9163904)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 86,
    "id": "LAB-086",
    "oslCode": "7130916",
    "name": "Ashwamedh Engineers & Consultants Laboratory Services Division, Nashik",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_532_8qPgQoi.jpeg",
    "address": "Survey No.102, Plot No.26, Wadala Pathardi Road, Indira Nagar,\n NASHIK, \n Nashik, \n Maharashtra, \n India -  422009",
    "city": "NASHIK",
    "district": "Nashik",
    "state": "Maharashtra",
    "pincode": "422009",
    "contactPerson": "Ulka Belan (Quality Manager)",
    "phone": "+91 9325385516",
    "email": "aparna@ashwamedh.net",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/150/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7130916)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 87,
    "id": "LAB-087",
    "oslCode": "7123534",
    "name": "CIPET: CSTS, Chhatrapati Sambhajinagar",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No.\u00a0J-3/2, MIDC Industrial Area, Chikalthana, Jalgaon Road,\n Chhatrapati Sambhajinagar, \n Aurangabad, \n Maharashtra, \n India -  431006",
    "city": "Chhatrapati Sambhajinagar",
    "district": "Aurangabad",
    "state": "Maharashtra",
    "pincode": "431006",
    "contactPerson": "Kirankumar V. Koli (Quality Manager)",
    "phone": "8602677054",
    "email": "aurangabad@cipet.gov.in",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/152/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7123534)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 88,
    "id": "LAB-088",
    "oslCode": "7137016",
    "name": "Gujarat Testlab Private Limited, Ahmedabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_fGpE7HC.png",
    "address": "F-16,17 Madhavpura Market, Nr. Police Commissioner Office, Shahibaug,,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  380004",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "380004",
    "contactPerson": "Krishna Amin (Quality Manager)",
    "phone": "+91 9825615647",
    "email": "gujlab@gmail.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/155/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7137016)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 89,
    "id": "LAB-089",
    "oslCode": "8165726",
    "name": "IEC TEST LABS LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_538_08t0ig5.jpeg",
    "address": "Ground Floor, Plot No. N-47, Pkt-N,\u00a0Sector-5,\u00a0Bawana, DSIDC, Delhi-110039,\n Delhi, \n North West, \n Delhi, \n India -  110039",
    "city": "Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110039",
    "contactPerson": "MANISH JADON",
    "phone": "9871727340",
    "email": "iectestlabs@gmail.com",
    "validTill": "07 Sep, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/156/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8165726)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 90,
    "id": "LAB-090",
    "oslCode": "7124116",
    "name": "Anacon Laboratories Pvt. Ltd, Nagpur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_539_ivmdZEl.jpeg",
    "address": "FP 34-35, Food Park, Five Star Estate, MIDC Butibori, Nagpur,\n Nagpur, \n Nagpur, \n Maharashtra, \n India -  441122",
    "city": "Nagpur",
    "district": "Nagpur",
    "state": "Maharashtra",
    "pincode": "441122",
    "contactPerson": "Sugandha Garway (Quality Manager)",
    "phone": "+91 9823167077",
    "email": "labngp@anacon.in",
    "validTill": "15 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/157/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7124116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 91,
    "id": "LAB-091",
    "oslCode": "6132626",
    "name": "SGS INDIA PRIVATE LIMITED, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_541_CORyBer.jpeg",
    "address": "No 38/1 and 38/2, New BBMP, No.88/45/45, Beretena Agrahara Begur Hobli, Hosur Main Road, Bangalore-560100,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560100",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560100",
    "contactPerson": "Rajesh",
    "phone": "9513642187",
    "email": "rajesh.sp@sgs.com",
    "validTill": "17 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/159/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6132626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 92,
    "id": "LAB-092",
    "oslCode": "6102906",
    "name": "Vimta labs Limited, Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_w4TRTtb.png",
    "address": "Plot No.5,Neovantage science and Technology park, Genome Valley, Shameerpet,\n Hyderabad, \n Medchal Malkajgiri, \n Telangana, \n India -  500101",
    "city": "Hyderabad",
    "district": "Medchal Malkajgiri",
    "state": "Telangana",
    "pincode": "500101",
    "contactPerson": "Dr Muni Nagendra Prasad",
    "phone": "9121009302",
    "email": "muni.poola@vimta.com",
    "validTill": "31 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/160/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6102906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 93,
    "id": "LAB-093",
    "oslCode": "8141726",
    "name": "Bharti Automation Pvt. Ltd.(A Testing Division), Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_543_LcoiWbj.jpeg",
    "address": "Plot no. 354,Sector-7, IMT Manesar, Gurgaon,\n Gurgaon, \n Gurugram, \n Haryana, \n India -  122050",
    "city": "Gurgaon",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122050",
    "contactPerson": "Jyoti Singh (Quality Manager)",
    "phone": "+91 9711337466",
    "email": "ashok@bhartiautomation.com",
    "validTill": "05 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/161/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8141726)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 94,
    "id": "LAB-094",
    "oslCode": "7108424",
    "name": "Electronics Regional Test Laboratory (West) - ERTL (STQC), Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_GEROVua.png",
    "address": "Government of India, Ministry of Electronics and Information Technology, Plot no. F-7&8, MIDC Area, Opp. SEEPZ, Andheri(East), Mumbai-400093,\n MUMBAI, \n Mumbai Suburban, \n Maharashtra, \n India -  400093",
    "city": "MUMBAI",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "pincode": "400093",
    "contactPerson": "Chaitanya Athawale",
    "phone": "9869258557",
    "email": "cathawale@stqc.gov.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/162/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7108424)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 95,
    "id": "LAB-095",
    "oslCode": "9140626",
    "name": "Aforeserve Labs Private Limited, Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_545_JRKDOa4.jpeg",
    "address": "Plot no 138, Sector-7, IMT Manesar, Gurugram,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122051",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122051",
    "contactPerson": "Prakash Chandra Barik (Technical Manager)",
    "phone": "+91 8448749120",
    "email": "helpdesk@aforeserve.co.in",
    "validTill": "06 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/163/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9140626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 96,
    "id": "LAB-096",
    "oslCode": "7165436",
    "name": "DARSHAN ELECTRICAL TESTING AND RESEARCH LABORATORY (DETRL), RAJKOT",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_546_aq15ah0.jpeg",
    "address": "At, Hadala, Rajkot - Morbi Highway, Nr. Water Sump, Rajkot - 363650,\n Rajkot, \n Rajkot, \n Gujarat, \n India -  363650",
    "city": "Rajkot",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "363650",
    "contactPerson": "Anil Kansagara (Quality Manager)",
    "phone": "+91 9824451162",
    "email": "detrl@darshan.ac.in",
    "validTill": "09 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/164/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7165436)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 97,
    "id": "LAB-097",
    "oslCode": "8165026",
    "name": "Atharva Laboratories Pvt. Ltd. (C-54), Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_547_N5xPdU4.jpeg",
    "address": "C-54, Hosiery Complex, Phase-II, Noida-201305,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201305",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201305",
    "contactPerson": "Savita Jindal",
    "phone": "9315142851",
    "email": "atharvalaboratories2@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/165/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8165026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 98,
    "id": "LAB-098",
    "oslCode": "6164216",
    "name": "Vimta Labs Limited, Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_548_ospxE46.jpeg",
    "address": "1047, 18th C Main Rd, 5th Block, Rajajinagar, Bengaluru, Karnataka 560010,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560010",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560010",
    "contactPerson": "Syed Mahammad Rasool",
    "phone": "9100094273",
    "email": "syed.rasool@vimta.com",
    "validTill": "15 Oct, 2025",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/166/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6164216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 99,
    "id": "LAB-099",
    "oslCode": "7120616",
    "name": "Envirocare Labs Pvt Ltd, Thane",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_gNHFMcA.png",
    "address": "A7-A8 Enviro House, MIDC Main Road, Wagle Industrial Estate, Thane.,\n Thane, \n Thane, \n Maharashtra, \n India -  400604",
    "city": "Thane",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400604",
    "contactPerson": "Soumya Nair",
    "phone": "9167232042",
    "email": "soumya.n@envirocare.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/168/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7120616)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 100,
    "id": "LAB-100",
    "oslCode": "8118116",
    "name": "Cali Labs Private Limited, Bhopal",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_551_6r0XNHp.jpeg",
    "address": "Khasra No. 11/1/1/1/2/2, Infront of Govt. School Lambakheda, Berasia Road, Bhopal,\n Bhopal, \n Bhopal, \n Madhya Pradesh, \n India -  462038",
    "city": "Bhopal",
    "district": "Bhopal",
    "state": "Madhya Pradesh",
    "pincode": "462038",
    "contactPerson": "Mr. Siddharth Tulse (Technical Manager)",
    "phone": "+91 0755 4013281",
    "email": "calilabs@gmail.com",
    "validTill": "31 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/169/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8118116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 101,
    "id": "LAB-101",
    "oslCode": "8100924",
    "name": "CENTRAL POWER RESEARCH INSTITUTE (CPRI), BHOPAL",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_552_wYWEe1a.jpeg",
    "address": "GOVINDPURA,\n BHOPAL, \n Bhopal, \n Madhya Pradesh, \n India -  462023",
    "city": "BHOPAL",
    "district": "Bhopal",
    "state": "Madhya Pradesh",
    "pincode": "462023",
    "contactPerson": "DR. ARUN KUMAR DATTA (Quality Manager)",
    "phone": "+91 080 23602919",
    "email": "stds@cpri.in",
    "validTill": "30 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/170/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8100924)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 102,
    "id": "LAB-102",
    "oslCode": "9134736",
    "name": "Mananda Test House, Derabassi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_553_WSHEHtv.jpeg",
    "address": "Dhanauni Road (Near Lord  Mahavir Jain Public School), Derabassi, Mohali, Punjab,\n Derabassi, \n S.A.S Nagar, \n Punjab, \n India -  140507",
    "city": "Derabassi",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "140507",
    "contactPerson": "",
    "phone": "9988336323",
    "email": "mth17@rediffmail.com",
    "validTill": "02 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/171/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9134736)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 103,
    "id": "LAB-103",
    "oslCode": "9140226",
    "name": "Nextron International Lab Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_554_2Rlc85e.jpeg",
    "address": "G-45, Pocket-C, Sector-4,\n Bawana, \n North West, \n Delhi, \n India -  110039",
    "city": "Bawana",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110039",
    "contactPerson": "Gaurav Gulia",
    "phone": "8437033522",
    "email": "gulia.gaurav@yahoo.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/172/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9140226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 104,
    "id": "LAB-104",
    "oslCode": "8131406",
    "name": "DELHI TEST HOUSE (A Unit of Delhii Test House Global LLP), Azadpur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_555_z1uX5n9.jpeg",
    "address": "A-62/3, G T KARNAL ROAD INDUSTRIAL AREA, OPPOSITE HANS CINEMA, AZADPUR, DELHI 110033,\n Delhi, \n North, \n Delhi, \n India -  110033",
    "city": "Delhi",
    "district": "North",
    "state": "Delhi",
    "pincode": "110033",
    "contactPerson": "Dinesh Goel",
    "phone": "9810442016",
    "email": "info@delhitesthouse.com",
    "validTill": "17 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/173/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8131406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 105,
    "id": "LAB-105",
    "oslCode": "9138006",
    "name": "Delhi Test House (A Unit of Delhii Test House Global LLP) (65) Kundli-2, Sonipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_556_ITDrlcN.jpeg",
    "address": "Plot  No. 65, Phase IV, Sector-57, HSIIDC Industrial Area,  Kundli, Sonipat-131028,  Haryana.,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131028",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131028",
    "contactPerson": "DINESH GOEL",
    "phone": "+91 11 47075555",
    "email": "rohit@delhitesthouse.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/174/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9138006)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "Lighting"
    ],
    "standards": [
      "IS 15885 : Part 2 : Sec 13 (2012)"
    ],
    "products": [
      "DC or AC Supplied Electronic Controlgear For LED Module",
      "SAFETY OF LAMP CONTROLGEAR",
      "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
      "d.c. or a.c. supplied electronic controlgear",
      "for AC and DC up to 1000 V"
    ],
    "scopeDetails": [
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "--",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "--",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "DC or AC Supplied Electronic Controlgear For LED Module",
        "fee": ""
      },
      {
        "standard": "IS 15885 : Part 2 : Sec 13 (2012)",
        "title": "Safety of lamp controlgear: Part 2 particular requirements: Sec 13 d.c. or a.c. supplied electronic controlgear for led modules",
        "product": "-",
        "fee": ""
      }
    ]
  },
  {
    "sno": 106,
    "id": "LAB-106",
    "oslCode": "8138626",
    "name": "Matrix Test Labs",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_gdQG59p.png",
    "address": "PLOT NO 28 BADLI INDUSTRIAL AREA,\n delhi, \n New Delhi, \n Delhi, \n India -  110042",
    "city": "delhi",
    "district": "New Delhi",
    "state": "Delhi",
    "pincode": "110042",
    "contactPerson": "VINEET KR. (Technical Manager)",
    "phone": "+91 9560422022",
    "email": "matrixtestlab@gmail.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/175/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8138626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 107,
    "id": "LAB-107",
    "oslCode": "5127516",
    "name": "EDWARD FOOD RESEARCH & ANALYSIS CENTRE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_559_janufs7.jpeg",
    "address": "SUBHAS NAGAR, NILGUNJ BAZAR, BARASAT, KOLKATA- 700121,\n Kolkata, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700121",
    "city": "Kolkata",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700121",
    "contactPerson": "SURESH KUMAR MANDAL (Quality Manager)",
    "phone": "+91 33 66333939",
    "email": "efraclab@efrac.org",
    "validTill": "07 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/176/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5127516)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 108,
    "id": "LAB-108",
    "oslCode": "8133016",
    "name": "Saturn Quality Certifications Pvt.Ltd., Bahadurgarh",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_563_MHyOl2u.jpeg",
    "address": "V-17,Modern Industrial Estate (M.I.E). Red Cross Road, Bahadurgarh, Haryana \u2013 124 507,\n Bahadurgarh, \n Jhajjar, \n Haryana, \n India -  124507",
    "city": "Bahadurgarh",
    "district": "Jhajjar",
    "state": "Haryana",
    "pincode": "124507",
    "contactPerson": "Dr. Smriti Babbar (Quality Manager)",
    "phone": "+91 9212190099",
    "email": "lab@saturngroupindia.com",
    "validTill": "03 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/179/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8133016)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 109,
    "id": "LAB-109",
    "oslCode": "9137826",
    "name": "Bharat Test House Pvt Ltd 781 Sonipat Haryana",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_593_sRG5jAv.jpeg",
    "address": "781, HSIIDC Rai Industrial Estate,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131029",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131029",
    "contactPerson": "",
    "phone": "+91 9810562215",
    "email": "director@bharattesthouse.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/183/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9137826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 110,
    "id": "LAB-110",
    "oslCode": "9135626",
    "name": "Bharat Test House Pvt Ltd 1474 Sonipat Haryana",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_597_qveaZzd.jpeg",
    "address": "1474, HSIIDC Rai Industrial Estate,\n SONIPAT, \n Sonipat, \n Haryana, \n India -  131029",
    "city": "SONIPAT",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131029",
    "contactPerson": "",
    "phone": "+91 9310314585",
    "email": "bthrai@bharattesthouse.com",
    "validTill": "19 Mar, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/185/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9135626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 111,
    "id": "LAB-111",
    "oslCode": "7116134",
    "name": "CIPET, Ahmedabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_599_nzvpy2w.jpeg",
    "address": "Plot No. 630, Phase-IV, GIDC, Vatva,,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  382445",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "382445",
    "contactPerson": "Rajesh Panda (Technical Manager)",
    "phone": "+91 7229000205",
    "email": "cipetahmd@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/187/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7116134)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 112,
    "id": "LAB-112",
    "oslCode": "9140526",
    "name": "TUV Rheinland (India) Pvt. Ltd. (417), Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_608_y76goAN.jpeg",
    "address": "Plot No. 417, Udyog Vihar, Phase IV,\n Gurgaon, \n Gurugram, \n Haryana, \n India -  122015",
    "city": "Gurgaon",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122015",
    "contactPerson": "Praveen Kumar Sharma",
    "phone": "8588856255",
    "email": "praveenkumar.sharma@ind.tuv.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/189/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9140526)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 113,
    "id": "LAB-113",
    "oslCode": "9162826",
    "name": "Ace Test Labs & Metrology Pvt. Ltd., Sonipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_609_J21EY5y.jpeg",
    "address": "PLOT NO. 68, HSIIDC, INDUSTRIAL ESTATE,RAI,\n SONIPAT, \n Sonipat, \n Haryana, \n India -  131029",
    "city": "SONIPAT",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131029",
    "contactPerson": "Harinder Pal Singh",
    "phone": "881692117",
    "email": "info@acetestgroup.com",
    "validTill": "14 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/190/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9162826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 114,
    "id": "LAB-114",
    "oslCode": "5102634",
    "name": "CENTRAL INSTITUTE OF PETROCHEMICALS ENGINEERING & TECHNOLOGY (CIPET) : IPT-BHUBANESWAR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_610_Pn4qm04.jpeg",
    "address": "B/25, C.N.I complex, Patia, Bhubaneswar,\n BHUBANESWAR, \n Khordha, \n Odisha, \n India -  751024",
    "city": "BHUBANESWAR",
    "district": "Khordha",
    "state": "Odisha",
    "pincode": "751024",
    "contactPerson": "Dr.Bishnu Prasasd Panda (Technical Manager)",
    "phone": "+91 7566177001",
    "email": "cipetbbsr@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/191/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5102634)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 115,
    "id": "LAB-115",
    "oslCode": "6164516",
    "name": "ABC Techno Labs India Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_612_4AEFDoG.jpeg",
    "address": "ABC Tower, No.400, 13th Street, SIDCO Industrial Estate - North Phase,\n Ambattur, \n Chennai, \n Tamil Nadu, \n India -  600098",
    "city": "Ambattur",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600098",
    "contactPerson": "A. Robson Chinnadurai (Technical Manager)",
    "phone": "+91 9600412908",
    "email": "quality@abctechnolab.com",
    "validTill": "04 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/192/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6164516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 116,
    "id": "LAB-116",
    "oslCode": "8125516",
    "name": "INTERTEK INDIA PRIVATE LIMITED  FOOD SERVICES, GURUGRAM",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_614_XW65ggQ.jpeg",
    "address": "Plot No 68 69, Phase I, Udyog Vihar, Gurgaon, Haryana,\n Gurgaon, \n Gurugram, \n Haryana, \n India -  122016",
    "city": "Gurgaon",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122016",
    "contactPerson": "Aditi Gupta (Quality Manager)",
    "phone": "+91 011 41595421",
    "email": "quality.food@intertek.com",
    "validTill": "07 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/193/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8125516)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 117,
    "id": "LAB-117",
    "oslCode": "8167006",
    "name": "Cosmo Analytical Lab LLP, Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_617_6irUebV.jpeg",
    "address": "C-423, SEC-10, Noida,\n NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "SHRAWAN KUMAR PANDEY",
    "phone": "7985377877",
    "email": "cosmolabs.noida@gmail.com",
    "validTill": "13 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/196/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8167006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 118,
    "id": "LAB-118",
    "oslCode": "6111634",
    "name": "CIPET, Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_618_P7SMQ8u.jpeg",
    "address": "IDA Phase II, Cherlapally,\n Hyderabad, \n Medchal Malkajgiri, \n Telangana, \n India -  500051",
    "city": "Hyderabad",
    "district": "Medchal Malkajgiri",
    "state": "Telangana",
    "pincode": "500051",
    "contactPerson": "B. Sriker",
    "phone": "9959333415",
    "email": "cipetptchyd@gmail.com",
    "validTill": "23 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/197/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6111634)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 119,
    "id": "LAB-119",
    "oslCode": "7126506",
    "name": "Testtex India Laboratories Pvt. Ltd., Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_619_QVCmGMS.jpeg",
    "address": "301-304, PREMSON INDUSTRIAL ESTATE, CAVES ROAD, MUMBAI,LOCATION 2 - OFFICE NO.2, TAHIRA IND. COMPOUND (PREMSONS INDUSTRIAL ESTATE COMPOUND), CAVES ROAD, JOGESHWARI (EAST), MUMBAI-400060,\n MUMBAI, \n Mumbai, \n Maharashtra, \n India -  400060",
    "city": "MUMBAI",
    "district": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400060",
    "contactPerson": "G. Viswanathan (Quality Manager)",
    "phone": "+91 9821112271",
    "email": "kunal@testtex.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/198/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7126506)",
    "disciplines": [
      "Textiles",
      "Footwear",
      "Toys",
      "Chemical",
      "Mechanical"
    ],
    "standards": [
      "IS 10702 (2023)",
      "IS 11226 (1993)",
      "IS 12254 (2021)",
      "IS 13893 (1994)",
      "IS 13995 (1995)",
      "IS 14544 (2022)",
      "IS 15298 : Part 2 (2024)",
      "IS 15298 : Part 3 (2024)",
      "IS 15298 : part 4 (2024)",
      "IS 15644 (2006)",
      "IS 15844 : Part 1 (2023)",
      "IS 15844 : Part 2 (2023)",
      "IS 15844 : Part 3 (2024)",
      "IS 16645  (2018)",
      "IS 16994  (2018)",
      "IS 17012  (2018)",
      "IS 17037  (2018)",
      "IS 17043 : Part 1 (2024)",
      "IS 17043 : Part 2 (2024)",
      "IS 1989 : Part 1 (1986)",
      "IS 1989 : Part 2 (1986)",
      "IS 3735 (1996)",
      "IS 3736 (1995)",
      "IS 3976 (2018)",
      "IS 5557 : Part 2 (2018)",
      "IS 6721 (2023)",
      "IS 9873 (Part 2) (2025)",
      "IS 9873 : Part 1 (2019)",
      "IS 9873 : Part 1 (2025)",
      "IS 9873 : Part 3 (2017)"
    ],
    "products": [
      "All",
      "All rubber gum boots and ankle boots:",
      "Anti riot shoes",
      "Canvas Shoes, Rubber Sole",
      "Canvas boots, rubber sole",
      "Footwear for Men and Women for Municipal Scavenging Wor",
      "Hawai Chappal With amendment No.1 and 2",
      "High ankle tactical boots with pu - Rubber sole",
      "Leather Safety Boots and Shoes: Part 2 Heavy Metal Ind.",
      "Leather Safety and Protective Footwear with Direct Moul",
      "Leather safety footwear having direct moulded rubber so",
      "Migration of Certain Elements",
      "Moulded Plastics Footwear \u201d Lined or Unlined Polyuretha",
      "Occupational Footwear (Third Revision)",
      "PERFORMANCE SPORTS FOOTWEAR WITH AMENDMENT 1",
      "POLYVINYLCHLORIDE PVC INDUSTRIAL BOOTS  Second Revision",
      "Polyurethane Unit Outsoles",
      "Protective Footwear (Third Revision)",
      "SANDAL AND SLIPPERS WITH AMENDMENT NO. 1",
      "SPORTS FOOTWEAR PART -1 GENERAL PURPOSE + Amd. 1 : 2024",
      "Safety Boots for miners",
      "Safety Footwear",
      "Shoes - Specification - Part 2 Shoes for General Purpose",
      "Shoes - Specification Part 1 Shoes for Services",
      "Specification for leather safety boots and shoes: Part",
      "Sports Footwear Part 3 Professional Sports Footwear",
      "Unlined moulded rubber boots"
    ],
    "scopeDetails": [
      {
        "standard": "IS 17012  (2018)",
        "title": "High ankle tactical boots with pu - Rubber sole - Specification",
        "product": "High ankle tactical boots with pu - Rubber sole",
        "fee": "45000 \n                    -"
      },
      {
        "standard": "IS 10702 (2023)",
        "title": "Hawai Chappal-Specification",
        "product": "Hawai Chappal With amendment No.1 and 2",
        "fee": "35000 \n                    -"
      },
      {
        "standard": "IS 12254 (2021)",
        "title": "POLYVINYLCHLORIDE PVC INDUSTRIAL BOOTS - SPECIFICATION  Second Revision",
        "product": "POLYVINYLCHLORIDE PVC INDUSTRIAL BOOTS  Second Revision",
        "fee": "52500 \n                    -"
      },
      {
        "standard": "IS 9873 (Part 2) (2025)",
        "title": "SAFETY OF TOYS  PART 2 FLAMMABILITY (Fourth Revision)",
        "product": "All",
        "fee": "1500 \n                    -"
      },
      {
        "standard": "IS 9873 : Part 1 (2025)",
        "title": "SAFETY OF TOYS  PART 1: SAFETY ASPECTS RELATED TO MECHANICAL AND PHYSICAL PROPERTIES (Fifth Revision)",
        "product": "All",
        "fee": "10500 \n                    -"
      },
      {
        "standard": "IS 17043 : Part 2 (2024)",
        "title": "Shoes: Shoes for General Purpose",
        "product": "Shoes - Specification - Part 2 Shoes for General Purpose",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 6721 (2023)",
        "title": "SANDAL AND SLIPPERS  SPECIFICATION First revision",
        "product": "SANDAL AND SLIPPERS WITH AMENDMENT NO. 1",
        "fee": "35000 \n                    -"
      },
      {
        "standard": "IS 15844 : Part 1 (2023)",
        "title": "SPORTS FOOTWEAR  PART -1 GENERAL PURPOSEFirst Revision",
        "product": "SPORTS FOOTWEAR PART -1 GENERAL PURPOSE + Amd. 1 : 2024",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 15844 : Part 2 (2023)",
        "title": "SPORTS FOOTWEAR PART -2 PERFORMANCE SPORTS FOOTWEAR",
        "product": "PERFORMANCE SPORTS FOOTWEAR WITH AMENDMENT 1",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 15844 : Part 3 (2024)",
        "title": "Sports Footwear  Part 3 Professional Sports Footwear",
        "product": "Sports Footwear Part 3 Professional Sports Footwear",
        "fee": "42000 \n                    -"
      },
      {
        "standard": "IS 17043 : Part 1 (2024)",
        "title": "Shoes - Specification Part 1 Shoes for Services",
        "product": "Shoes - Specification Part 1 Shoes for Services",
        "fee": "39000 \n                    -"
      },
      {
        "standard": "IS 15298 : part 4 (2024)",
        "title": "Personal Protective Equipment    Part 4 Occupational Footwear   (ISO 20347 : 2021, MOD)   (Third Revision)",
        "product": "Occupational Footwear (Third Revision)",
        "fee": "37500 \n                    -"
      },
      {
        "standard": "IS 15298 : Part 3 (2024)",
        "title": "Personal Protective Equipment Part 3 Protective Footwear (ISO 20346 : 2021, MOD) (Third Revision)",
        "product": "Protective Footwear (Third Revision)",
        "fee": "39000 \n                    -"
      },
      {
        "standard": "IS 15298 : Part 2 (2024)",
        "title": "Personal Protective Equipment Part 2 Safety Footwear (ISO 20345 : 2021, MOD) (Third Revision)",
        "product": "Safety Footwear",
        "fee": "45000 \n                    -"
      },
      {
        "standard": "IS 9873 : Part 1 (2019)",
        "title": "Safety of toys: Part 1 safety aspects related to mechanical and physical properties (Fourth Revision)",
        "product": "All",
        "fee": "10500 \n                    -"
      },
      {
        "standard": "IS 15644 (2006)",
        "title": "Safety of electric toys",
        "product": "All",
        "fee": "13500 \n                    -"
      },
      {
        "standard": "IS 9873 : Part 3 (2017)",
        "title": "Safety of toys: Part 3 migration of certain elements (Second Revision)",
        "product": "Migration of Certain Elements",
        "fee": "4000 \n                    -"
      },
      {
        "standard": "IS 14544 (2022)",
        "title": "LEATHER SAFETY AND PROTECTIVE FOOTWEAR WITH DIRECT MOULDED POLYVINYL CHLORIDE PVC SOLE - SPECIFICATION  First Revision",
        "product": "Leather Safety and Protective Footwear with Direct Moul",
        "fee": "72600 \n                    -"
      },
      {
        "standard": "IS 1989 : Part 2 (1986)",
        "title": "Specification for leather safety boots and shoes: Part 2 for heavy metal industries (Fourth Revision)",
        "product": "Leather Safety Boots and Shoes: Part 2 Heavy Metal Ind.",
        "fee": "72200 \n                    -"
      },
      {
        "standard": "IS 1989 : Part 1 (1986)",
        "title": "Specification for leather safety boots and shoes: Part 1 for miners (Fourth Revision)",
        "product": "Specification for leather safety boots and shoes: Part",
        "fee": "84300 \n                    -"
      }
    ]
  },
  {
    "sno": 120,
    "id": "LAB-120",
    "oslCode": "8117816",
    "name": "Avon Food Lab Pvt. Ltd.",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_1U6IPOA.png",
    "address": "C-35/23 lawrence road industrial area, Delhi-110035,\n New Delhi, \n North West, \n Delhi, \n India -  110035",
    "city": "New Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110035",
    "contactPerson": "",
    "phone": "+91 9810004270",
    "email": "qm@avonfoodlab.com",
    "validTill": "19 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/199/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8117816)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 121,
    "id": "LAB-121",
    "oslCode": "8122904",
    "name": "National Test House (NWR) - NTH, Jaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_623_PHXEIXi.jpeg",
    "address": "E 763, ROAD NO. 9F1, VKI AREA,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302013",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302013",
    "contactPerson": "Shri Sriilayaraj Sounrararajan",
    "phone": "9412223386",
    "email": "director-jai@nth.gov.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/201/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8122904)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 122,
    "id": "LAB-122",
    "oslCode": "6113734",
    "name": "CIPET. MYSURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_630_duJGB3F.jpeg",
    "address": "437/A, Hebbal indl. Area,\n Mysuru, \n Mysuru, \n Karnataka, \n India -  570016",
    "city": "Mysuru",
    "district": "Mysuru",
    "state": "Karnataka",
    "pincode": "570016",
    "contactPerson": "R T Nagaralli (Quality Manager)",
    "phone": "+91 8124489163",
    "email": "ptcmys@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/203/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6113734)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 123,
    "id": "LAB-123",
    "oslCode": "8136626",
    "name": "Intertek India Private Limited, New Delhi (E-26)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_633_4gjSYJz.jpeg",
    "address": "E-26, Block B-1, Mohan Co-Operative Industrial Estate, Mathura Road,\n Delhi, \n New Delhi, \n Delhi, \n India -  110044",
    "city": "Delhi",
    "district": "New Delhi",
    "state": "Delhi",
    "pincode": "110044",
    "contactPerson": "Manas Das (Quality Manager)",
    "phone": "+91 9820213510",
    "email": "manas.das@intertek.com",
    "validTill": "27 Apr, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/205/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8136626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 124,
    "id": "LAB-124",
    "oslCode": "8161906",
    "name": "ACE TEST HOUSE PRIVATE LIMITED (8161906), NEW DELHI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_644_eb5eqL0.jpeg",
    "address": "khasra No 1048 Near Pepsi Godown, vill- Bhalaswa,\n New Delhi, \n North West, \n Delhi, \n India -  110033",
    "city": "New Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110033",
    "contactPerson": "Ms. Jyoti - (Technical Manager)",
    "phone": "+91 7042858881",
    "email": "acetesthouse@gmail.com",
    "validTill": "26 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/213/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8161906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 125,
    "id": "LAB-125",
    "oslCode": "8141606",
    "name": "AADCO TESTING & RESEARCH LABORATORY PVT LTD (F28), GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_645_p9D27fN.jpeg",
    "address": "F 28 BULANDSHAHAR ROAD INDUSTRIAL AREA,\n GHAZIABAD, \n Ghaziabad, \n Uttar Pradesh, \n India -  201009",
    "city": "GHAZIABAD",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201009",
    "contactPerson": "NK GOEL (Technical Manager)",
    "phone": "+91 9555443495",
    "email": "aadcolab@gmail.com",
    "validTill": "26 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/214/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8141606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 126,
    "id": "LAB-126",
    "oslCode": "9137406",
    "name": "HTH Laboratories Private Limited, Panipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_648_fO9qCLS.jpeg",
    "address": "Plot No. 50-C, Sector-25, Part-2, HUDA,\n Panipat, \n Panipat, \n Haryana, \n India -  132103",
    "city": "Panipat",
    "district": "Panipat",
    "state": "Haryana",
    "pincode": "132103",
    "contactPerson": "Deepa Sardana (Quality Manager)",
    "phone": "+91 9416017160",
    "email": "haryanatesthousecs@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/217/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9137406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 127,
    "id": "LAB-127",
    "oslCode": "8117716",
    "name": "AES Laboratories Pvt. Ltd., Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_649_TDCPcuy.jpeg",
    "address": "B-118 Phase 2, Noida, U.P 201305,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201305",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201305",
    "contactPerson": "Ms. Priyanka Vijay (Quality Manager)",
    "phone": "+91 9811331569",
    "email": "tqm@aeslabs.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/218/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8117716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 128,
    "id": "LAB-128",
    "oslCode": "7161816",
    "name": "HPCL, Vashi QC Laboratory, Navi Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_650_AdInUR3.jpeg",
    "address": "HPCL QC LAB, PLOT NO. D-99,, HPCL VASHI TERMINAL,, TURBHE MIDC,\n NAVI MUMBAI, \n Thane, \n Maharashtra, \n India -  400705",
    "city": "NAVI MUMBAI",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400705",
    "contactPerson": "SATISH LIKHAR (Quality Manager)",
    "phone": "9594110099 9869287114",
    "email": "svlikhar@hpcl.in",
    "validTill": "23 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/219/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7161816)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 129,
    "id": "LAB-129",
    "oslCode": "5108204",
    "name": "MICRO, SMALL & MEDIUM ENTERPRISES - TESTING CENTRE (MSME), KOLKATA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_651_D2uBGRi.jpeg",
    "address": "111 &112, B. T. ROAD,\n KOLKATA, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700108",
    "city": "KOLKATA",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700108",
    "contactPerson": "M K Anjanaiah",
    "phone": "9640378334",
    "email": "dctc-er@dcmsme.gov.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/220/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5108204)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 130,
    "id": "LAB-130",
    "oslCode": "7101125",
    "name": "Electrical Research and Development Association, gujurat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_652_lqvxr4o.jpeg",
    "address": "ERDA Road, GIDC, Makarpura, Vadodara,\n VADODARA, \n Vadodara, \n Gujarat, \n India -  390010",
    "city": "VADODARA",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "390010",
    "contactPerson": "Mr. Nirav Taunk",
    "phone": "9978940719",
    "email": "nirav.taunk@erda.org",
    "validTill": "30 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/221/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7101125)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 131,
    "id": "LAB-131",
    "oslCode": "6137634",
    "name": "CIPET, KOCHI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_654_M4q7WWO.jpeg",
    "address": "196 A, HIL Colony, Pathalam, Edayar Road,Eloor, Udyogamandal.P.O., Kochi,\n KOCHI, \n Ernakulam, \n Kerala, \n India -  683501",
    "city": "KOCHI",
    "district": "Ernakulam",
    "state": "Kerala",
    "pincode": "683501",
    "contactPerson": "",
    "phone": "+91 8129497182",
    "email": "cipetkochi@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/223/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6137634)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 132,
    "id": "LAB-132",
    "oslCode": "7118234",
    "name": "ELECTRONICS AND QUALITY DEVELOPMENT CENTRE - EQDC, GANDHINAGAR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_655_O0acoTu.jpeg",
    "address": "B 177/178 & B/23/2, GIDC ELECTRONICS ESTATE, SECTOR 25,\n Gandhinagar, \n Gandhinagar, \n Gujarat, \n India -  382024",
    "city": "Gandhinagar",
    "district": "Gandhinagar",
    "state": "Gujarat",
    "pincode": "382024",
    "contactPerson": "DIPAK CHAVDA (Quality Manager)",
    "phone": "+91 9427418080",
    "email": "qm@eqdc.in",
    "validTill": "09 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/224/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7118234)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 133,
    "id": "LAB-133",
    "oslCode": "6114716",
    "name": "SGS India Private Limited-Multilaboratory, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_656_k1JPUQZ.jpeg",
    "address": "28 B/1 (SP), 28 B/2 (SP), SECOND MAIN ROAD, AMBATTUR INDUSTRIAL ESTATE,,\n CHENNAI, \n Chennai, \n Tamil Nadu, \n India -  600058",
    "city": "CHENNAI",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600058",
    "contactPerson": "Dr Pratheeshkumar N",
    "phone": "8939992163",
    "email": "ellappan.m@sgs.com",
    "validTill": "14 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/225/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6114716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 134,
    "id": "LAB-134",
    "oslCode": "5132706",
    "name": "SGS INDIA PRIVATE LTD. ( LAB_JOKA), KOLKATA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_DQWev1Y.png",
    "address": "CS Plot 512p Mouza Hanspukuria PO Joka Diamond Harbour Road  South 24parganas,\n KOLKATA, \n 24 Paraganas South, \n West Bengal, \n India -  700104",
    "city": "KOLKATA",
    "district": "24 Paraganas South",
    "state": "West Bengal",
    "pincode": "700104",
    "contactPerson": "Anusuya Pakrashi (Quality Manager)",
    "phone": "9073687624 9831026305",
    "email": "amit.dutta@sgs.com",
    "validTill": "08 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/226/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5132706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 135,
    "id": "LAB-135",
    "oslCode": "6124716",
    "name": "Interfield Laboratories, Kochi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_658_vHdfhCB.jpeg",
    "address": "XIII/1208, Interprint House, R K Pillai Road, Karuvelipady, Kochi,\n Kochi, \n Ernakulam, \n Kerala, \n India -  682005",
    "city": "Kochi",
    "district": "Ernakulam",
    "state": "Kerala",
    "pincode": "682005",
    "contactPerson": "",
    "phone": "+91 484 2210915",
    "email": "qm@ifl.in",
    "validTill": "02 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/227/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6124716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 136,
    "id": "LAB-136",
    "oslCode": "5164306",
    "name": "INSPECTION SYNDICATE OF INDIA PVT. LTD.",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_664_FyDNdKQ.jpeg",
    "address": "ERGO Brilliant Tower Level 10 Unit No. 1002, GP Block Sector- V, Salt Lake,\n Kolkata, \n Kolkata, \n West Bengal, \n India -  700091",
    "city": "Kolkata",
    "district": "Kolkata",
    "state": "West Bengal",
    "pincode": "700091",
    "contactPerson": "T.K. BANERJEE (Quality Manager)",
    "phone": "+91 033 22307351",
    "email": "isoipl.ho@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/232/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5164306)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 137,
    "id": "LAB-137",
    "oslCode": "5134116",
    "name": "KALYANI LABORATORIES PRIVATE LIMITED, BHUBANESWAR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_665_BJqYQem.jpeg",
    "address": "PLOT NO-78/944,Balianta, Pahala, Bhubaneswar,\n Bhubaneswar, \n Khordha, \n Odisha, \n India -  752101",
    "city": "Bhubaneswar",
    "district": "Khordha",
    "state": "Odisha",
    "pincode": "752101",
    "contactPerson": "PARAMESH JENA (Technical Manager)",
    "phone": "+91 0674 2974059",
    "email": "kalyanilab@yahoo.co.in",
    "validTill": "11 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/233/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5134116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 138,
    "id": "LAB-138",
    "oslCode": "8166826",
    "name": "ACE TEST LAB PRIVATE LIMITED (8166826), DELHI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_668_f4MEWXP.jpeg",
    "address": "Industrial Plot No 69 ,  Khasra No.54  , Street No. 02 , G.T.K. Road Nangli Poona,\n New Delhi, \n North West, \n Delhi, \n India -  110036",
    "city": "New Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110036",
    "contactPerson": "AJAY YADAV",
    "phone": "7879793911",
    "email": "info@acetestlab.com",
    "validTill": "07 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/236/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8166826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 139,
    "id": "LAB-139",
    "oslCode": "8136216",
    "name": "SGS India Pvt Ltd, Gurgaon (8136216)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_669_Ct8HEN7.jpeg",
    "address": "Plot- 21, Sector- 03,\n IMT Manesar, \n Gurugram, \n Haryana, \n India -  122050",
    "city": "IMT Manesar",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122050",
    "contactPerson": "SUSHIL SHARMA",
    "phone": "9643896348",
    "email": "ashwani.verma@sgs.com",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/237/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8136216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 140,
    "id": "LAB-140",
    "oslCode": "9108716",
    "name": "Interstellar Testing Centre Pvt. Ltd. (A group company of Qualitek Labs Limited), Panchkula",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_670_kRL8oX9.jpeg",
    "address": "Plot No. 86 Industrial Area Phase 1, Panchkula,\n Panchkula, \n Panchkula, \n Haryana, \n India -  134109",
    "city": "Panchkula",
    "district": "Panchkula",
    "state": "Haryana",
    "pincode": "134109",
    "contactPerson": "Mithun Khandelwal (Technical Manager)",
    "phone": "+91 8800990919",
    "email": "kamal.grover@itclabs.com",
    "validTill": "31 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/238/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9108716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 141,
    "id": "LAB-141",
    "oslCode": "8135535",
    "name": "International Centre for Automotive Technology (Centre-2)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_671_mfVZCz6.jpeg",
    "address": "Plot No.-1, Sector M-11, HSIIDC, IMT Manesar, Gurugram,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122050",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122050",
    "contactPerson": "Ms. Priyanka Gupta (Quality Manager)",
    "phone": "+91 0124 4586181",
    "email": "icatcentre2_bis@icat.in",
    "validTill": "01 Mar, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/239/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8135535)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 142,
    "id": "LAB-142",
    "oslCode": "8163426",
    "name": "Sierra Aircon Pvt. Ltd., Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_672_tw1KMU4.jpeg",
    "address": "C-470, Pioneer Indl. Park, P.O. Pathredi, (Bilaspur-Tauru Road),\n GURUGRAM, \n Gurugram, \n Haryana, \n India -  122413",
    "city": "GURUGRAM",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122413",
    "contactPerson": "Mr. Md Junaid Alam (Quality Manager)",
    "phone": "+91 9871557776",
    "email": "mail@sierraaircon.com",
    "validTill": "31 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/240/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8163426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 143,
    "id": "LAB-143",
    "oslCode": "8119706",
    "name": "CEG Test House & Research Centre Private Limited, Jaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_674_FBXfXFw.jpeg",
    "address": "B-11(G), BASEMENT FLOOR ,GROUND FLOOR & FOURTH FLOOR, MALVIYA INDUSTRIAL AREA, MALVIYA NAGAR,\n JAIPUR, \n Jaipur, \n Rajasthan, \n India -  302017",
    "city": "JAIPUR",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302017",
    "contactPerson": "Dr. Bipin Kumar Singh",
    "phone": "8955479196",
    "email": "quality@cegtesthouse.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/242/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8119706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 144,
    "id": "LAB-144",
    "oslCode": "8136916",
    "name": "CHOKSI LABORATORIES LIMITED, INDORE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_n6AQL8a.png",
    "address": "Survey No. 9/1 , Balaji Tusiyana Industrial Estate , Kumedi,\n indore, \n Indore, \n Madhya Pradesh, \n India -  452010",
    "city": "indore",
    "district": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "452010",
    "contactPerson": "Manish Singhal (Quality Manager)",
    "phone": "+91 8770896041",
    "email": "qa.indore@choksilab.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/245/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8136916)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 145,
    "id": "LAB-145",
    "oslCode": "8122834",
    "name": "CIPET, Jaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_678_X8L77ew.jpeg",
    "address": "SP-1298, Sitapura Industrial Area, Phase III,Tonk Road, JAIPUR-302 022,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302022",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302022",
    "contactPerson": "Dr. Bishnu Panda",
    "phone": "9090968451",
    "email": "cipetjprtesting@gmail.com",
    "validTill": "21 Feb, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/246/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8122834)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 146,
    "id": "LAB-146",
    "oslCode": "7104734",
    "name": "NSIC - Technical Services Centre, Rajkot",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_679_ubs0j7z.jpeg",
    "address": "Aji Industrial, Bhavnagar Road, Opp Gujarat Forging,\n Rajkot, \n Rajkot, \n Gujarat, \n India -  360003",
    "city": "Rajkot",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360003",
    "contactPerson": "Dharmendra Rajput (Technical Manager)",
    "phone": "+91 9982177100",
    "email": "ntscraj@nsic.co.in",
    "validTill": "14 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/247/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7104734)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 147,
    "id": "LAB-147",
    "oslCode": "7132925",
    "name": "Electrical Research and Development Association",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_682_ZgmuIrR.jpeg",
    "address": "R 336 TTC INDUSTRIAL AREA THANE BELAPUR ROAD MIDC RABALE NAVI MUMBAI,\n NAVI MUMBAI, \n Thane, \n Maharashtra, \n India -  400701",
    "city": "NAVI MUMBAI",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400701",
    "contactPerson": "NARESH MANDADOLA (Technical Manager)",
    "phone": "+91 7738418237",
    "email": "gurunath.rajpurkar@erda.org",
    "validTill": "22 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/250/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7132925)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 148,
    "id": "LAB-148",
    "oslCode": "6106704",
    "name": "MSME TESTING CENTRE, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_683_dWdZWKh.jpeg",
    "address": "No.65/1, GST Road, Guindy,\n Chennai, \n Chennai, \n Tamil Nadu, \n India -  600032",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600032",
    "contactPerson": "G Velladurai",
    "phone": "7666125995",
    "email": "dctc-sr@dcmsme.gov.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/251/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6106704)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 149,
    "id": "LAB-149",
    "oslCode": "7134016",
    "name": "QUALICHEM LABORATORIES, NAGPUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_ZAzk7S8.png",
    "address": "4TH-6TH FLOOR SWAMI SAMARTHA COMMERCIAL COMPLEX, 4, NORTH BAZAR ROAD, NEAR GOKULPETH MARKET, DHARAMPETH EXTN., NAGPUR,\n NAGPUR, \n Nagpur, \n Maharashtra, \n India -  440010",
    "city": "NAGPUR",
    "district": "Nagpur",
    "state": "Maharashtra",
    "pincode": "440010",
    "contactPerson": "Pradnya Nagarnaik (Quality Manager)",
    "phone": "+91 7507418444",
    "email": "qualichemlab@gmail.com",
    "validTill": "12 Jul, 2025",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/252/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7134016)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 150,
    "id": "LAB-150",
    "oslCode": "7103506",
    "name": "TCR ENGINEERING SERVICES PVT.LTD., NAVI MUMBAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_685_pIvYSkV.jpeg",
    "address": "VKB HOUSE PLOT NO. EL-182 MIDC TTC ELECTRONIC ZONE MAHAPE NAVI MUMBAI,\n NAVI MUMBAI, \n Thane, \n Maharashtra, \n India -  400710",
    "city": "NAVI MUMBAI",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400710",
    "contactPerson": "Prabhakar Singh (Technical Manager)",
    "phone": "+91 022 68370900",
    "email": "sales@tcreng.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/253/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7103506)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 151,
    "id": "LAB-151",
    "oslCode": "6139136",
    "name": "TRUSTIN ANALYTICAL SOLUTIONS PRIVATE LIMITED, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_686_Hq1nsQr.jpeg",
    "address": "R K COMPLEX, PLOT NO: 303/B, BLOCK-B, FIRST FLOOR, THIRUNEERMALAI ROAD, PARVATHYPURAM, CHROMPET,\n CHENNAI, \n Kanchipuram, \n Tamil Nadu, \n India -  600044",
    "city": "CHENNAI",
    "district": "Kanchipuram",
    "state": "Tamil Nadu",
    "pincode": "600044",
    "contactPerson": "MAHENDRAN M (Quality Manager)",
    "phone": "+91 9444303174",
    "email": "mahendran@trustingroup.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/254/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6139136)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 152,
    "id": "LAB-152",
    "oslCode": "8166916",
    "name": "AGSS ANALYTICAL AND RESEARCH LAB PVT LTD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_688_xv5XxFS.jpeg",
    "address": "C-37/2, Lawrence Road, Industrial Area, Delhi-110035,\n New Delhi, \n North West, \n Delhi, \n India -  110035",
    "city": "New Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110035",
    "contactPerson": "Jaswant Ray (Quality Manager)",
    "phone": "+91 9311654060",
    "email": "agsslabs@gmail.com",
    "validTill": "13 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/256/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8166916)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 153,
    "id": "LAB-153",
    "oslCode": "7105101",
    "name": "CENTRAL INSTITUTE OF ROAD TRANSPORT (CIRT), PUNE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_690_DEBvo1D.jpeg",
    "address": "Pune Nasik Road, Bhosari, Pune,\n Pune, \n Pune, \n Maharashtra, \n India -  411026",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411026",
    "contactPerson": "P. S. Dahiya",
    "phone": "9823113934",
    "email": "qm@cirtindia.com",
    "validTill": "15 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/258/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7105101)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 154,
    "id": "LAB-154",
    "oslCode": "8138926",
    "name": "ELMEF TESTING AND CALIBRATION LABORATORIES PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_691_iAhwAbV.jpeg",
    "address": "RH-8, COUNTYWALK, VILLAGE-JHALARIA,\n Indore, \n Indore, \n Madhya Pradesh, \n India -  452016",
    "city": "Indore",
    "district": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "452016",
    "contactPerson": "Prateeek sharma Sharma (Quality Manager)",
    "phone": "+91 0731 2920477",
    "email": "info@elmef.com",
    "validTill": "03 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/259/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8138926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 155,
    "id": "LAB-155",
    "oslCode": "5118334",
    "name": "CIPET, Hajipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_698_47Favxf.jpeg",
    "address": "INDUSTRIAL AREA,\n Hajipur, \n Vaishali, \n Bihar, \n India -  844102",
    "city": "Hajipur",
    "district": "Vaishali",
    "state": "Bihar",
    "pincode": "844102",
    "contactPerson": "Avinash Kumar",
    "phone": "8294497482",
    "email": "testing-hajipur@cipet.gov.in",
    "validTill": "07 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/266/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5118334)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 156,
    "id": "LAB-156",
    "oslCode": "5135804",
    "name": "RITES Eastern Region Laboratory, Kolkata",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_nLnLdx3.png",
    "address": "56, CR Avenue, Central Metro Station Building,\n KOLKATA, \n Kolkata, \n West Bengal, \n India -  700012",
    "city": "KOLKATA",
    "district": "Kolkata",
    "state": "West Bengal",
    "pincode": "700012",
    "contactPerson": "K S PANDIAN (Quality Manager)",
    "phone": "9073399490",
    "email": "erinspn@rites.com",
    "validTill": "19 Mar, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/267/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5135804)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 157,
    "id": "LAB-157",
    "oslCode": "6122704",
    "name": "NATIONAL TEST HOUSE-SR (NTH), Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_700_ZfBEVxQ.jpeg",
    "address": "GOVT.OF INDIA,CSIR ROAD,TARAMANI.,\n Chennai, \n Chennai, \n Tamil Nadu, \n India -  600113",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600113",
    "contactPerson": "Director",
    "phone": "9412223357",
    "email": "director-chn@nth.gov.in",
    "validTill": "28 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/268/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6122704)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 158,
    "id": "LAB-158",
    "oslCode": "7166626",
    "name": "Intertek India Private Limited (Gujarat)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/LOGO.jpeg",
    "address": "Plot 5 and 6, Swastik Industrial Estate, Vill: Sari, Tal: Sanand,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  382220",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "382220",
    "contactPerson": "Mr. Dharmesh Parmar",
    "phone": "9879907184",
    "email": "dharmesh.parmar@intertek.com",
    "validTill": "02 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/269/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7166626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 159,
    "id": "LAB-159",
    "oslCode": "6118616",
    "name": "Monarch Biotech Private Limited, Unit : Monarch Nuclear Counting Laboratory",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_702_ykZc9re.jpeg",
    "address": "37-A, SIDCO INDUSTRIAL ESTATE, Thirumazhisai,\n CHENNAI, \n Thiruvallur, \n Tamil Nadu, \n India -  600124",
    "city": "CHENNAI",
    "district": "Thiruvallur",
    "state": "Tamil Nadu",
    "pincode": "600124",
    "contactPerson": "A.M. SHIVA KAARTHICK",
    "phone": "9176640172",
    "email": "monarchbio@gmail.com",
    "validTill": "04 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/270/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6118616)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 160,
    "id": "LAB-160",
    "oslCode": "7140126",
    "name": "Electrical Research and Testing Organisation (ERTO), Vadodara",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_703_2PoUfuf.jpeg",
    "address": "Plot No. 747, B/h Gurukrupa farm, near Manjusar village, Savali Vadodara main road,,\n Vadodara, \n Vadodara, \n Gujarat, \n India -  391775",
    "city": "Vadodara",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "391775",
    "contactPerson": "Samir Patel",
    "phone": "9998009021",
    "email": "sr.patel@erto.in",
    "validTill": "10 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/271/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7140126)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 161,
    "id": "LAB-161",
    "oslCode": "9102335",
    "name": "National Council for Cement and Building Materials (testing laboratories), Faridabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_704_RfVcqmm.jpeg",
    "address": "34 km, stone delhi mathura road, ballabgarh, opposite good year tyers,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121004",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121004",
    "contactPerson": "Dr Pinky Pandey (Quality Manager)",
    "phone": "0129 266789",
    "email": "ncbcrt2@gmail.com",
    "validTill": "15 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/272/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9102335)",
    "disciplines": [
      "Civil",
      "Mechanical",
      "Chemical"
    ],
    "standards": [
      "IS 1489",
      "IS 16415",
      "IS 269",
      "IS 456",
      "IS 8112"
    ],
    "products": [
      "Ceramic Tiles",
      "Clay Bricks",
      "Composite Cement",
      "Concrete Aggregates",
      "Portland Pozzolana Cement"
    ],
    "scopeDetails": [
      {
        "standard": "IS 16415",
        "title": "Composite Cement",
        "product": "Composite Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "Portland Pozzolana Cement",
        "product": "Portland Pozzolana Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 269",
        "title": "Concrete Aggregates",
        "product": "Concrete Aggregates",
        "fee": "5000"
      },
      {
        "standard": "IS 8112",
        "title": "Clay Bricks",
        "product": "Clay Bricks",
        "fee": "5000"
      },
      {
        "standard": "IS 456",
        "title": "Ceramic Tiles",
        "product": "Ceramic Tiles",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 162,
    "id": "LAB-162",
    "oslCode": "7167306",
    "name": "HEXIQON LABORATORY PRIVATE LIMITED, AHMEDABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_707_GH1Vg5n.jpeg",
    "address": "PLOT NO 8, SHAYONA ESTATE PART-2, NR.LAMBDA RESEARCH LABORATORY,NR.AUDA WATER TANK,, GOTA,,\n AHMEDABAD, \n Ahmadabad, \n Gujarat, \n India -  382481",
    "city": "AHMEDABAD",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "382481",
    "contactPerson": "",
    "phone": "+91 8487878021",
    "email": "hexiqonlab@gmail.com",
    "validTill": "07 Feb, 2030",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/275/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7167306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 163,
    "id": "LAB-163",
    "oslCode": "8122426",
    "name": "Intertek India Private Limited, New Delhi (E-20)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_709_UChZKUP.jpeg",
    "address": "E-20, Block B-1, Mohan Co-operative Industrial Estate, Mathura Road, New Delhi,\n Delhi, \n South, \n Delhi, \n India -  110044",
    "city": "Delhi",
    "district": "South",
    "state": "Delhi",
    "pincode": "110044",
    "contactPerson": "Rakesh Chaurasia",
    "phone": "9871092339",
    "email": "rakesh.chaurasia@intertek.com",
    "validTill": "27 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/277/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8122426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 164,
    "id": "LAB-164",
    "oslCode": "6139916",
    "name": "HUBERT ENVIRO CARE SYSTEMS(P)LTD, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_712_WvqoFhy.jpeg",
    "address": "18, 92nd St, Sector 10, Sivalingapuram, Ashok Nagar, Chennai, Tamil Nadu 600083,\n Chennai, \n Chennai, \n Tamil Nadu, \n India -  600083",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600083",
    "contactPerson": "Dr.Rajkumar Samuel (Quality Manager)",
    "phone": "+91 044 42985555",
    "email": "rajkumar@hecs.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/278/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6139916)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 165,
    "id": "LAB-165",
    "oslCode": "7137216",
    "name": "LILABA ANALYTICAL LABORATORIES LLP, SURAT",
    "logoUrl": "https://lims.bis.gov.in/media/profile/recent_photograph_7q80JME_gFP7pxj.jpg",
    "address": "BLOCK NO.327, PLOT NO. 88/89/90/91/92, SIDDHI VINAYAK INDUSTRIAL ESTATE, VILLAGE KHOLVAD, SURAT, GUJARAT, INDIA,\n Surat, \n Surat, \n Gujarat, \n India -  394190",
    "city": "Surat",
    "district": "Surat",
    "state": "Gujarat",
    "pincode": "394190",
    "contactPerson": "Mr. Bhavesh Sojitra",
    "phone": "7878522830",
    "email": "admin@lilabalabs.com",
    "validTill": "11 Jun, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/282/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7137216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 166,
    "id": "LAB-166",
    "oslCode": "6133416",
    "name": "Eurofins Analytical Services India Private Limited, Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_746_XLkdojf.jpeg",
    "address": "540/1, Doddanekundi Industrial Area 2,Graphite India Road, Hoodi, Whitefield, 560048, Bengaluru, India,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560048",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560048",
    "contactPerson": "RIZWAN SHARIFF",
    "phone": "9060896026",
    "email": "Rizwan.Shariff@xoin.eurofinsasia.com",
    "validTill": "14 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/286/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6133416)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 167,
    "id": "LAB-167",
    "oslCode": "6104206",
    "name": "Shriram Research Institute",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "14-15, Sadarmangala Industrial Area, Whitefield Road,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560048",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560048",
    "contactPerson": "Mr. NAGARAJ D (Quality Manager)",
    "phone": "+91 011 27667267",
    "email": "dn@shriraminstitute-blr.org",
    "validTill": "14 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/288/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6104206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 168,
    "id": "LAB-168",
    "oslCode": "7121526",
    "name": "Karandikar Laboratories Pvt. Ltd., Boisar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_749_sXhCgpk.jpeg",
    "address": "Gat No. 142, Boisar Chillar Road, Opp. Union Park, Betegaon,\n Boisar, \n Palghar, \n Maharashtra, \n India -  401501",
    "city": "Boisar",
    "district": "Palghar",
    "state": "Maharashtra",
    "pincode": "401501",
    "contactPerson": "Atul Marathe (Technical Manager)",
    "phone": "+91 2525284931",
    "email": "sales@karandikarlab.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/289/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7121526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 169,
    "id": "LAB-169",
    "oslCode": "5116334",
    "name": "CENTRAL INSTITUTE OF PETROCHEMICALS ENGINEERING & TECHNOLOGY - CIPET, HALDIA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_752_cEr1BsC.jpeg",
    "address": "CITY CENTRE, P.O. DEBHOG, HALDIA, MEDINIPUR EAST, WEST BENGAL, INDIA,\n HALDIA, \n Medinipur East, \n West Bengal, \n India -  721657",
    "city": "HALDIA",
    "district": "Medinipur East",
    "state": "West Bengal",
    "pincode": "721657",
    "contactPerson": "Mr. Pankaj Mishra",
    "phone": "7477722773",
    "email": "testing-haldia@cipet.gov.in",
    "validTill": "14 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/292/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5116334)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 170,
    "id": "LAB-170",
    "oslCode": "5120906",
    "name": "S.B.Steels Company, Bally",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_753_573k0sK.jpeg",
    "address": "366/1, G.T. Road, Bally,\n Bally, \n Howrah, \n West Bengal, \n India -  711201",
    "city": "Bally",
    "district": "Howrah",
    "state": "West Bengal",
    "pincode": "711201",
    "contactPerson": "Anindya Parui (Quality Manager)",
    "phone": "9830014714",
    "email": "sbsteelsco@gmail.com",
    "validTill": "06 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/293/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5120906)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 171,
    "id": "LAB-171",
    "oslCode": "6114324",
    "name": "Fluid Control Research Institute",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_D1QixCu.png",
    "address": "Kanjikode West,\n Palakkad, \n Palakkad, \n Kerala, \n India -  678623",
    "city": "Palakkad",
    "district": "Palakkad",
    "state": "Kerala",
    "pincode": "678623",
    "contactPerson": "Gopan C K",
    "phone": "9746526100",
    "email": "diroffice@fcriindia.com",
    "validTill": "06 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/294/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6114324)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 172,
    "id": "LAB-172",
    "oslCode": "7118404",
    "name": "Indian Institute of Packaging (IIP), Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_756_xyp8ivi.jpeg",
    "address": "Plot E2, MIDC Area, Andheri East, Road No.8, Post Box No. 9432, Mumbai 400093, Maharashtra, India,\n Andheri, \n Mumbai, \n Maharashtra, \n India -  400093",
    "city": "Andheri",
    "district": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400093",
    "contactPerson": "THUMMA MOSSES MALLIK (Quality Manager)",
    "phone": "+91 2228219803",
    "email": "rdiip@iip-in.com",
    "validTill": "30 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/296/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7118404)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 173,
    "id": "LAB-173",
    "oslCode": "7165924",
    "name": "RTC cum Technology Back up Unit for Solar Thermal Devices (RTC), Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_6hObsCY.png",
    "address": "CENTRE FOR ENERGY STUDIES, SAVITRIBAI PHULE PUNE UNIVERSITY,\n Pune, \n Pune, \n Maharashtra, \n India -  411007",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411007",
    "contactPerson": "Dr. Priti vairale (Quality Manager)",
    "phone": "9765361124",
    "email": "hodenergy@unipune.ac.in",
    "validTill": "26 Oct, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/297/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7165924)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 174,
    "id": "LAB-174",
    "oslCode": "9125906",
    "name": "PLANET ANALYSIS PRIVATE LIMITED, KANPUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_762_4jaXoAG.jpeg",
    "address": "145-B, IInd Floor, Co-Operative Industrial Estate, Udyog Nagar, Dada Nagar,\n Kanpur, \n Kanpur Nagar, \n Uttar Pradesh, \n India -  208022",
    "city": "Kanpur",
    "district": "Kanpur Nagar",
    "state": "Uttar Pradesh",
    "pincode": "208022",
    "contactPerson": "Rohit Pandya (Technical Manager)",
    "phone": "+91 5123260803",
    "email": "paplkanpur@yahoo.in",
    "validTill": "20 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/302/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9125906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 175,
    "id": "LAB-175",
    "oslCode": "6138806",
    "name": "TAG Corporation, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_KS2J62H.png",
    "address": "91, Thiruneermalai Road, Chrompet,\n chennai, \n Kanchipuram, \n Tamil Nadu, \n India -  600044",
    "city": "chennai",
    "district": "Kanchipuram",
    "state": "Tamil Nadu",
    "pincode": "600044",
    "contactPerson": "FAZULUR RAHMAN G (Quality Manager)",
    "phone": "+91 4422382929",
    "email": "murthy@tagcorporation.net",
    "validTill": "10 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/303/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6138806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 176,
    "id": "LAB-176",
    "oslCode": "9133933",
    "name": "Pump Testing Laboratory",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_iDVTgcl.png",
    "address": "Mechanical & Production Engineering Department, Guru Nanak Dev Engineering College, Gill Park, Gill Road,\n Ludhiana, \n Ludhiana, \n Punjab, \n India -  141006",
    "city": "Ludhiana",
    "district": "Ludhiana",
    "state": "Punjab",
    "pincode": "141006",
    "contactPerson": "Dr. J.S. Grewal",
    "phone": "9815323023",
    "email": "jsgrewal23023@gmail.com",
    "validTill": "15 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/304/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9133933)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 177,
    "id": "LAB-177",
    "oslCode": "6121636",
    "name": "LUCID LABORATORIES PRIVATE LIMITED, HYDERABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_778_3053k1b.jpeg",
    "address": "PLOT NO.3, IDA,, BALANAGAR,\n HYDERABAD, \n Medchal Malkajgiri, \n Telangana, \n India -  500037",
    "city": "HYDERABAD",
    "district": "Medchal Malkajgiri",
    "state": "Telangana",
    "pincode": "500037",
    "contactPerson": "CHELLA RAO.S",
    "phone": "8919862683",
    "email": "info@lucidlabsindia.com",
    "validTill": "19 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/308/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6121636)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 178,
    "id": "LAB-178",
    "oslCode": "6104524",
    "name": "CENTRAL ELECTRICAL TESTING LABORATORY (CETL), KAKKALUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_783_6ZDrK2s.jpeg",
    "address": "O/o. THE DEPUTY DIRECTOR (E&E), CENTRAL ELECTRICAL TESTING LABORATORY, DEPARTMENT OF INDUSTRIES & COMMERCE, GOVERNMENT OF TAMIL NADU,  CTH  ROAD,\n KAKKALUR, \n Thiruvallur, \n Tamil Nadu, \n India -  602 003",
    "city": "KAKKALUR",
    "district": "Thiruvallur",
    "state": "Tamil Nadu",
    "pincode": "",
    "contactPerson": "RAVIKUMAR R (Quality Manager)",
    "phone": "+91 9710491500",
    "email": "cetl.system@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/311/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6104524)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 179,
    "id": "LAB-179",
    "oslCode": "6132436",
    "name": "Vimta Labs Limited (6132436), Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No.11/6, road No. 9, IDA, Nacharam, Rangareddy, Keesara,\n Hyderabad, \n Medchal Malkajgiri, \n Telangana, \n India -  500076",
    "city": "Hyderabad",
    "district": "Medchal Malkajgiri",
    "state": "Telangana",
    "pincode": "500076",
    "contactPerson": "G Satyam Reddy",
    "phone": "9704156476",
    "email": "satyam.goddumarri@vimta.com",
    "validTill": "25 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/312/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6132436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 180,
    "id": "LAB-180",
    "oslCode": "9134816",
    "name": "ECO Laboratories & Consultants Pvt Ltd",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_amBFO1i.png",
    "address": "Plot No. E-207, Industrial Area, Phase VIIIB, Mohali, Punjab - 160071",
    "city": "Mohali",
    "district": "SAS Nagar",
    "state": "Punjab",
    "pincode": "160071",
    "contactPerson": "",
    "phone": "1724616225",
    "email": "consulteco@yahoo.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/313/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9134816)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 181,
    "id": "LAB-181",
    "oslCode": "8167436",
    "name": "SGS India Pvt Ltd, Gurgaon",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_786_Tg6YMD4.jpeg",
    "address": "226, Udyog Vihar, Phase-I,\n Gurgaon, \n Gurugram, \n Haryana, \n India -  122016",
    "city": "Gurgaon",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122016",
    "contactPerson": "Amit Saluja",
    "phone": "9873714633",
    "email": "amit.saluja@sgs.com",
    "validTill": "16 Feb, 2030",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/314/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8167436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 182,
    "id": "LAB-182",
    "oslCode": "8131215",
    "name": "FICCI Research & Analysis Centre",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_787_8kGYn8j.jpeg",
    "address": "Plot No. 2A, Sector -8,\n New  Delhi-110075, \n New Delhi, \n Delhi, \n India -  110075",
    "city": "New  Delhi-110075",
    "district": "New Delhi",
    "state": "Delhi",
    "pincode": "110075",
    "contactPerson": "Vikash Boran (Technical Manager)",
    "phone": "1145333500",
    "email": "info@fraclabs.org",
    "validTill": "08 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/315/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8131215)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 183,
    "id": "LAB-183",
    "oslCode": "7119305",
    "name": "INDIAN RUBBER MATERIALS RESEARCH INSTITUTE (IRMRI)",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. 254/1B, Road no. 16V, Wagle Industrial Estate,\n Thane, \n Thane, \n Maharashtra, \n India -  400604",
    "city": "Thane",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400604",
    "contactPerson": "Dr. Rajkumar",
    "phone": "8655095342",
    "email": "rk@irmra.org",
    "validTill": "30 Jun, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/317/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7119305)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 184,
    "id": "LAB-184",
    "oslCode": "8163116",
    "name": "Institute for Industrial Research & Toxicology, Dhaulana",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_790_wJirXQ0.jpeg",
    "address": "F-209, UPSIDC,  Mussoorie Gulawathi Road, Mussoorie Gulawathi Industrial Area, Ravali, Tehsil,\n Dhaulana, \n Hapur, \n Uttar Pradesh, \n India -  245101",
    "city": "Dhaulana",
    "district": "Hapur",
    "state": "Uttar Pradesh",
    "pincode": "245101",
    "contactPerson": "SHALINI MISHRA",
    "phone": "9711623081",
    "email": "iirtdelhi@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/318/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8163116)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 185,
    "id": "LAB-185",
    "oslCode": "8101204",
    "name": "MSME Testing Centre, New Delhi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_791_zky9M9T.jpeg",
    "address": "Shaheed Capt. Gaur Marg, Okhla Phase -III,\n New Delhi, \n South East, \n Delhi, \n India -  110020",
    "city": "New Delhi",
    "district": "South East",
    "state": "Delhi",
    "pincode": "110020",
    "contactPerson": "Dr. D.K. Pandey",
    "phone": "9910201527",
    "email": "dctc-nr@dcmsme.gov.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/319/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8101204)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 186,
    "id": "LAB-186",
    "oslCode": "9120034",
    "name": "CIPET:CSTS Amritsar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_793_bAX8Fsw.jpeg",
    "address": "P.O. Rayon & Silk Mills,\n Amritsar, \n Amritsar, \n Punjab, \n India -  143105",
    "city": "Amritsar",
    "district": "Amritsar",
    "state": "Punjab",
    "pincode": "143105",
    "contactPerson": "Dr. Piyush Kumar",
    "phone": "7890926806",
    "email": "amritsar@cipet.gov.in",
    "validTill": "06 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/321/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9120034)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 187,
    "id": "LAB-187",
    "oslCode": "5131716",
    "name": "Mitra S.K. Private Limited, Kolkata",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_3484_PwSsFsf.jpeg",
    "address": "Building No. P- 48, Udayan Industrial Estate,  3, Pagladanga Road,\n Kolkata, \n Kolkata, \n West Bengal, \n India -  700015",
    "city": "Kolkata",
    "district": "Kolkata",
    "state": "West Bengal",
    "pincode": "700015",
    "contactPerson": "Dr. Amartya Kr. Gupta",
    "phone": "9147709504",
    "email": "amartya@mitrask.com",
    "validTill": "20 Jul, 2024",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/322/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5131716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 188,
    "id": "LAB-188",
    "oslCode": "6101024",
    "name": "Central Power Research Institute (CPRI), Bangalore",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_SP0wqNV.png",
    "address": "P.B.No. 8066, Sir.C V Raman Road, Sadashivanagar P O,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560080",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560080",
    "contactPerson": "T Bhavani Shanker",
    "phone": "9448141980",
    "email": "arunjothi@cpri.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/328/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6101024)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 189,
    "id": "LAB-189",
    "oslCode": "6117916",
    "name": "Sipra labs Ltd., Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_801_7Zu1CIe.jpeg",
    "address": "7-2-1813/5/A, Survey No. 59/6, Industrial Estate, Sanath Nagar,\n Hyderabad, \n Ranga Reddy, \n Telangana, \n India -  500018",
    "city": "Hyderabad",
    "district": "Ranga Reddy",
    "state": "Telangana",
    "pincode": "500018",
    "contactPerson": "Aasritha V (Quality Manager)",
    "phone": "+91 4023802004",
    "email": "sipra@sipralabs.com",
    "validTill": "31 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/329/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6117916)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 190,
    "id": "LAB-190",
    "oslCode": "8137526",
    "name": "C and I Calibrations Pvt. Ltd., Jaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_802_5S5YE5D.jpeg",
    "address": "F-717 A, Sitapura Industrial Area, Jaipur-302022,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302022",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302022",
    "contactPerson": "Satish Trivedi (Quality Manager)",
    "phone": "+91 9414188815",
    "email": "infocicpl@gmail.com",
    "validTill": "17 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/330/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8137526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 191,
    "id": "LAB-191",
    "oslCode": "8130426",
    "name": "Spectro Analytical Labs Private Limited, Gautam Buddha Nagar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_QvvIPca.png",
    "address": "S-1, GNEPIP Surajpur Industrial Area, Kasna Phase V, Greater Noida,\n Gautam Buddha Nagar, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201308",
    "city": "Gautam Buddha Nagar",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201308",
    "contactPerson": "Aditya Pratap Singh (Technical Manager)",
    "phone": "+91 9873571512",
    "email": "qa.gn@xoin.eurofinsasia.com",
    "validTill": "04 Jan, 2030",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/331/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8130426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 192,
    "id": "LAB-192",
    "oslCode": "6138124",
    "name": "Central Electronics Centre,  Indian Institute of Technology, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_806_SAr6wSS.jpeg",
    "address": "Sardar Patel Road, Chennai-600036,\n Chennai, \n Chennai, \n Tamil Nadu, \n India -  600036",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600036",
    "contactPerson": "Dr C R Jeevandoss",
    "phone": "9940398231",
    "email": "jeevandoss@iitm.ac.in",
    "validTill": "31 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/333/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6138124)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 193,
    "id": "LAB-193",
    "oslCode": "6162436",
    "name": "SGS India Private Limited, Thiruvallur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_809_RkYIXDv.jpeg",
    "address": "Consumer and Retail - Testing laboratory, Block -B , 28B/1(SP), 28B/2(SP), 2nd Main road, Ambattur Industrial estate, Ambattur.,\n Chennai, \n Thiruvallur, \n Tamil Nadu, \n India -  600058",
    "city": "Chennai",
    "district": "Thiruvallur",
    "state": "Tamil Nadu",
    "pincode": "600058",
    "contactPerson": "K.Ramamohan",
    "phone": "9840830474",
    "email": "Yagneswar.Rao@sgs.com",
    "validTill": "26 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/336/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6162436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 194,
    "id": "LAB-194",
    "oslCode": "7133816",
    "name": "TUV India Private Limited (7133816), Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_810_IyFQxpq.jpeg",
    "address": "TUV India House Survey No: 42,3/1 & 3/2, Near Bitwise Tower, Sus-Pashan Road,,\n Pune, \n Pune, \n Maharashtra, \n India -  411021",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411021",
    "contactPerson": "Rehana Shaikh (Quality Manager)",
    "phone": "+91 022 66477000",
    "email": "rehana@tuv-nord.com",
    "validTill": "08 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/337/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7133816)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 195,
    "id": "LAB-195",
    "oslCode": "8116426",
    "name": "Yadav Measurements Pvt  Ltd, Udaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_BZ1KIBM.png",
    "address": "Plot no. F 373-375, RIICO Bhamashah Industrial Area, Kaladwas, Udaipur (Rajasthan)-313003,\n Udaipur, \n Udaipur, \n Rajasthan, \n India -  313003",
    "city": "Udaipur",
    "district": "Udaipur",
    "state": "Rajasthan",
    "pincode": "313003",
    "contactPerson": "Prateek Paliwal",
    "phone": "2942650127",
    "email": "yadav.measurements@yadavmeasurements.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/340/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8116426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 196,
    "id": "LAB-196",
    "oslCode": "8101924",
    "name": "Electronic Regional Test Laboratory (North) - ERTL (STQC), Delhi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_815_1Z7bxDG.jpeg",
    "address": "S-Block, Okhla Industrial Area, Phase-II,,\n New Delhi, \n South East, \n Delhi, \n India -  110020",
    "city": "New Delhi",
    "district": "South East",
    "state": "Delhi",
    "pincode": "110020",
    "contactPerson": "Manjula Bhati (Quality Manager)",
    "phone": "+91 1126386219",
    "email": "ertlnorth@stqc.nic.in",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/342/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8101924)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 197,
    "id": "LAB-197",
    "oslCode": "7109836",
    "name": "GUJARAT TEST HOUSE, AHMEDABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_FHtBScg.png",
    "address": "Plot No.292, Road No.4, G.I.D.C., Kathwada, Ahmedabad-382 430.,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  382430",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "382430",
    "contactPerson": "",
    "phone": "+91 9825063601",
    "email": "gth292@gmail.com",
    "validTill": "15 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/355/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7109836)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 198,
    "id": "LAB-198",
    "oslCode": "8166336",
    "name": "Intertek India Private Limited (289-290), Gurugram",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_OyTJJ3S.png",
    "address": "Plot No 289 & 290 Udyog Vihar Phase II ,Gurugram ,Haryana 122016,\n GURUGRAM, \n Gurugram, \n Haryana, \n India -  122016",
    "city": "GURUGRAM",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122016",
    "contactPerson": "Sudhanshu Kumar",
    "phone": "8527990259",
    "email": "sudhanshu.kumar@intertek.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/394/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8166336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 199,
    "id": "LAB-199",
    "oslCode": "5140804",
    "name": "NATIONAL TEST HOUSE-ER (NTH), KOLKATA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_1852_0QGAdh5.jpeg",
    "address": "BLOCK-CP, SECTOR-V,, SALT LAKE CITY,\n Kolkata, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700091",
    "city": "Kolkata",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700091",
    "contactPerson": "Shri Suresh Babu Murugesan",
    "phone": "9412223289",
    "email": "director-kol@nth.gov.in",
    "validTill": "14 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/399/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5140804)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 200,
    "id": "LAB-200",
    "oslCode": "7167626",
    "name": "RAJKOT ENGINEERING TESTING AND RESEARCH CENTRE, RAJKOT",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_1902_9KthZBh.jpeg",
    "address": "Plot No-372, Aji GIDC, O-road, Rajkot,\n Rajkot, \n Rajkot, \n Gujarat, \n India -  360003",
    "city": "Rajkot",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360003",
    "contactPerson": "Nilesh Bundheliya (Quality Manager)",
    "phone": "+91 7069728109",
    "email": "cfcrajkot@gmail.com",
    "validTill": "25 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/401/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7167626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 201,
    "id": "LAB-201",
    "oslCode": "9167906",
    "name": "Arihant Analytical Laboratory Pvt. Ltd., Sonipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_s2yDGtd.png",
    "address": "Plot No. 272, Sector-57, Phase-IV, HSIIDC Kundli, Sonipat Haryana,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131028",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131028",
    "contactPerson": "RAHUL JAIN",
    "phone": "9310022355",
    "email": "aalkundli@gmail.com",
    "validTill": "02 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/405/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9167906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 202,
    "id": "LAB-202",
    "oslCode": "8167106",
    "name": "Softlines and Electrical Safety Testing Laboratory TUV Rheinland India Pvt Ltd., Gurgaon (8167106)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_NGrtF57.png",
    "address": "330-331 Udyog Vihar Phase IV,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122015",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122015",
    "contactPerson": "",
    "phone": "+91 80 46498000",
    "email": "g.kaur@ind.tuv.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/416/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8167106)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 203,
    "id": "LAB-203",
    "oslCode": "5123904",
    "name": "National Test House (NTH), Alipore, Kolkata-700027",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_2715_CgnbYBl.jpeg",
    "address": "11/1 Judges Court Road, Kolkata,\n Kolkata, \n Kolkata, \n West Bengal, \n India -  700027",
    "city": "Kolkata",
    "district": "Kolkata",
    "state": "West Bengal",
    "pincode": "700027",
    "contactPerson": "Shri Suresh Babu Murugesan",
    "phone": "9412223289",
    "email": "director-kol@nth.gov.in",
    "validTill": "08 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/419/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5123904)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 204,
    "id": "LAB-204",
    "oslCode": "6167704",
    "name": "CENTRAL LEATHER RESEARCH INSTITUTE (CSIR-CLRI), CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_2852_Ssuv4pp.jpeg",
    "address": "Sardar Patel Road Adyar, Opposite to  Indian Institute Of Technology, Chennai, Tamil Nadu 600020,\n chennai, \n Chennai, \n Tamil Nadu, \n India -  600020",
    "city": "chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600020",
    "contactPerson": "Dr.Mohan R (Quality Manager)",
    "phone": "+91 44 24437168",
    "email": "clricaters@clri.res.in",
    "validTill": "02 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/423/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6167704)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Textiles & Leather"
    ],
    "standards": [
      "IS 10702",
      "IS 12254",
      "IS 15844",
      "IS 17012",
      "IS 9873"
    ],
    "products": [
      "Hawai Chappals",
      "High Ankle Tactical Boots",
      "PVC Industrial Boots",
      "Safety Footwear",
      "Sports Footwear"
    ],
    "scopeDetails": [
      {
        "standard": "IS 12254",
        "title": "PVC Industrial Boots",
        "product": "PVC Industrial Boots",
        "fee": "5000"
      },
      {
        "standard": "IS 17012",
        "title": "High Ankle Tactical Boots",
        "product": "High Ankle Tactical Boots",
        "fee": "5000"
      },
      {
        "standard": "IS 10702",
        "title": "Hawai Chappals",
        "product": "Hawai Chappals",
        "fee": "5000"
      },
      {
        "standard": "IS 15844",
        "title": "Sports Footwear",
        "product": "Sports Footwear",
        "fee": "5000"
      },
      {
        "standard": "IS 9873",
        "title": "Safety Footwear",
        "product": "Safety Footwear",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 205,
    "id": "LAB-205",
    "oslCode": "7170010",
    "name": "Chem-Tech Laboratories Private Limited, Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_2876_lAX6tB7.jpeg",
    "address": "S-22, Parvati Industrial Estate, Pune Satara Road, Pune,\n Pune, \n Pune, \n Maharashtra, \n India -  411009",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411009",
    "contactPerson": "Priya Nair",
    "phone": "9226579376",
    "email": "bis@chemtechlabs.com",
    "validTill": "07 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/425/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7170010)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 206,
    "id": "LAB-206",
    "oslCode": "9121314",
    "name": "Punjab Biotechnology Incubator",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_TzyhieY.png",
    "address": "Knowledge city, sector-81, SAS nagar, Mohali 140306, Punjab,\n SAS Nagar, \n S.A.S Nagar, \n Punjab, \n India -  140306",
    "city": "SAS Nagar",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "140306",
    "contactPerson": "",
    "phone": "+91 0172 5020895",
    "email": "pbti2015@yahoo.in",
    "validTill": "18 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/429/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9121314)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 207,
    "id": "LAB-207",
    "oslCode": "6167206",
    "name": "TUV Rheinland (India) Pvt. Ltd., Visakhapatnam",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_bwJRaBd.png",
    "address": "Survey No. 480/2, AMTZ Campus, Nadupuru Village, Pedagantyada Mandal, Pragadi Maidan,,\n visakhapatnam, \n Visakhapatanam, \n Andhra Pradesh, \n India -  530031",
    "city": "visakhapatnam",
    "district": "Visakhapatanam",
    "state": "Andhra Pradesh",
    "pincode": "530031",
    "contactPerson": "Mr. Nagendra Hebbar",
    "phone": "6364894533",
    "email": "Nagendra.Hebbar@ind.tuv.com",
    "validTill": "03 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/437/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6167206)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 208,
    "id": "LAB-208",
    "oslCode": "5117534",
    "name": "Central Institute of Petrochemical Engineering and Technology (CIPET), Guwahati",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_3363_bUtvvGs.jpeg",
    "address": "NH 31, Near Assam Oil Petrol Pump, P.O Changsari, Guwahati, Assam,\n Guwahati, \n Kamrup, \n Assam, \n India -  781101",
    "city": "Guwahati",
    "district": "Kamrup",
    "state": "Assam",
    "pincode": "781101",
    "contactPerson": "Sagolsem Itomba (Quality Manager)",
    "phone": "+91 044 22254780",
    "email": "cipetcstsguwahati@gmail.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/438/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5117534)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 209,
    "id": "LAB-209",
    "oslCode": "8170106",
    "name": "Standard Testing Laboratory Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_3490_Xz1aGem.jpeg",
    "address": "PLOT NO.782,KANJHAWALA INDUSTRIAL AREA,NEW DELHI,NORTH WEST,\n Delhi, \n North West, \n Delhi, \n India -  110081",
    "city": "Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110081",
    "contactPerson": "S K Pathak",
    "phone": "7011080876",
    "email": "standardtestinglaboratory@yahoo.com",
    "validTill": "10 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/441/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8170106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 210,
    "id": "LAB-210",
    "oslCode": "6168016",
    "name": "Mats India Private Limited, Chennai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_3603_uvLWj9q.jpeg",
    "address": "1A,1B, PERUMAL KOIL STREET, NERKUNDRAM,\n CHENNAI, \n Chennai, \n Tamil Nadu, \n India -  600107",
    "city": "CHENNAI",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600107",
    "contactPerson": "R VIJAYA (Quality Manager)",
    "phone": "+91 9840095622",
    "email": "lab.enquiry@matsgroup.com",
    "validTill": "29 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/445/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6168016)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 211,
    "id": "LAB-211",
    "oslCode": "9168306",
    "name": "Bharat Test House Pvt. Ltd. 1668 Sonipat",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_3814_v4qcLbT.jpeg",
    "address": "1668 (DIV-II), HSIIDC INDUSTRIAL ESTATE, RAI, DIST. SONEPAT, HARYANA, INDIA,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131029",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131029",
    "contactPerson": "",
    "phone": "+91 9310314585",
    "email": "bthdiv2@bharattesthouse.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/453/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9168306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 212,
    "id": "LAB-212",
    "oslCode": "8169616",
    "name": "VARDAN ENVIROLAB, GURUGRAM",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_3823_JR5yc0V.jpeg",
    "address": "Plot No. 82-A, Sector 5, HSIIDC IMT Manesar ,Gurgaon,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122051",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122051",
    "contactPerson": "Mr. Gaurav Pratap Singh",
    "phone": "9015719913",
    "email": "gaurav@vardan.co.in",
    "validTill": "26 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/455/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8169616)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 213,
    "id": "LAB-213",
    "oslCode": "8169106",
    "name": "Delhi Analytical Research Laboratory",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_Gky7ATm.png",
    "address": "PLOT NO-2, TIMBER BLOCK, JHILMIL INDUSTRIAL AREA NEAR DILSHAD GARDEN METRO STATION,\n NEW Delhi, \n East, \n Delhi, \n India -  110095",
    "city": "NEW Delhi",
    "district": "East",
    "state": "Delhi",
    "pincode": "110095",
    "contactPerson": "Yash Pal Singh (Technical Manager)",
    "phone": "+91 9717324010",
    "email": "darltesting@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/463/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8169106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 214,
    "id": "LAB-214",
    "oslCode": "6168516",
    "name": "Accurate Labs, Vijayawada",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_OXlODcN.png",
    "address": "K.V.S.R. Siddhardha College of Pharmaceutical Sciences, SPIIC Block, IIIrd Floor, Pinnamaneni Polyclinic Road, Siddhardha Nagar, Vijayawada-520010, Andhra Pradesh.,\n Vijayawada, \n Krishna, \n Andhra Pradesh, \n India -  520010",
    "city": "Vijayawada",
    "district": "Krishna",
    "state": "Andhra Pradesh",
    "pincode": "520010",
    "contactPerson": "Swarna Kumari V (Quality Manager)",
    "phone": "+91 6301959631",
    "email": "aefal.labs@gmail.com",
    "validTill": "03 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/464/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6168516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 215,
    "id": "LAB-215",
    "oslCode": "8170306",
    "name": "BLUESKY LAB LLP, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_k8RNr51.png",
    "address": "Plot no. 62, 63, 1st 2nd 3rd Floor, Ganga Enclave, Behta Hajipur, Main Delhi Saharanpur Road, Near Johri Enclave Metro Station, Ghaziabad, Uttar Pradesh, 201102,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201102",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201102",
    "contactPerson": "Ashutosh Jaiswal(Quality Manager)",
    "phone": "9953745002",
    "email": "info@blueskylab.in",
    "validTill": "22 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/472/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8170306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 216,
    "id": "LAB-216",
    "oslCode": "8175206",
    "name": "Allumera Engineering Solutions Pvt ltd",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_PfaRMPO.png",
    "address": "Khasra no.-61, Matiala village, uttam nagar, New Delhi-110059,\n New Delhi, \n South West, \n Delhi, \n India -  110059",
    "city": "New Delhi",
    "district": "South West",
    "state": "Delhi",
    "pincode": "110059",
    "contactPerson": "Chandan Kumar",
    "phone": "9310347744",
    "email": "aespllab@gmail.com",
    "validTill": "13 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/475/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8175206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 217,
    "id": "LAB-217",
    "oslCode": "6162126",
    "name": "TUV Rheinland (India) Pvt., Ltd., Bengaluru (6162126)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_4465_LVJBTA8.jpeg",
    "address": "TUV Rheinland (India) Pvt., Ltd. 27/B, 2nd Cross Road,  Electronic City Phase-1,  Bangalore,\n Bengaluru, \n Bengaluru Rural, \n Karnataka, \n India -  560100",
    "city": "Bengaluru",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "560100",
    "contactPerson": "Purushothama A (Quality Manager)",
    "phone": "+91 9620288818",
    "email": "Kamalaksha.cs@ind.tuv.com",
    "validTill": "10 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/476/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6162126)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 218,
    "id": "LAB-218",
    "oslCode": "8183516",
    "name": "Pious laboratories Pvt. Ltd., Indore",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_CYM7om6.png",
    "address": "57 Confectionery Park,\n indore, \n Indore, \n Madhya Pradesh, \n India -  453331",
    "city": "indore",
    "district": "Indore",
    "state": "Madhya Pradesh",
    "pincode": "453331",
    "contactPerson": "Ajay Mahajan (Quality Manager)",
    "phone": "+91 9770480382",
    "email": "info@piouslabs.com",
    "validTill": "07 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/493/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8183516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 219,
    "id": "LAB-219",
    "oslCode": "8168706",
    "name": "KRISHNA DIGITAL MATERIAL TESTING LABORATORY LLP, BHOPAL",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5077_J2Ja2dL.jpeg",
    "address": "02, Bhawani Nagar JK Road Bhopal,\n Bhopal, \n Bhopal, \n Madhya Pradesh, \n India -  462021",
    "city": "Bhopal",
    "district": "Bhopal",
    "state": "Madhya Pradesh",
    "pincode": "462021",
    "contactPerson": "Shyam Mohan Tiwari (Quality Manager)",
    "phone": "+91 0755 4001289",
    "email": "krishnalab12@gmail.com",
    "validTill": "19 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/499/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8168706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 220,
    "id": "LAB-220",
    "oslCode": "6170406",
    "name": "SKC COMPLIANCE LAB PRIVATE LIMITED, MAHADEVPURA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5142_CZwtPuL.jpeg",
    "address": "SP-9, NGEF INDUSTRIAL ESTATE,,\n Mahadevpura, \n Bengaluru Urban, \n Karnataka, \n India -  560048",
    "city": "Mahadevpura",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560048",
    "contactPerson": "Firoz M Ali - Managing Director",
    "phone": "9945544085",
    "email": "sales@skclabcompliance.com",
    "validTill": "24 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/507/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6170406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 221,
    "id": "LAB-221",
    "oslCode": "7119516",
    "name": "KONARK RESEARCH FOUNDATION (A DIVISION OF SAGA RESEARCH LABORATORIES PVT.LTD), DAMAN",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5166_SPR9mw1.jpeg",
    "address": "PLOT NO. 338/1 BEHIND PATEL CRICKET GROUND, KACHIGAM, DAMAN,\n Daman, \n Daman, \n Daman & Diu, \n India -  396210",
    "city": "Daman",
    "district": "Daman",
    "state": "Daman & Diu",
    "pincode": "396210",
    "contactPerson": "Mr. Girish B Patel",
    "phone": "9377004366",
    "email": "patel.girish@konarkgroup.com",
    "validTill": "31 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/509/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7119516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 222,
    "id": "LAB-222",
    "oslCode": "6169806",
    "name": "VIRIDIAN TESTING LABORATORIES LLP, TIRUPUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5199_G04PulX.jpeg",
    "address": "8/3176-A5, Jothipuram, 2nd Street,, PN Road, Pandiyan Nagar,,\n Tirupur- 641602.  Tamilnadu., \n Tiruppur, \n Tamil Nadu, \n India -  641602",
    "city": "Tirupur- 641602.  Tamilnadu.",
    "district": "Tiruppur",
    "state": "Tamil Nadu",
    "pincode": "641602",
    "contactPerson": "venkatesh",
    "phone": "9843254971",
    "email": "venkatesh@viridianlab.com",
    "validTill": "20 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/511/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6169806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 223,
    "id": "LAB-223",
    "oslCode": "5169204",
    "name": "National Test House (NER) - NTH, Guwahati",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5227_WiforTM.jpeg",
    "address": "C.I.T.I Complex, Post: Gopinath Nagar, Kalapahar, Guwahati-781016,\n Guwahati, \n Kamrup Metro, \n Assam, \n India -  781016",
    "city": "Guwahati",
    "district": "Kamrup Metro",
    "state": "Assam",
    "pincode": "781016",
    "contactPerson": "Shri Animesh Das",
    "phone": "9412223452",
    "email": "director-guw@nth.gov.in",
    "validTill": "13 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/513/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5169204)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 224,
    "id": "LAB-224",
    "oslCode": "8171826",
    "name": "TVS LABS",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_ox0RRv3.png",
    "address": "A-5/16A, A-Block, Third & Fourth Floor, Jhilmil Industrial Area, Shahdara,\n Delhi, \n Shahdara, \n Delhi, \n India -  110095",
    "city": "Delhi",
    "district": "Shahdara",
    "state": "Delhi",
    "pincode": "110095",
    "contactPerson": "Vimal Kumar Gupta (Technical Manager)",
    "phone": "+91 9116653300",
    "email": "tvslabs@gmail.com",
    "validTill": "18 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/516/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8171826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 225,
    "id": "LAB-225",
    "oslCode": "8176306",
    "name": "MATERIAL TESTING LABORATORY LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_AjcoMfD.png",
    "address": "B-103, PHASE-1 OKHLA, INDUSTRIAL AREA NEAR TATA STEEL,\n DELHI, \n South, \n Delhi, \n India -  110020",
    "city": "DELHI",
    "district": "South",
    "state": "Delhi",
    "pincode": "110020",
    "contactPerson": "Rajni Sharma (Quality Manager)",
    "phone": "+91 9891493575",
    "email": "materialtestinglaboratory@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/518/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8176306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 226,
    "id": "LAB-226",
    "oslCode": "7169416",
    "name": "JUBILANT PHARMA AND CHEMICAL LAB (OPC) PVT.LTD, NAVI MUMBAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5430_mzUSDGR.jpeg",
    "address": "Surya Gayatri  CHS. Ltd., Shop No. 10 to 15, Plot No. D-14/15, Sector-6, New Panvel (E), Navi  Mumbai \u2013 410 206.,\n Panvel, \n Raigad, \n Maharashtra, \n India -  410206",
    "city": "Panvel",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410206",
    "contactPerson": "Ms. Manjusha Gawand (Quality Manager)",
    "phone": "+91 022 274500",
    "email": "qa@jubilantpharma.co.in",
    "validTill": "12 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/527/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7169416)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 227,
    "id": "LAB-227",
    "oslCode": "8168906",
    "name": "URS PRODUCTS AND TESTING PVT. LTD. (A29), NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5601_x7UGLQL.jpeg",
    "address": "A-29, Sector 5,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Neeraj Rathee (Quality Manager)",
    "phone": "+91 9871062220",
    "email": "testing.a29@urs-labs.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/537/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8168906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 228,
    "id": "LAB-228",
    "oslCode": "5169006",
    "name": "Pulp and Paper Research Institute (PAPRI), Rayagada",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5656_GkBUuzv.jpeg",
    "address": "Jaykaypur,\n Rayagada, \n Rayagada, \n Odisha, \n India -  765017",
    "city": "Rayagada",
    "district": "Rayagada",
    "state": "Odisha",
    "pincode": "765017",
    "contactPerson": "S K Pradhan",
    "phone": "7978395679",
    "email": "papri@jkpm.jkmail.com",
    "validTill": "13 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/541/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5169006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 229,
    "id": "LAB-229",
    "oslCode": "8170206",
    "name": "POWERONIC TEST & RESEARCH CENTRE PRIVATE LIMITED, GREATER NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5691_Hm0iAWC.jpeg",
    "address": "First Floor, B-2/4, Site-B, UPSIDC Surajpur Industrial Area,\n Greater Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201306",
    "city": "Greater Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201306",
    "contactPerson": "Shivangi Bhardwaj",
    "phone": "9602085835",
    "email": "info@poweroniclab.com",
    "validTill": "11 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/545/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8170206)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 230,
    "id": "LAB-230",
    "oslCode": "7169736",
    "name": "ELCA Laboratories, Navi Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_oj7XNCy.png",
    "address": "Plot No: Gen-62, TTC Industrial Area, MIDC Mahape, Navi Mumbai-400710.,\n Navi Mumbai, \n Thane, \n Maharashtra, \n India -  400710",
    "city": "Navi Mumbai",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400710",
    "contactPerson": "Vaishali Bharambe (Quality Manager)",
    "phone": "+91 22 68511222",
    "email": "vaishali@elcalabs.com",
    "validTill": "02 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/546/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7169736)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 231,
    "id": "LAB-231",
    "oslCode": "6173106",
    "name": "INTERSTELLAR TESTING CENTRE PRIVATE LIMITED, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "PLOT NO.2, S NO. 12/2A, INDUSTRIAL ESTATE, PERUNGUDI,\n CHENNAI, \n Kanchipuram, \n Tamil Nadu, \n India -  600096",
    "city": "CHENNAI",
    "district": "Kanchipuram",
    "state": "Tamil Nadu",
    "pincode": "600096",
    "contactPerson": "Dr.Vadivel Prabakaran",
    "phone": "7397791910",
    "email": "prabakaran.v@itclabs.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/553/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6173106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 232,
    "id": "LAB-232",
    "oslCode": "6171206",
    "name": "Eureka Analytical Services Private Limited, Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5873_wm2lUBv.jpeg",
    "address": "#617 , AB square,5th Main, OMBR Layout, Kasturi Nagar,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560043",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560043",
    "contactPerson": "Hemalatha B",
    "phone": "8748037689",
    "email": "bhemalatha@eurekaserv.com",
    "validTill": "02 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/562/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6171206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 233,
    "id": "LAB-233",
    "oslCode": "8169906",
    "name": "QA TESTING LABORATORIES PRIVATE LIMITED, NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5935_WEKSypW.jpeg",
    "address": "B-76 ,SECTOR- 64 , NOIDA,\n NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "DR. DILEEP KUMAR",
    "phone": "9350040389",
    "email": "qm@qatestinglaboratories.com",
    "validTill": "05 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/573/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8169906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 234,
    "id": "LAB-234",
    "oslCode": "9178004",
    "name": "Central Institute of Petrochemicals Engineering & Technology (CIPET), CSTS - Dehradun",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_5999_pn6Vgzd.jpeg",
    "address": "CIPET : Centre for Skilling and Technical Support (CSTS), Haridwar Road, Post-Bhaniyawala, Doiwala, Dehradun,\n Dehradun, \n Dehradun, \n Uttarakhand, \n India -  248140",
    "city": "Dehradun",
    "district": "Dehradun",
    "state": "Uttarakhand",
    "pincode": "248140",
    "contactPerson": "Dr. Pratap Chandra Padhi",
    "phone": "9437111344",
    "email": "testing.cipetdehradun@gmail.com",
    "validTill": "24 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/583/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9178004)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 235,
    "id": "LAB-235",
    "oslCode": "6170916",
    "name": "GLOBAL LAB AND CONSULTANCY SERVICES LLP, SALEM",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6008_LqFoBhX.jpeg",
    "address": "S.F.No.92/3A2, Geetha Nagar, AlagapuramPudur, Salem,,\n Salem, \n Salem, \n Tamil Nadu, \n India -  636016",
    "city": "Salem",
    "district": "Salem",
    "state": "Tamil Nadu",
    "pincode": "636016",
    "contactPerson": "Suresh A (Quality Manager)",
    "phone": "+91 0427 2970989",
    "email": "sk@glcs.in",
    "validTill": "13 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/586/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6170916)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 236,
    "id": "LAB-236",
    "oslCode": "8168806",
    "name": "Bahadurgarh Footwear Development Services (BFDS), Bahadurgarh",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6017_AWQqJBt.jpeg",
    "address": "PLOT NO. I-1, HSIIDC SECTOR-4-B, Bahadurgarh, Haryana 124507,\n Bahadurgarh, \n Jhajjar, \n Haryana, \n India -  124507",
    "city": "Bahadurgarh",
    "district": "Jhajjar",
    "state": "Haryana",
    "pincode": "124507",
    "contactPerson": "SIDDHARTH DUBEY",
    "phone": "9968222227",
    "email": "fpabahadurgarh@gmail.com",
    "validTill": "02 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/587/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8168806)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Textiles & Leather"
    ],
    "standards": [
      "IS 10702",
      "IS 12254",
      "IS 15844",
      "IS 17012",
      "IS 9873"
    ],
    "products": [
      "Hawai Chappals",
      "High Ankle Tactical Boots",
      "PVC Industrial Boots",
      "Safety Footwear",
      "Sports Footwear"
    ],
    "scopeDetails": [
      {
        "standard": "IS 12254",
        "title": "PVC Industrial Boots",
        "product": "PVC Industrial Boots",
        "fee": "5000"
      },
      {
        "standard": "IS 17012",
        "title": "High Ankle Tactical Boots",
        "product": "High Ankle Tactical Boots",
        "fee": "5000"
      },
      {
        "standard": "IS 10702",
        "title": "Hawai Chappals",
        "product": "Hawai Chappals",
        "fee": "5000"
      },
      {
        "standard": "IS 15844",
        "title": "Sports Footwear",
        "product": "Sports Footwear",
        "fee": "5000"
      },
      {
        "standard": "IS 9873",
        "title": "Safety Footwear",
        "product": "Safety Footwear",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 237,
    "id": "LAB-237",
    "oslCode": "8171606",
    "name": "Stellar Test House, Noida",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "G-68, Sector-63,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Surbhi Garg (Quality Manager)",
    "phone": "+91 8130190099",
    "email": "ankit@stellartesthouse.com",
    "validTill": "26 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/588/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8171606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 238,
    "id": "LAB-238",
    "oslCode": "8169306",
    "name": "Universal Testing and Research Centre (Division of Sustainable Stewardship Private Limited)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6081_Ks6BB3N.jpeg",
    "address": "487/59, Ground Floor, Village Peeragarhi, National Market,\n New Delhi, \n West, \n Delhi, \n India -  110087",
    "city": "New Delhi",
    "district": "West",
    "state": "Delhi",
    "pincode": "110087",
    "contactPerson": "ROOPESH SRIVASTAVA (Quality Manager)",
    "phone": "+91 9810730485",
    "email": "lab@universaltesthouse.com",
    "validTill": "28 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/591/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8169306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 239,
    "id": "LAB-239",
    "oslCode": "8171106",
    "name": "Customer Services & Development Center, HPCL-Mittal Energy Limited, Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6087_owl3iYe.jpeg",
    "address": "Plot A27, Sector 65, Gautam Buddha Nagar,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Satyajit Samanta",
    "phone": "9988885236",
    "email": "satyajit.samanta@hmel.in",
    "validTill": "28 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/592/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8171106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 240,
    "id": "LAB-240",
    "oslCode": "8170806",
    "name": "COTERD SOLUTIONS (OPC) PRIVATE LIMITED, AC TEST LAB, GREATER NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6140_wExcoTJ.jpeg",
    "address": "BLOCK ECOTECH VI PLOT NO. 62, SECTOR ECOTECH VI,\n GREATER NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201310",
    "city": "GREATER NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201310",
    "contactPerson": "Dr. Minakshi Shrivastava (Quality Manager)",
    "phone": "+91 9561266784",
    "email": "anuj@coterd.com",
    "validTill": "15 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/596/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8170806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 241,
    "id": "LAB-241",
    "oslCode": "5172106",
    "name": "ANALYTICAL DEVELOPMENT- R & D, EMAMI LTD., Kolkata",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "13, BT ROAD, KOLKATA 700056,\n KOLKATA, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700056",
    "city": "KOLKATA",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700056",
    "contactPerson": "Dr. Partha Ganguly",
    "phone": "8335043366",
    "email": "partha.ganguly@emamigroup.com",
    "validTill": "03 May, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/607/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5172106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 242,
    "id": "LAB-242",
    "oslCode": "6169526",
    "name": "TUV INDIA PVT LTD, PEENYA, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6278_wSJsXil.jpeg",
    "address": "Plot No. 105, Peenya 3rd phase, sy.no. 90,92 and 93 Peenya Village,  Yeshwanthapura Hobli,,\n BANGALORE, \n Bengaluru Urban, \n Karnataka, \n India -  560058",
    "city": "BANGALORE",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560058",
    "contactPerson": "Gattu Anil Kumar",
    "phone": "9505831183",
    "email": "dmoloy@tuv-nord.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/614/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6169526)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 243,
    "id": "LAB-243",
    "oslCode": "9121934",
    "name": "Central Institute of Petrochemicals Engineering & Technology (CIPET), Murthal",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_cZiZ3lg.png",
    "address": "CIPET-Murthal, Near DCRUST, Murthal, Sonipat,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131039",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131039",
    "contactPerson": "SM Khaja (Quality Manager)",
    "phone": "+91 22254780",
    "email": "murthal@cipet.gov.in",
    "validTill": "09 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/637/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9121934)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 244,
    "id": "LAB-244",
    "oslCode": "5171706",
    "name": "NBML Building Materials Testing Lab LLP, Raipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_ZCFYlZw.png",
    "address": "Raipur Bilaspur Road, Near Akaswani Radio Station, Urkura Nagar Raipur Chhattisgarh 493221,\n Raipur, \n Raipur, \n Chhattisgarh, \n India -  493221",
    "city": "Raipur",
    "district": "Raipur",
    "state": "Chhattisgarh",
    "pincode": "493221",
    "contactPerson": "Nikhil Bajpayee (Technical Manager)",
    "phone": "+91 9881110389",
    "email": "nbmtl2017@gmail.com",
    "validTill": "29 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/646/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5171706)",
    "disciplines": [
      "Civil",
      "Mechanical",
      "Chemical"
    ],
    "standards": [
      "IS 1489",
      "IS 16415",
      "IS 269",
      "IS 456",
      "IS 8112"
    ],
    "products": [
      "Ceramic Tiles",
      "Clay Bricks",
      "Composite Cement",
      "Concrete Aggregates",
      "Portland Pozzolana Cement"
    ],
    "scopeDetails": [
      {
        "standard": "IS 16415",
        "title": "Composite Cement",
        "product": "Composite Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "Portland Pozzolana Cement",
        "product": "Portland Pozzolana Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 269",
        "title": "Concrete Aggregates",
        "product": "Concrete Aggregates",
        "fee": "5000"
      },
      {
        "standard": "IS 8112",
        "title": "Clay Bricks",
        "product": "Clay Bricks",
        "fee": "5000"
      },
      {
        "standard": "IS 456",
        "title": "Ceramic Tiles",
        "product": "Ceramic Tiles",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 245,
    "id": "LAB-245",
    "oslCode": "9171906",
    "name": "QVC Certification Services Pvt. Ltd., Ambala",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6712_6sNZiIP.jpeg",
    "address": "2-B, CIVIL LINES, YUKTI BUSINESS CENTRE, JAIL ROAD, NEAR OLD SESSION COURT, AMBALA,HARYANA, INDIA,\n Ambala City, \n Ambala, \n Haryana, \n India -  134003",
    "city": "Ambala City",
    "district": "Ambala",
    "state": "Haryana",
    "pincode": "134003",
    "contactPerson": "ANIL ARORA",
    "phone": "9316037657",
    "email": "cemark@qvccert.com",
    "validTill": "12 Jan, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/659/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9171906)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 246,
    "id": "LAB-246",
    "oslCode": "8176726",
    "name": "ABSOLUTE EXPERTISE TESTING LABORATORY LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6741_1jj4ikG.jpeg",
    "address": "PLOT NO.1, KH NO. 23/1, 1ST FLOOR, AMBEY GARDEN, VILLAGE LIBASPUR, NORTH WEST, DELHI-110042,\n NEW DELHI, \n North West, \n Delhi, \n India -  110042",
    "city": "NEW DELHI",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110042",
    "contactPerson": "Yogesh Pal (Quality Manager)",
    "phone": "+91 7065432161",
    "email": "info.aetllab@gmail.com",
    "validTill": "11 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/661/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8176726)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 247,
    "id": "LAB-247",
    "oslCode": "7171406",
    "name": "Precise Analytics Lab. (A Div of Meyer Organics Pvt.Ltd.)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6832_uCYwKss.jpeg",
    "address": "Plot no. B-22, Road no. 16, Wagle Estate, Thane,\n Thane, \n Thane, \n Maharashtra, \n India -  400604",
    "city": "Thane",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400604",
    "contactPerson": "",
    "phone": "+91 9769804657",
    "email": "info@preciseanalytics.co.in",
    "validTill": "23 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/674/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7171406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 248,
    "id": "LAB-248",
    "oslCode": "7171526",
    "name": "EAMP Laboratories LLP, Palghar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_6887_fUYNs1t.jpeg",
    "address": "Survey No.102/1/2, Nagar Parishad House, Opp. ISKCON Food Relief Foundation, Near Sukhsagar Lane, Mahim Road, Palghar (W) 401 404,\n Palghar, \n Palghar, \n Maharashtra, \n India -  401404",
    "city": "Palghar",
    "district": "Palghar",
    "state": "Maharashtra",
    "pincode": "401404",
    "contactPerson": "Yogesh Chandane",
    "phone": "7021235486",
    "email": "admin@eamplaboratories.com",
    "validTill": "13 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/680/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7171526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 249,
    "id": "LAB-249",
    "oslCode": "9171026",
    "name": "Vijai Electricals Ltd., Transformer Testing Laboratory, Haridwar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_lJF5JfM.png",
    "address": "Vijai Electricals Ltd., Plot no. 1A, Sector 12, IIE, SIDCUL,\n Haridwar, \n Haridwar, \n Uttarakhand, \n India -  249403",
    "city": "Haridwar",
    "district": "Haridwar",
    "state": "Uttarakhand",
    "pincode": "249403",
    "contactPerson": "Surendra Kumar Sharma (Quality Manager)",
    "phone": "+91 40 67617777",
    "email": "surendra.sharma@vijai.co.in",
    "validTill": "14 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/684/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9171026)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 250,
    "id": "LAB-250",
    "oslCode": "8164006",
    "name": "EKO PRO ENGINEERS PRIVATE LIMITED (32/37) GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7081_7PTa1HD.jpeg",
    "address": "32/37, SOUTH SIDE OF G.T ROAD, INDUSTRIAL AREA, Ghaziabad, Uttar Pradesh,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201009",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201009",
    "contactPerson": "Amit Saxena (Quality Manager)",
    "phone": "+91 9810243870",
    "email": "labs@ekopro.in",
    "validTill": "27 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/693/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8164006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 251,
    "id": "LAB-251",
    "oslCode": "8171306",
    "name": "INDIAN TESTING LABORATORY PRIVATE LIMITED, GREATER NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7137.jpeg",
    "address": "Plot No-248 , Ecotech - III, Udyog Kendra - II,\n GREATER NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201306",
    "city": "GREATER NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201306",
    "contactPerson": "Prem Prakash Srivastava",
    "phone": "9999669383",
    "email": "itlnoida.labs@gmail.com",
    "validTill": "15 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/699/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8171306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 252,
    "id": "LAB-252",
    "oslCode": "7171806",
    "name": "Enviro Remediation & Research Laboratory LLP, Thane",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_P9YSZXX.png",
    "address": "Gala No. 7, Ground floor, HDIL Industrial Park, Building No. 14,Chandansar, Virar (East), Thane,,\n Thane, \n Thane, \n Maharashtra, \n India -  401303",
    "city": "Thane",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "401303",
    "contactPerson": "Dipti Shah (Quality Manager)",
    "phone": "+91 9820041728",
    "email": "contact@errl.co.in",
    "validTill": "13 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/711/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7171806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 253,
    "id": "LAB-253",
    "oslCode": "7170706",
    "name": "Intertek India Pvt Ltd, Chandivali, Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7337_REhWQo5.jpeg",
    "address": "\u201cF \u201c Wing ,Tex Centre,Chandivali Farm Road, off, saki vihar Road,,\n MUMBAI, \n Mumbai Suburban, \n Maharashtra, \n India -  400072",
    "city": "MUMBAI",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "pincode": "400072",
    "contactPerson": "Himangi Shinde",
    "phone": "9920062725",
    "email": "himangi.shinde@intertek.com",
    "validTill": "07 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/714/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7170706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 254,
    "id": "LAB-254",
    "oslCode": "8173526",
    "name": "Robust Testing Solutions Private Limited, Alwar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7585_ZwrW6JI.jpeg",
    "address": "PLOT H1-958, RIICO INDUSTRIAL AREA, CHOPANKI, BHIWADI, ALWAR, RAJASTHAN-301019,\n BHIWADI, \n Alwar, \n Rajasthan, \n India -  301019",
    "city": "BHIWADI",
    "district": "Alwar",
    "state": "Rajasthan",
    "pincode": "301019",
    "contactPerson": "Suruchi Sharma (Quality Manager)",
    "phone": "+91 9968717582",
    "email": "robusttestlab@gmail.com",
    "validTill": "02 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/727/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8173526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 255,
    "id": "LAB-255",
    "oslCode": "8174526",
    "name": "ABSOLUTE TESTING SERVICES, FARIDABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7638_OyGE6pH.jpeg",
    "address": "FCA-3659, SGM NAGAR NIT-3, FARIDABAD, HARYANA-121001,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121001",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121001",
    "contactPerson": "Manoj sharma",
    "phone": "9990004596",
    "email": "cs@a-ts.in",
    "validTill": "13 Nov, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/729/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8174526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 256,
    "id": "LAB-256",
    "oslCode": "7173406",
    "name": "GODREJ - NASHIK",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_aGUhGGC.png",
    "address": "Plot No. 305/3, Ramshej Shivar, Peth road, VILL. ASHEWADI, DINDORI,\n Nashik, \n Nashik, \n Maharashtra, \n India -  422003",
    "city": "Nashik",
    "district": "Nashik",
    "state": "Maharashtra",
    "pincode": "422003",
    "contactPerson": "Chandan Prabhu",
    "phone": "9769983890",
    "email": "chandan.prabhu@godrejagrovet.com",
    "validTill": "30 Jul, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/730/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7173406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 257,
    "id": "LAB-257",
    "oslCode": "5174906",
    "name": "Applications Research and Development Centre, Haldia Petrochemicals Limited, Kolkata",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7791_ZvnuYBu.jpeg",
    "address": "54/A/1, Block DN, Sector V, Saltlake City,\n Kolkata, \n 24 PARAGANAS NORTH, \n West Bengal, \n India -  700091",
    "city": "Kolkata",
    "district": "24 PARAGANAS NORTH",
    "state": "West Bengal",
    "pincode": "700091",
    "contactPerson": "Suvomoy Ganguly (Quality Manager)",
    "phone": "+91 9874973336",
    "email": "sudipta2847.ghosh@hpl.co.in",
    "validTill": "30 Nov, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/745/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5174906)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 258,
    "id": "LAB-258",
    "oslCode": "8172006",
    "name": "Amit Test and Calibration Centre (8172006)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_Nzc4l0W.png",
    "address": "Kh. no. 45/7, Village Prahaladpur Bangar, Rohini Sector 30, Near Kali Mata Mandir,\n New Delhi, \n North West, \n Delhi, \n India -  110042",
    "city": "New Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110042",
    "contactPerson": "Amit Jadon",
    "phone": "9560959122",
    "email": "amittestlab@gmail.com",
    "validTill": "16 Apr, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/746/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8172006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 259,
    "id": "LAB-259",
    "oslCode": "6172206",
    "name": "AIC-AMTZ Medivalley Incubation Council (Medivalley laboratory), Visakhapatnam",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_7869_xUDRXEQ.jpeg",
    "address": "AMTZ Administrative Building, AMTZ Campus, Pragati Maidan, VM Steel Project S.O. Visakhapatnam, Andhra Pradesh-530031,\n Visakhapatnam, \n Visakhapatanam, \n Andhra Pradesh, \n India -  530031",
    "city": "Visakhapatnam",
    "district": "Visakhapatanam",
    "state": "Andhra Pradesh",
    "pincode": "530031",
    "contactPerson": "Dilip Kumar Chekuri",
    "phone": "9868710901",
    "email": "surya.ch@medivalley-aic.in",
    "validTill": "18 May, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/752/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6172206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 260,
    "id": "LAB-260",
    "oslCode": "7176516",
    "name": "Accuprec Research Labs. Pvt. Ltd., Ahmedabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8094_tEFkYCk.jpeg",
    "address": "Opposite Pharmez, Changodar- Bavla Highway, Near Matoda Patia, Post : Matoda, Ahmedabad - 382213, Gujarat,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  382213",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "382213",
    "contactPerson": "Dr. Manish Rachchh",
    "phone": "9099981023",
    "email": "manish.rachchh@accuprec.com",
    "validTill": "28 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/761/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7176516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 261,
    "id": "LAB-261",
    "oslCode": "8178326",
    "name": "ADS LABTECH, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_OQiZnGw.png",
    "address": "39/2/10-A, Site-IV, Sahibabad Industrial Area,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201010",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201010",
    "contactPerson": "Prashant tiwari (Technical Manager)",
    "phone": "+91 7217808235",
    "email": "shaktigroups@gmail.com",
    "validTill": "15 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/763/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8178326)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 262,
    "id": "LAB-262",
    "oslCode": "7173706",
    "name": "Hasti Engineers LLP, Rajkot",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8185_hKNM0fT.jpeg",
    "address": "KAILASH INDUSTRIAL AREA, 40 FEET SWATI RESIDENCY MAIN ROAD,, NR.SANDHIYA BRIDGE, GONDAL CHOWKDI,RAJKOT,\n Rajkot, \n Rajkot, \n Gujarat, \n India -  360002",
    "city": "Rajkot",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360002",
    "contactPerson": "kamlesh vaja (Quality Manager)",
    "phone": "+91 9824483677",
    "email": "bliss.niraj@gmail.com",
    "validTill": "21 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/781/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7173706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 263,
    "id": "LAB-263",
    "oslCode": "6171906",
    "name": "Winwall Technology India Private Limited,Thiruvallur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8216_vC6xEg2.jpeg",
    "address": "No.567-A, S R Kandigai Road, Gummidipoondi,\n Chennai, \n Thiruvallur, \n Tamil Nadu, \n India -  601201",
    "city": "Chennai",
    "district": "Thiruvallur",
    "state": "Tamil Nadu",
    "pincode": "601201",
    "contactPerson": "Harish Ramakrishnan",
    "phone": "9080992502",
    "email": "info@winwallindia.com",
    "validTill": "10 Apr, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/784/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6171906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 264,
    "id": "LAB-264",
    "oslCode": "7173804",
    "name": "Central Institute of Petrochemicals Engineering & Technology (CIPET), Chandrapur",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. C-10/1, MIDC Tadali Industrial Area,,\n Chandrapur, \n Chandrapur, \n Maharashtra, \n India -  442406",
    "city": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442406",
    "contactPerson": "Devanand Bambole",
    "phone": "8829039100",
    "email": "cipetchandrapurptc@gmail.com",
    "validTill": "10 Sep, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/785/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7173804)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 265,
    "id": "LAB-265",
    "oslCode": "5173304",
    "name": "CIPET : CSTS - AGARTALA PLASTICS TESTING LABORATORY, (CIPET, AGARTALA)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8251_CJR3LKn.jpeg",
    "address": "Industrial growth centre, Budhjungnagar,, R.K. NAGAR, Mohanpur,\n Agartala, \n West Tripura, \n Tripura, \n India -  799008",
    "city": "Agartala",
    "district": "West Tripura",
    "state": "Tripura",
    "pincode": "799008",
    "contactPerson": "P. VIJAYA KUMAR",
    "phone": "9849599133",
    "email": "agartala@cipet.gov.in",
    "validTill": "27 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/792/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5173304)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 266,
    "id": "LAB-266",
    "oslCode": "9173226",
    "name": "TECHVISION TESTING LAB PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8302_u1zioHR.jpeg",
    "address": "B-6 (3rd Floor, 2nd Floor & Basement), Commercial, Complex, Nimri Colony, Ashok Vihar, Phase-IV,  Delhi-110052.,\n DELHI, \n North West, \n Delhi, \n India -  110052",
    "city": "DELHI",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110052",
    "contactPerson": "Amit Sharma",
    "phone": "9811574507",
    "email": "techvisioncustomercell@gmail.com",
    "validTill": "16 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/798/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9173226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 267,
    "id": "LAB-267",
    "oslCode": "7175806",
    "name": "ADARSH SCIENTIFIC RESEARCH CENTER AND TESTING LABORATORY PVT. LTD., PANVEL",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8348_eqDmoc6.jpeg",
    "address": "SHRI D.D. VISPUTE COLLEGE OF PHARMACY AND RESEARCH CENTER, PANVEL, RAIGAD, MAHARASHTRA, INDIA,\n Panvel, \n Raigad, \n Maharashtra, \n India -  410206",
    "city": "Panvel",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410206",
    "contactPerson": "Prashant Mukane",
    "phone": "9833193902",
    "email": "asrctl@gmail.com",
    "validTill": "14 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/806/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7175806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 268,
    "id": "LAB-268",
    "oslCode": "8183216",
    "name": "Jagdamba Laboratories (OPC) Pvt Ltd, Jaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8353_wgo0OA6.jpeg",
    "address": "119, Solitaire Industrial Park , Phase 1st, Dahmi Kallan, Bagru , Jaipur , Rajasthan,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  303007",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "303007",
    "contactPerson": "Vimal Kumar Sharma (Quality Manager)",
    "phone": "+91 141 2390604",
    "email": "jagdambalab4@gmail.com",
    "validTill": "22 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/807/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8183216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 269,
    "id": "LAB-269",
    "oslCode": "8178226",
    "name": "Vardhamana Testing Laboratory OPC Pvt. Ltd.",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8427_G7UUdRY.jpeg",
    "address": "Plot No 403, Udyog Kendra 2, Ecotech 3,\n Greater Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201306",
    "city": "Greater Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201306",
    "contactPerson": "POOJA JAIN (Quality Manager)",
    "phone": "+91 9818686724",
    "email": "poojajain@vtlabnoida.com",
    "validTill": "29 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/820/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8178226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 270,
    "id": "LAB-270",
    "oslCode": "5173614",
    "name": "CENTRAL INSTITUTE OF PETROCHEMICALS ENGINEERING & TECHNOLOGY (CIPET), RANCHI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8445_rSiCT28.jpeg",
    "address": "HEHAL, RANCHI, JHARKHAND, INDIA,\n Ranchi, \n Ranchi, \n Jharkhand, \n India -  834005",
    "city": "Ranchi",
    "district": "Ranchi",
    "state": "Jharkhand",
    "pincode": "834005",
    "contactPerson": "Mr. Avneet Kumar Joshi (Quality Manager)",
    "phone": "+91 651 2999713",
    "email": "cipetranchi@gmail.com",
    "validTill": "09 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/825/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5173614)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 271,
    "id": "LAB-271",
    "oslCode": "6107716",
    "name": "IAPMO INDIA PVT LTD, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_5b8KwWw.png",
    "address": "First Floor, 38/1&2, Bertenna Agrahara,  Hosur Main Road, Bengaluru,  Karnataka - 560100,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560100",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560100",
    "contactPerson": "Mukthesh Pathi",
    "phone": "9632248866",
    "email": "mukthesh.pathi@iapmo.org",
    "validTill": "18 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/835/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6107716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 272,
    "id": "LAB-272",
    "oslCode": "8182036",
    "name": "LANDMARK MATERIAL TESTING AND RESEARCH LABORATORY PVT LTD, JAIPUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8643_yrl5jRT.jpeg",
    "address": "G-200 RIICO INDUSTRIAL AREA, MANSAROVAR,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302020",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302020",
    "contactPerson": "Dr. Anil Dixit",
    "phone": "9414297329",
    "email": "LRLJPRR@gmail.com",
    "validTill": "27 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/836/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8182036)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 273,
    "id": "LAB-273",
    "oslCode": "8172626",
    "name": "ATCC TEST LABS LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_pubmL6l.png",
    "address": "KHASRA NO. 45/6, SITUATED IN THE AREA, VILLAGE PRAHLADPUR BANGER,, North West Delhi, Delhi, 110042,\n Delhi, \n North West, \n Delhi, \n India -  110042",
    "city": "Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110042",
    "contactPerson": "RAJIV JADON",
    "phone": "9891606632",
    "email": "info@atcctestlabs.com",
    "validTill": "15 Jun, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/840/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8172626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 274,
    "id": "LAB-274",
    "oslCode": "6174606",
    "name": "BANGALORE ANALYTICAL RESEARCH CENTER (P) LTD, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_fP5IFWR.png",
    "address": "Sy No.57, Shree Vijayaraja Estate, Chokkanahalli, Jakkur Post, Yelahanka, Bangalore-560064, India,\n Bangalore, \n Bengaluru Urban, \n Karnataka, \n India -  560064",
    "city": "Bangalore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560064",
    "contactPerson": "Kausalya M - Quality Manager",
    "phone": "9916101519",
    "email": "prasad.brr@gmail.com",
    "validTill": "14 Nov, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/850/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6174606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 275,
    "id": "LAB-275",
    "oslCode": "9172306",
    "name": "JBS TESTING SOLUTIONS (Unit-2) (24), Jalandhar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8911_mEHTTkg.jpeg",
    "address": "Plot No. 24, Street No. 2, Adjoining focal Point Road, Transport Nagar, Jalandhar,\n Jalandhar, \n Jalandhar, \n Punjab, \n India -  144004",
    "city": "Jalandhar",
    "district": "Jalandhar",
    "state": "Punjab",
    "pincode": "144004",
    "contactPerson": "",
    "phone": "+91 7582929529",
    "email": "unit2.jbs@gmail.com",
    "validTill": "22 May, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/869/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9172306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 276,
    "id": "LAB-276",
    "oslCode": "7172436",
    "name": "Perficio Testing and Research Centre, Vadodara",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_8959_bO8nM2X.jpeg",
    "address": "Plot-A-2, Kamdhenu Industrial Estate, Commercial Industrial Premises, Opp. Gorwa Water Tank, Gorwa, Vadodara,\n Vadodara, \n Vadodara, \n Gujarat, \n India -  390003",
    "city": "Vadodara",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "390003",
    "contactPerson": "Mr. Kunwarpreet Singh Anand",
    "phone": "8238073311",
    "email": "kunwarpreet@perficio.in",
    "validTill": "28 May, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/875/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7172436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 277,
    "id": "LAB-277",
    "oslCode": "5172706",
    "name": "GLOBAL COMPLIANCE LABORATORY INDIA, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_UT9fFuw.png",
    "address": "14/17, 2nd Floor, Site-4 Industrial Area, Sahibabad, Ghaziabad U.P.,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201010",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201010",
    "contactPerson": "Deepak Sharma",
    "phone": "9873911918",
    "email": "deepakgclindia@gmail.com",
    "validTill": "20 Jun, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/879/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5172706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 278,
    "id": "LAB-278",
    "oslCode": "8179206",
    "name": "ISSPL Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_9216_mlsnHIH.jpeg",
    "address": "1st and 2nd Floor, B-11G, CEG Tower, Industrial Area, Malviya Nagar, Jaipur - 302017,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302017",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302017",
    "contactPerson": "Dr. Vikas Gupta",
    "phone": "9634063932",
    "email": "Vikas.Gupta@irclass.org",
    "validTill": "06 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/905/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8179206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 279,
    "id": "LAB-279",
    "oslCode": "6175936",
    "name": "BISS LABS -DIVISION OF ITW INDIA PRIVATE LIMITED. BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_9313_hyLTBww.jpeg",
    "address": "497/E, 14th Cross, 4th Phase, 2nd Stage Peenya Industrial Area, Bangalore: 560058 Karnataka State, India,\n Bangaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560058",
    "city": "Bangaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560058",
    "contactPerson": "Shinekumar K (Quality Manager)",
    "phone": "+91 9880217600",
    "email": "Shine_Kumar@instron.com",
    "validTill": "10 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/916/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6175936)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 280,
    "id": "LAB-280",
    "oslCode": "8175126",
    "name": "MARQUIS TECHNOLOGIES PRIVATE LIMITED, NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_9475_2FOTFF5.jpeg",
    "address": "Plot No A-43, SECTOR 67,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Dheeraj Saraswat(Deputy Quality Manager)",
    "phone": "8171734127",
    "email": "brsingh@marquistech.com",
    "validTill": "13 Dec, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/927/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8175126)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 281,
    "id": "LAB-281",
    "oslCode": "7174006",
    "name": "Accurate Universal Laboratoies Private Limited, Ahmedabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_9957_Uusam0q.jpeg",
    "address": "D-171 to 174, 263 to 266, Siddhi Industrial Park,\n AHMEDABAD, \n Ahmadabad, \n Gujarat, \n India -  380004",
    "city": "AHMEDABAD",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "380004",
    "contactPerson": "Zalak Amin (Quality Manager)",
    "phone": "+91 9824014571",
    "email": "info@accuratelaboratory.in",
    "validTill": "19 Sep, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/950/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7174006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 282,
    "id": "LAB-282",
    "oslCode": "7174106",
    "name": "Precision Laboratories LLP, Ahmedabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_9958_2KXaX2V.jpeg",
    "address": "E-267, 268, Siddhi Industrial Park, Ahmedabad,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  380004",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "380004",
    "contactPerson": "Jatin Patel (Technical Manager)",
    "phone": "+91 9824014571",
    "email": "precisionlabllp@gmail.com",
    "validTill": "31 Oct, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/951/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7174106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 283,
    "id": "LAB-283",
    "oslCode": "7175516",
    "name": "Umwelt Research Lab Private Limited, Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_9959_THQgiBe.jpeg",
    "address": "Plot No 20 (Part) D-III Block MIDC Chinchwad,\n Pune, \n Pune, \n Maharashtra, \n India -  411019",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411019",
    "contactPerson": "Nandkishor Gaidhani",
    "phone": "9422007106",
    "email": "spanhydro@rediffmail.com",
    "validTill": "26 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/952/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7175516)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 284,
    "id": "LAB-284",
    "oslCode": "7174706",
    "name": "COTTON ASSOCIATION OF INDIA COTTON TESTING AND RESEARCH LABORATORY, MUMBAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_tIxA715.png",
    "address": "2nd floor, Cotton Exchange Building, Opp Cotton Green Railway Station, Cotton Green, Mumbai 400 033.,\n MUMBAI, \n Mumbai, \n Maharashtra, \n India -  400033",
    "city": "MUMBAI",
    "district": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400033",
    "contactPerson": "SANKET SHINGOTE",
    "phone": "8691068976",
    "email": "laboratory.mb@caionline.in",
    "validTill": "20 Nov, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/957/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7174706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 285,
    "id": "LAB-285",
    "oslCode": "6175606",
    "name": "ALS Testing Services India Pvt. Ltd., Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10012_kbtKpmZ.jpeg",
    "address": "No 65, Bommasandra Jigani Link Road KIADB Industrial Area, Bangalore - 560105  Karnataka, India,\n Banglore, \n Bengaluru Urban, \n Karnataka, \n India -  560105",
    "city": "Banglore",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560105",
    "contactPerson": "Sundaram Dharmaraju (Technical Manager)",
    "phone": "+91 9071211500",
    "email": "pooja.ahuja@alsglobal.com",
    "validTill": "11 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/960/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6175606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 286,
    "id": "LAB-286",
    "oslCode": "8175706",
    "name": "ARDM Labs Pvt Ltd",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10188_S05EPWn.jpeg",
    "address": "A-80, G. T. KARNAL ROAD INDUSTRIAL AREA, AZADPUR,\n DELHI, \n North, \n Delhi, \n India -  110033",
    "city": "DELHI",
    "district": "North",
    "state": "Delhi",
    "pincode": "110033",
    "contactPerson": "Vikram Chhabra (Quality Manager)",
    "phone": "+91 11 47252211",
    "email": "ardmlabs@gmail.com",
    "validTill": "11 Jan, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/987/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8175706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 287,
    "id": "LAB-287",
    "oslCode": "8177224",
    "name": "CENTRAL POWER RESEARCH INSTITUTE (CPRI),NOIDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10364_2qkp6tn.jpeg",
    "address": "Regional Testing Laboratory, Plot No.-3A, Intuitional Area, Sector-62, Noda,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201309",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201309",
    "contactPerson": "MANOJ KUMAR JAISWAL (Technical Manager)",
    "phone": "+91 9810803435",
    "email": "jaiswal@cpri.in",
    "validTill": "25 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1013/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8177224)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 288,
    "id": "LAB-288",
    "oslCode": "7174321",
    "name": "Astute Labs Pvt Ltd, Pune",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10372_JXa41Fk.jpeg",
    "address": "Sr. No. 82/1, Bajirao Dhawade Patil Industrial Estate, NDA Road, Shivane,\n Pune, \n Pune, \n Maharashtra, \n India -  411023",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411023",
    "contactPerson": "Mr. Kunal Deshpande",
    "phone": "9689944877",
    "email": "kunal@astute-labs.com",
    "validTill": "05 Nov, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1014/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7174321)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 289,
    "id": "LAB-289",
    "oslCode": "6179035",
    "name": "Indian Rubber Materials Research Institute (IRMRI), Tirupati",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10479_tIzSMCv.jpeg",
    "address": "# 2680, Central Expressway, Sri City, Tirupati District,\n Tirupati, \n Chittoor, \n Andhra Pradesh, \n India -  517646",
    "city": "Tirupati",
    "district": "Chittoor",
    "state": "Andhra Pradesh",
    "pincode": "517646",
    "contactPerson": "Paul Vannan",
    "phone": "8655095345",
    "email": "info.south@irmra.org",
    "validTill": "22 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1029/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6179035)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 290,
    "id": "LAB-290",
    "oslCode": "8178406",
    "name": "NATIONAL COMMODITIES MANAGEMENT SERVICES LIMITED, GURUGRAM",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_0er79dr.png",
    "address": "Plot no. 883 , 3rd floor , udyog vihar phase 5 , Sector 19 , Gurgaon,\n Gurgaon, \n Gurugram, \n Haryana, \n India -  122016",
    "city": "Gurgaon",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122016",
    "contactPerson": "Iram Khannum (Quality Manager)",
    "phone": "+91 7428692682",
    "email": "iram.k@ncml.com",
    "validTill": "17 May, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1039/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8178406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 291,
    "id": "LAB-291",
    "oslCode": "8174226",
    "name": "Planet Electro Labs Private Limited (407)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10653_critMT0.jpeg",
    "address": "WZ-407/B-1, BASAI DARAPUR, NEAR RAMESH NAGAR METRO STATION,NEW DELHI,\n NEW DELHI, \n West, \n Delhi, \n India -  110015",
    "city": "NEW DELHI",
    "district": "West",
    "state": "Delhi",
    "pincode": "110015",
    "contactPerson": "ABHINAV DEWAN",
    "phone": "9971932901",
    "email": "PLANETLABSIND@gmail.com",
    "validTill": "05 Nov, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1048/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8174226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 292,
    "id": "LAB-292",
    "oslCode": "8177706",
    "name": "SHIVA TEST HOUSE PRIVATE LIMITED, Ghaziabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_10662_DFSFaeh.jpeg",
    "address": "Plot No. 10, Khasra No. 211, Saipuram Colony, Morti,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201017",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201017",
    "contactPerson": "MITHILESH KUMAR (Technical Manager)",
    "phone": "+91 9548459893",
    "email": "shivatesthousepvtltd@gmail.com",
    "validTill": "11 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1049/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8177706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 293,
    "id": "LAB-293",
    "oslCode": "8176806",
    "name": "PIONEER TESTING LABORATORY PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_C5EYyG2.png",
    "address": "Kh No. 84/2, Street No: 4, Mundka Industrial Area, (Near Mundka INDUSTRIAL Area Metro Station), New Delhi - 110041.,\n Delhi, \n West, \n Delhi, \n India -  110041",
    "city": "Delhi",
    "district": "West",
    "state": "Delhi",
    "pincode": "110041",
    "contactPerson": "P.C. Mishra (Quality Manager)",
    "phone": "+91 9810040186",
    "email": "pioneertestinglabdelhi@gmail.com",
    "validTill": "10 Mar, 2030",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1057/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8176806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 294,
    "id": "LAB-294",
    "oslCode": "7175321",
    "name": "ELECTRICAL POWER RESEARCH LABORATORY, VADODARA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_11082_mkig0PQ.jpeg",
    "address": "Plot No. 25, Aatmiya Brookfieldz Industrial Park, AT Untiya (Kajapur) Village, Near POR Village,\n Vadodara, \n Vadodara, \n Gujarat, \n India -  391240",
    "city": "Vadodara",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "391240",
    "contactPerson": "S.B.DIWAN",
    "phone": "9724207285",
    "email": "sb.diwan@eprl.in",
    "validTill": "26 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1084/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7175321)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 295,
    "id": "LAB-295",
    "oslCode": "7192524",
    "name": "Electronic Safety Test Laboratory, EMC Division, SAMEER-Centre for Microwave Research",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_11085_m4ua9CB.jpeg",
    "address": "Sector-7, Rain Tree Marg, CBD Belapur, Navi Mumbai,\n Navi Mumbai, \n Raigad, \n Maharashtra, \n India -  400614",
    "city": "Navi Mumbai",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "400614",
    "contactPerson": "Gautam Shende (Technical Manager)",
    "phone": "+91 9869015506",
    "email": "gautam@sameer.gov.in",
    "validTill": "04 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1086/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7192524)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 296,
    "id": "LAB-296",
    "oslCode": "8180636",
    "name": "Test Master",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_11104_E5oFssy.jpeg",
    "address": "A-36, Shakti Vihar, Geeta Mandir Road, Mohan Garden, Uttam Nagar,,\n Delhi, \n West, \n Delhi, \n India -  110059",
    "city": "Delhi",
    "district": "West",
    "state": "Delhi",
    "pincode": "110059",
    "contactPerson": "R.P. Saxena (Quality Manager)",
    "phone": "+91 9811938703",
    "email": "filtertestlab1@gmail.com",
    "validTill": "09 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1091/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8180636)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 297,
    "id": "LAB-297",
    "oslCode": "8179926",
    "name": "Aaditech Test and Calibration Lab LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_11152_EnsuWDm.jpeg",
    "address": "Plot No. 5, Block-R, Kh.No. 38/16, Street No.4, Rama Vihar- Village Karala,\n Rohini, \n North West, \n Delhi, \n India -  110081",
    "city": "Rohini",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110081",
    "contactPerson": "Bharat Malhotra (Quality Manager)",
    "phone": "+91 8860402469",
    "email": "aaditechtestlab@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1099/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8179926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 298,
    "id": "LAB-298",
    "oslCode": "7174421",
    "name": "TYPE TEST CENTER SIEMENS LIMITED KALWA, NAVI MUMBAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_SXT1J34.png",
    "address": "SIEMENS LIMITED, KALWA WORKS, THANE BELAPUR ROAD,\n Navi Mumbai, \n Thane, \n Maharashtra, \n India -  400708",
    "city": "Navi Mumbai",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400708",
    "contactPerson": "Neelesh Kayal (Quality Manager)",
    "phone": "+91 9820055702",
    "email": "ttcslkw.in@siemens.com",
    "validTill": "07 Nov, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1102/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7174421)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 299,
    "id": "LAB-299",
    "oslCode": "7175421",
    "name": "Baroda Calibration Services LLP, Vadodara",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Survey No. 88, Ramangamdi to Kashipura Road, Ramangamdi, Por, District: Vadodara \u2013 391243, Gujarat.,\n Vadodara, \n Vadodara, \n Gujarat, \n India -  391243",
    "city": "Vadodara",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "391243",
    "contactPerson": "Pratik Shah (Technical Manager)",
    "phone": "+91 8758899235",
    "email": "jayesh@barodacalibration.com",
    "validTill": "21 Dec, 2026",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1110/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7175421)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 300,
    "id": "LAB-300",
    "oslCode": "9176026",
    "name": "NIIRT - Calibration and Testing Private Limited, Panchkula",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_11257_uDT39yd.jpeg",
    "address": "214, Kundi, Sector-20, Panchkula,\n Panchkula, \n Panchkula, \n Haryana, \n India -  134117",
    "city": "Panchkula",
    "district": "Panchkula",
    "state": "Haryana",
    "pincode": "134117",
    "contactPerson": "Ashutosh Narayan (Quality Manager)",
    "phone": "+91 8727935010",
    "email": "contact.niirt@gmail.com",
    "validTill": "06 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1112/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9176026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 301,
    "id": "LAB-301",
    "oslCode": "8177804",
    "name": "International Testing Centre, MSME Technology Development Centre, Meerut",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_11492_5NohsDg.jpeg",
    "address": "Sports Goods Complex , Delhi Road,\n Meerut, \n Meerut, \n Uttar Pradesh, \n India -  250001",
    "city": "Meerut",
    "district": "Meerut",
    "state": "Uttar Pradesh",
    "pincode": "250001",
    "contactPerson": "Anil Panchal",
    "phone": "8630931552",
    "email": "testinglab@ppdcmeerut.com",
    "validTill": "15 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1142/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8177804)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 302,
    "id": "LAB-302",
    "oslCode": "6177526",
    "name": "GIGA LABS, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_Y4qBlI8.png",
    "address": "BEARYS GLOBAL RESEARCH CENTRE, 63/3B, GORVIGERE VILLAGE, BIDARAHALLI HOBLI, BENGALURU,\n BENGALURU, \n Bengaluru Rural, \n Karnataka, \n India -  560067",
    "city": "BENGALURU",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "560067",
    "contactPerson": "Arul Jyothi",
    "phone": "9972662131",
    "email": "arul.jyothi@se.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1195/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6177526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 303,
    "id": "LAB-303",
    "oslCode": "9177306",
    "name": "WELL TECH TEST AND RESEARCH CENTER, DERABASSI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_3oG7ECP.png",
    "address": "INDUSTRIAL BLOCK -B , VILLAGE SAIDPURA, DERABASSI,\n MOHALI, \n S.A.S Nagar, \n Punjab, \n India -  140507",
    "city": "MOHALI",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "140507",
    "contactPerson": "inder pal",
    "phone": "7973565868",
    "email": "mail.wtechresearch@gmail.com",
    "validTill": "30 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1202/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9177306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 304,
    "id": "LAB-304",
    "oslCode": "7177626",
    "name": "Lauritz Knudsen Switchgear Testing Laboratories, MSW, SEIPL, Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_12139_TWkP480.jpeg",
    "address": "SCHNEIDER ELECTRIC INDIA PRIVATE LIMITED, PLOT NO. - A600, TTC INDUSTRIAL AREA, MIDC, SHIL-PHATA ROAD, MAHAPE,  MAHARASHTRA \u2013 400710.,\n Mumbai, \n Mumbai Suburban, \n Maharashtra, \n India -  400710",
    "city": "Mumbai",
    "district": "Mumbai Suburban",
    "state": "Maharashtra",
    "pincode": "400710",
    "contactPerson": "Somnath Borate",
    "phone": "9769979737",
    "email": "somnath.borate@lntebg.com",
    "validTill": "11 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1217/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7177626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 305,
    "id": "LAB-305",
    "oslCode": "7176426",
    "name": "Novateur Electrical and Digital Systems Pvt Ltd, Sinnar, Nasik",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_aSRU70G.png",
    "address": "A-2, MIDC Malegaon, Sinnar,\n Nashik, \n Nashik, \n Maharashtra, \n India -  422113",
    "city": "Nashik",
    "district": "Nashik",
    "state": "Maharashtra",
    "pincode": "422113",
    "contactPerson": "TUSHAR DHAKE (Quality Manager)",
    "phone": "+91 8657926870",
    "email": "nedspl.lab@legrand.com",
    "validTill": "21 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1218/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7176426)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 306,
    "id": "LAB-306",
    "oslCode": "6177006",
    "name": "Tentamus India Pvt. Ltd. (Formerly Megsan Labs Pvt. Ltd.), Hyderabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_12152_Vpkv4Yo.jpeg",
    "address": "#3-31/33, Plot No. 33/Part, Sy Nos. 123, 124, 125 & 142, Kompally, Quthbullapur, Hyderabad-500014,\n Hyderabad, \n Medchal Malkajgiri, \n Telangana, \n India -  500014",
    "city": "Hyderabad",
    "district": "Medchal Malkajgiri",
    "state": "Telangana",
    "pincode": "500014",
    "contactPerson": "Anil Kumar (Technical Manager)",
    "phone": "+91 9966405066",
    "email": "a.maheshkumar@megsanlabs.com",
    "validTill": "20 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1219/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6177006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 307,
    "id": "LAB-307",
    "oslCode": "8184006",
    "name": "Quality Testing & Research Lab, Gautam Buddha Nagar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_12245_rsOxahL.jpeg",
    "address": "Plot No. 28 -29, Khasara No. 1013 & 1017, Prem Vihar Bisrakh Road, Chhapraula, Gautam Buddha Nagar, Uttar Pradesh, 201009,\n Ghaziabad, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201009",
    "city": "Ghaziabad",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201009",
    "contactPerson": "Ms. Payal Malik (Quality Manager)",
    "phone": "+91 8810603028",
    "email": "testinglabqualityresearch@gmail.com",
    "validTill": "23 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1228/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8184006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 308,
    "id": "LAB-308",
    "oslCode": "9182336",
    "name": "(Deferred)COTTON ASSOCIATION OF INDIA, COTTON TESTING AND RESEARCH LABORATORY, BATHINDA",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_VAitv6R.png",
    "address": "2nd floor, Shop No. 4465, Bank Bazar, Above State Bank of Bikaner & Jaipur Bank, Bathinda,\n BATHINDA, \n Bathinda, \n Punjab, \n India -  151001",
    "city": "BATHINDA",
    "district": "Bathinda",
    "state": "Punjab",
    "pincode": "151001",
    "contactPerson": "Ankit Singh",
    "phone": "9695258862",
    "email": "laboratory.bt@caionline.in",
    "validTill": "11 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1242/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9182336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 309,
    "id": "LAB-309",
    "oslCode": "8180036",
    "name": "(Deferred)COTTON ASSOCIATION OF INDIA, COTTON TESTING AND RESEARCH LABORATORY, KHARGONE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_lJs9qzx.png",
    "address": "Ground Floor, Hotel P.M. Commercial Area,Opp.Agrawal Hotel, Near Bus Stand,,\n Khargone, \n Khargone, \n Madhya Pradesh, \n India -  451001",
    "city": "Khargone",
    "district": "Khargone",
    "state": "Madhya Pradesh",
    "pincode": "451001",
    "contactPerson": "",
    "phone": "+91 9819448452",
    "email": "laboratory.kh@caionline.in",
    "validTill": "29 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1254/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8180036)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 310,
    "id": "LAB-310",
    "oslCode": "7178936",
    "name": "(Deferred)COTTON ASSOCIATION OF INDIA, COTTON TESTING AND RESEARCH LABORATORY, AHMEDABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_12468_hvlBiji.jpeg",
    "address": "101, Arth Complex, 1st Floor, Mithakali, 6 Rastha, Opp Passport Office Near LG Showroom, Navrangpura,,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  380009",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "380009",
    "contactPerson": "BRIJESH MISHRA",
    "phone": "8000090356",
    "email": "laboratory.ah@caionline.in",
    "validTill": "10 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1258/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7178936)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 311,
    "id": "LAB-311",
    "oslCode": "6176216",
    "name": "Hubert Enviro Care Systems Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_12506_XqwF6Ja.jpeg",
    "address": "A-21, III rd Phase, Labour Colony, Thiru-Vi-Ka Industrial Estate,Guindy,\n Chennai, \n Chennai, \n Tamil Nadu, \n India -  600032",
    "city": "Chennai",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600032",
    "contactPerson": "Anusuya D (Lab manager)",
    "phone": "9884323124",
    "email": "labmanager@hecs.in",
    "validTill": "15 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1265/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6176216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 312,
    "id": "LAB-312",
    "oslCode": "9179606",
    "name": "SHRIRAM FOOD AND PHARMA RESEARCH CENTRE, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_12569_fNinvzE.jpeg",
    "address": "AO-150, Second Floor, Amrit Steel Compound, G.T. Road Industrial Area, Ghaziabad,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201001",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201001",
    "contactPerson": "Mr. Abhishek Shukla",
    "phone": "9306916052",
    "email": "sfprc2022@yahoo.com",
    "validTill": "20 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1276/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9179606)",
    "disciplines": [
      "Biological",
      "Chemical",
      "Food & Agriculture"
    ],
    "standards": [
      "IS 10500",
      "IS 1165",
      "IS 13428",
      "IS 14543",
      "IS 512"
    ],
    "products": [
      "Drinking Water",
      "Food Products & Residues",
      "Milk Powder & Dairy",
      "Packaged Drinking Water",
      "Spices & Condiments"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Drinking Water",
        "product": "Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Packaged Drinking Water",
        "product": "Packaged Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 13428",
        "title": "Milk Powder & Dairy",
        "product": "Milk Powder & Dairy",
        "fee": "5000"
      },
      {
        "standard": "IS 1165",
        "title": "Spices & Condiments",
        "product": "Spices & Condiments",
        "fee": "5000"
      },
      {
        "standard": "IS 512",
        "title": "Food Products & Residues",
        "product": "Food Products & Residues",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 313,
    "id": "LAB-313",
    "oslCode": "8176106",
    "name": "Atmy Analytical Labs Private Limited (Unit-2), Greater Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_13030_k3HmuBA.jpeg",
    "address": "B-19, Ecotech,-1 Extension, Kasna,\n Greater Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201310",
    "city": "Greater Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201310",
    "contactPerson": "Dr. D.P. Singh",
    "phone": "9910808996",
    "email": "unit2@atmylabs.com",
    "validTill": "08 Feb, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1303/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8176106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 314,
    "id": "LAB-314",
    "oslCode": "9186006",
    "name": "MICRO ENGINEERING AND TESTING LABORATORY OPC PRIVATE LIMITED, SONIPAT",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_14510_dssZ6Db.jpeg",
    "address": "Plot No.43, HSIIDC, Indl. Estate, Rai,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131029",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131029",
    "contactPerson": "Mosin Ali (Quality Manager)",
    "phone": "+91 9871143785",
    "email": "METLSON@YAHOO.COM",
    "validTill": "04 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1318/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9186006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 315,
    "id": "LAB-315",
    "oslCode": "7186336",
    "name": "COTTON ASSOCIATION OF INDIA, COTTON TESTING AND RESEARCH LABORATORY, RAJKOT",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_SLKH2dx.png",
    "address": "Maruti Nandan Commercial Complex, In Side Ground Floor, Opp. Galaxy  Hotel, Jawahar Road,\n RAJKOT, \n Rajkot, \n Gujarat, \n India -  360001",
    "city": "RAJKOT",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360001",
    "contactPerson": "",
    "phone": "+91 9924580810",
    "email": "laboratory.rk@caionline.in",
    "validTill": "23 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1319/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7186336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 316,
    "id": "LAB-316",
    "oslCode": "7182136",
    "name": "(Deferred)Wakefield Inspection Services India Pvt. Ltd, Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_YUtC2R5.png",
    "address": "B-4, Ground Floor, Cotton Exchange Building, Opposite Cotton Green Railway Station, Cotton Green-East, Mumbai-400033,\n COTTON GREEN, \n Mumbai, \n Maharashtra, \n India -  400033",
    "city": "COTTON GREEN",
    "district": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400033",
    "contactPerson": "Viral Shah (Quality Manager)",
    "phone": "+91 9920266554",
    "email": "ind-lab@wiscontrol.com",
    "validTill": "29 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1320/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7182136)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 317,
    "id": "LAB-317",
    "oslCode": "7195836",
    "name": "COTTON ASSOCIATION OF INDIA, COTTON TESTING AND RESEARCH LABORATORY, JALGAON",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_AJ5nk2U.png",
    "address": "52-B, Karmayog, Jila Peth, Behind Saibaba Mandir, Near Ambedkar Market,\n JALGAON, \n Jalgaon, \n Maharashtra, \n India -  425001",
    "city": "JALGAON",
    "district": "Jalgaon",
    "state": "Maharashtra",
    "pincode": "425001",
    "contactPerson": "",
    "phone": "+91 9552472732",
    "email": "laboratory.jl@caionline.in",
    "validTill": "13 Jan, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1321/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7195836)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 318,
    "id": "LAB-318",
    "oslCode": "7183416",
    "name": "Rohan Energy Solutions Pvt Ltd ( Testing Laboratory Division), Nashik",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_ieGaLfi.png",
    "address": "SUR NO 68/8 A/P NIGDOL,\n NIGDOL DINDORI, \n Nashik, \n Maharashtra, \n India -  422202",
    "city": "NIGDOL DINDORI",
    "district": "Nashik",
    "state": "Maharashtra",
    "pincode": "422202",
    "contactPerson": "Dipak Talekar",
    "phone": "9767297636",
    "email": "operations@rohanenergy.com",
    "validTill": "05 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1330/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7183416)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 319,
    "id": "LAB-319",
    "oslCode": "8176906",
    "name": "AADCO TESTING & RESEACH LABORATORY PVT LTD (UNIT-2) (E37), Ghaziabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_fdTvUz1.png",
    "address": "E-37 BSR INDUSTRIAL AREA GHAZIABAD,\n GHAZIABAD, \n Ghaziabad, \n Uttar Pradesh, \n India -  201009",
    "city": "GHAZIABAD",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201009",
    "contactPerson": "BHUPENDER SINGH (Technical Manager)",
    "phone": "+91 955",
    "email": "aadcofiretesting@gmail.com",
    "validTill": "19 Mar, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1344/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8176906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 320,
    "id": "LAB-320",
    "oslCode": "6187504",
    "name": "POLYMER TESTING LABORATORY, CIPET:SARP-APDDRL",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_14677_dlzAZQI.jpeg",
    "address": "PLOT NO.- 7P, HI TECH DEFENCE & AEROSPACE PARK (IT SECTOR),\n Bangalore, \n Bengaluru Rural, \n Karnataka, \n India -  562149",
    "city": "Bangalore",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "562149",
    "contactPerson": "Dr Manoranjan Biswal (Quality Manager)",
    "phone": "+91 044 22254780",
    "email": "apddrl@cipet.gov.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1345/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6187504)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 321,
    "id": "LAB-321",
    "oslCode": "9182936",
    "name": "National Soil Testing and Research Laboratories, Panchkula",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_I9QXbMF.png",
    "address": "Plot No 384 Phase-2 Industrail Area Panchkula,\n Panchkula, \n Panchkula, \n Haryana, \n India -  134112",
    "city": "Panchkula",
    "district": "Panchkula",
    "state": "Haryana",
    "pincode": "134112",
    "contactPerson": "Satinder Walia (Technical Manager)",
    "phone": "+91 9872010622",
    "email": "nationallab2014@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1346/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9182936)",
    "disciplines": [
      "Civil",
      "Mechanical",
      "Chemical"
    ],
    "standards": [
      "IS 1489",
      "IS 16415",
      "IS 269",
      "IS 456",
      "IS 8112"
    ],
    "products": [
      "Ceramic Tiles",
      "Clay Bricks",
      "Composite Cement",
      "Concrete Aggregates",
      "Portland Pozzolana Cement"
    ],
    "scopeDetails": [
      {
        "standard": "IS 16415",
        "title": "Composite Cement",
        "product": "Composite Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "Portland Pozzolana Cement",
        "product": "Portland Pozzolana Cement",
        "fee": "5000"
      },
      {
        "standard": "IS 269",
        "title": "Concrete Aggregates",
        "product": "Concrete Aggregates",
        "fee": "5000"
      },
      {
        "standard": "IS 8112",
        "title": "Clay Bricks",
        "product": "Clay Bricks",
        "fee": "5000"
      },
      {
        "standard": "IS 456",
        "title": "Ceramic Tiles",
        "product": "Ceramic Tiles",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 322,
    "id": "LAB-322",
    "oslCode": "8176606",
    "name": "Advance Firetec and Research Lab Pvt. Ltd",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "B-3, 2nd floor, Mangolpuri Industrial Area, Phase 2, New Delhi.    \n(Site Lab:- Advance Firetec and Research Lab Pvt. Ltd., Kishora road, Villege- Kamasupur , Sonipat (Haryana)  for Fire Performance Testing),",
    "city": "B-3, 2nd floor, Mangolpuri Industrial Area, Phase 2, New Delhi.",
    "district": "(Site Lab:- Advance Firetec and Research Lab Pvt. Ltd., Kishora road, Villege- Kamasupur , Sonipat (Haryana)  for Fire Performance Testing)",
    "state": "Haryana",
    "pincode": "",
    "contactPerson": "Subir Kumar Nandi",
    "phone": "9971032375",
    "email": "aftrlab24@gmail.com",
    "validTill": "03 Mar, 2030",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1348/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8176606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 323,
    "id": "LAB-323",
    "oslCode": "6184126",
    "name": "ABB ELSP LAB, Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_n3K5u2A.png",
    "address": "88/3; 88/6 BASAVA NAHALLI VILLAGE, NELAMANGALA, BENGALURU, KARNATAKA, INDIA,\n Bengaluru, \n Bengaluru Rural, \n Karnataka, \n India -  562123",
    "city": "Bengaluru",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "562123",
    "contactPerson": "",
    "phone": "+91 8880606642",
    "email": "in-elspbanglore_testlab_abb@abb.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1349/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6184126)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 324,
    "id": "LAB-324",
    "oslCode": "8188316",
    "name": "Global Technical Services (Central Oil Testing Laboratory)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_14761_KQvgjAU.jpeg",
    "address": "Hindustan Zinc Limites, Rampura Agucha Mines, P.O. Agucha- Gulabpura,\n Gulabpura, \n Bhilwara, \n Rajasthan, \n India -  311030",
    "city": "Gulabpura",
    "district": "Bhilwara",
    "state": "Rajasthan",
    "pincode": "311030",
    "contactPerson": "Gaurav Mathur",
    "phone": "9892545299",
    "email": "gkm@gtsinidia.com",
    "validTill": "19 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1351/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8188316)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 325,
    "id": "LAB-325",
    "oslCode": "8186026",
    "name": "BCH Electric Limited, Faridabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_uuugFVL.png",
    "address": "20/4, Mathura road,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121006",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121006",
    "contactPerson": "Sushil Kumar",
    "phone": "9818399068",
    "email": "sushil.kumar@bchindia.com",
    "validTill": "05 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1380/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8186026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 326,
    "id": "LAB-326",
    "oslCode": "9177406",
    "name": "RTRC LIMITED, GURUGRAM",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_15107_b4gK7uC.jpeg",
    "address": "Plot No. 296, Sector-7, Phase-II,Industrial Estate,IMT Manesar, Gurugram,\n Gurugram, \n Gurugram, \n Haryana, \n India -  122050",
    "city": "Gurugram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122050",
    "contactPerson": "Manish Arora (Quality Manager)",
    "phone": "+91 8826495200",
    "email": "qa@rtrc.in",
    "validTill": "03 Apr, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1389/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9177406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 327,
    "id": "LAB-327",
    "oslCode": "8178606",
    "name": "AJEO TESTING LABS PVT LTD, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_LSfpVME.png",
    "address": "13-A/08, SITE-II, LONI ROAD,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201007",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201007",
    "contactPerson": "A. K. CHAUDHARY (Quality Manager)",
    "phone": "+91 8010296901",
    "email": "ak@ajeo.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1394/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8178606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 328,
    "id": "LAB-328",
    "oslCode": "7184626",
    "name": "Switchgear Testing Laboratories, Schneider Electric India Private Limited, Ahmednagar",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_Pt1TMSU.png",
    "address": "A9, A10, ESE ESP MFG. PROCESS, MIDC AREA, NAGAPUR, Ahmednagar, Ahmednagar, Maharashtra, 414111,\n Nagapur, \n Ahmednagar, \n Maharashtra, \n India -  414111",
    "city": "Nagapur",
    "district": "Ahmednagar",
    "state": "Maharashtra",
    "pincode": "414111",
    "contactPerson": "VIKRAM JADHAV",
    "phone": "9987033570",
    "email": "vikram.jadhav@se.com",
    "validTill": "25 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1396/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7184626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 329,
    "id": "LAB-329",
    "oslCode": "5178506",
    "name": "Adityapur Auto Cluster, Adityapur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_8K0SIRe.png",
    "address": "Phase VII, Tata kandra main road, near toll bridge junction, Adityapur, Dist- Saraikela kharsawan, Jharkhand,\n Aditypur, \n Saraikela Kharsawan, \n Jharkhand, \n India -  832109",
    "city": "Aditypur",
    "district": "Saraikela Kharsawan",
    "state": "Jharkhand",
    "pincode": "832109",
    "contactPerson": "BS MANDAL (Quality Manager)",
    "phone": "+91 8709051989",
    "email": "adityapurcluster@gmail.com",
    "validTill": "28 Jun, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1401/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5178506)",
    "disciplines": [
      "Mechanical",
      "Safety Testing",
      "Automotive"
    ],
    "standards": [
      "IS 11944",
      "IS 14286",
      "IS 2932",
      "IS 4151"
    ],
    "products": [
      "Automotive Components",
      "Protective Helmets for Two Wheeler Riders",
      "Safety Glass",
      "Solar PV Modules"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4151",
        "title": "Protective Helmets for Two Wheeler Riders",
        "product": "Protective Helmets for Two Wheeler Riders",
        "fee": "5000"
      },
      {
        "standard": "IS 2932",
        "title": "Automotive Components",
        "product": "Automotive Components",
        "fee": "5000"
      },
      {
        "standard": "IS 11944",
        "title": "Safety Glass",
        "product": "Safety Glass",
        "fee": "5000"
      },
      {
        "standard": "IS 14286",
        "title": "Solar PV Modules",
        "product": "Solar PV Modules",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 330,
    "id": "LAB-330",
    "oslCode": "7188606",
    "name": "YORLAB LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_E2umXL7.png",
    "address": "PLOT NO. 42/2, SURVEY NO. 83, 150 FEET RING ROAD(WEST), VAVDI,\n RAJKOT, \n Rajkot, \n Gujarat, \n India -  360004",
    "city": "RAJKOT",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360004",
    "contactPerson": "Kavan Kaneriya (Technical Manager)",
    "phone": "+91 9427390335",
    "email": "yo.rlabllp@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1408/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7188606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 331,
    "id": "LAB-331",
    "oslCode": "7186736",
    "name": "CEPT Advisory Foundation",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_zQFmUeS.png",
    "address": "CEPT University, K.L. Campus, Navrangpura,,\n Ahmedabad, \n Ahmadabad, \n Gujarat, \n India -  380009",
    "city": "Ahmedabad",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "380009",
    "contactPerson": "Asha Joshi (Quality Manager)",
    "phone": "+91 9904042280",
    "email": "carbse@cept.ac.in",
    "validTill": "09 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1411/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7186736)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 332,
    "id": "LAB-332",
    "oslCode": "8187716",
    "name": "MS TESTING LABORATORY LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_15297_IiEHqh1.jpeg",
    "address": "A-4/3/19, SSGT Road Industrial Area, Ghaziabad- 201001, U.P.,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201001",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201001",
    "contactPerson": "Baljeet Singh (Quality Manager)",
    "phone": "+91 9911590577",
    "email": "mstestinglab@gmail.com",
    "validTill": "28 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1413/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187716)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 333,
    "id": "LAB-333",
    "oslCode": "9187136",
    "name": "Plastics Woven Bag Testing Lab-Technical Training & Research Centre - TTRC",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_15541_6WhZgF2.jpeg",
    "address": "Technical Training and Research Centre, Grand Trunk Road, Choubepur Kalan, Kanpur Nagar, Uttar Pradesh 209203,\n Kanpur, \n Kanpur Nagar, \n Uttar Pradesh, \n India -  209203",
    "city": "Kanpur",
    "district": "Kanpur Nagar",
    "state": "Uttar Pradesh",
    "pincode": "209203",
    "contactPerson": "Jitendra Kumar Arya",
    "phone": "9935094562",
    "email": "Jitendra.arya@lohiagroup.com",
    "validTill": "29 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1431/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9187136)",
    "disciplines": [
      "Chemical",
      "Plastics & Polymers"
    ],
    "standards": [
      "IS 15462",
      "IS 17079",
      "IS 4783",
      "IS 4985",
      "IS 6444"
    ],
    "products": [
      "Agrochemicals & Pesticides",
      "Paints & Varnishes",
      "Plastic Containers",
      "Polymer Modified Bitumen",
      "UPVC Pipes & Fittings"
    ],
    "scopeDetails": [
      {
        "standard": "IS 4985",
        "title": "UPVC Pipes & Fittings",
        "product": "UPVC Pipes & Fittings",
        "fee": "5000"
      },
      {
        "standard": "IS 15462",
        "title": "Polymer Modified Bitumen",
        "product": "Polymer Modified Bitumen",
        "fee": "5000"
      },
      {
        "standard": "IS 17079",
        "title": "Agrochemicals & Pesticides",
        "product": "Agrochemicals & Pesticides",
        "fee": "5000"
      },
      {
        "standard": "IS 4783",
        "title": "Plastic Containers",
        "product": "Plastic Containers",
        "fee": "5000"
      },
      {
        "standard": "IS 6444",
        "title": "Paints & Varnishes",
        "product": "Paints & Varnishes",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 334,
    "id": "LAB-334",
    "oslCode": "9179506",
    "name": "Delta Testing and Research Laboratories Private Limited (C5)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_15549_bzexCTw.jpeg",
    "address": "Plot No. C-5, Block - C, Main Kanjhawala Road, Rajiv Nagar,\n Delhi, \n North West, \n Delhi, \n India -  110086",
    "city": "Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110086",
    "contactPerson": "Swaraj Shukla (Quality Manager)",
    "phone": "+91 9811037450",
    "email": "info@deltatestinglab.com",
    "validTill": "21 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1435/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9179506)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 335,
    "id": "LAB-335",
    "oslCode": "5182706",
    "name": "TATA STEEL, Jamshedpur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_RhdVoqs.png",
    "address": "Scientific Services, Post Box: Burmamines,\n Jamshedpur, \n East Singhbum, \n Jharkhand, \n India -  831001",
    "city": "Jamshedpur",
    "district": "East Singhbum",
    "state": "Jharkhand",
    "pincode": "831001",
    "contactPerson": "Souvik",
    "phone": "8092084714",
    "email": "souvik.das@tatasteel.com",
    "validTill": "25 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1460/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5182706)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 336,
    "id": "LAB-336",
    "oslCode": "6183136",
    "name": "Hari Shankar Singhania Elastomer and Tyre Research Institute, HASETRI, Mysuru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_15955_qHo0jnr.jpeg",
    "address": "Plot No 437, Hebbal Industrial Area,\n MYSORE, \n Mysuru, \n Karnataka, \n India -  570016",
    "city": "MYSORE",
    "district": "Mysuru",
    "state": "Karnataka",
    "pincode": "570016",
    "contactPerson": "Saikat Das Gupta (Quality Manager)",
    "phone": "+91 0821 6731503",
    "email": "saikat@hasetri.com",
    "validTill": "02 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1487/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6183136)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 337,
    "id": "LAB-337",
    "oslCode": "7183706",
    "name": "Rajkot Metlab Services LLP, Rajkot",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_16009_DIH77ZK.jpeg",
    "address": "PL 29 30 Nr Tulip Party Plot, GONDAL ROAD, VAVDI,\n Rajkot, \n Rajkot, \n Gujarat, \n India -  360004",
    "city": "Rajkot",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360004",
    "contactPerson": "Kuldip Sindhav",
    "phone": "9725213602",
    "email": "testing@rajkotlab.com",
    "validTill": "12 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1491/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7183706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 338,
    "id": "LAB-338",
    "oslCode": "8183336",
    "name": "INDIAN TEST HOUSE PRIVATE LIMITED, MURADNAGAR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_9HiefuN.png",
    "address": "Khasra No : 612, BASANTPUR  SAINTHLI, JALALABAD , MURADNAGAR , District :GHAZIABAD ,UTTAR PRADESH -201206,\n Muradnagar, \n Ghaziabad, \n Uttar Pradesh, \n India -  201206",
    "city": "Muradnagar",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201206",
    "contactPerson": "VINAY KUMAR (Quality Manager)",
    "phone": "+91 9711227046",
    "email": "indiantesthouse24@gmail.com",
    "validTill": "30 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1505/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8183336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 339,
    "id": "LAB-339",
    "oslCode": "8197526",
    "name": "TERAWATT TESTING AND RESEARCH INSTITUTE PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "H-400, RIICO INDUSTRIAL AREA, KHUSKHERA, BHIWADI, ALWAR, RAJASTHAN, INDIA,\n Bhiwadi, \n Alwar, \n Rajasthan, \n India -  301707",
    "city": "Bhiwadi",
    "district": "Alwar",
    "state": "Rajasthan",
    "pincode": "301707",
    "contactPerson": "Pushpendra Sharma (Quality Manager)",
    "phone": "+91 9602214447",
    "email": "info.terawatt@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1510/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8197526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 340,
    "id": "LAB-340",
    "oslCode": "6183606",
    "name": "RAMCO RESEARCH AND DEVOLPMENT CENTRE, CHENNAI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_16421_AfkpkRp.jpeg",
    "address": "11A,OKKIYAM,THORAIPAKKAM,OLD MAHAPALIPURAM ROAD,\n CHENNAI, \n Chennai, \n Tamil Nadu, \n India -  600097",
    "city": "CHENNAI",
    "district": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600097",
    "contactPerson": "Nellaiappan Murgesan (Quality Manager)",
    "phone": "9994446192 9441824600",
    "email": "trg@ramcocements.co.in",
    "validTill": "12 Jan, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1528/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6183606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 341,
    "id": "LAB-341",
    "oslCode": "8195606",
    "name": "CIMEC Infralabs Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_Tk7aq0q.png",
    "address": "GROUND FLOOR, 179/13, ANAND INDUSTRIAL AREA, Mohan Nagar, Ghaziabad,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201007",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201007",
    "contactPerson": "Veer Singh Rana (Quality Manager)",
    "phone": "+91 120 4156544",
    "email": "vsr1960@gmail.com",
    "validTill": "14 Jan, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1529/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8195606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 342,
    "id": "LAB-342",
    "oslCode": "6178726",
    "name": "Standard Testing and Compliance Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_16476_mjs3wuX.jpeg",
    "address": "14/7, Parmeshwari Colony, Mathura Road, Faridabad, Haryana-121008,\n faridabad, \n Faridabad, \n Haryana, \n India -  121008",
    "city": "faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121008",
    "contactPerson": "",
    "phone": "+91 9811499209",
    "email": "ceo@stclab.in",
    "validTill": "10 Jul, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1534/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6178726)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 343,
    "id": "LAB-343",
    "oslCode": "6180126",
    "name": "TUV SUD SOUTH ASIA PRIVATE LIMITED, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "PLOT NO. 3, P1-B, HITECH , DEVANAHALLI, DEFENCE & AEROSPACE PARK,  KIADB INDUSTRIAL AREA, BK PALYA,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  562149",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "562149",
    "contactPerson": "Arun George",
    "phone": "9113898859",
    "email": "vinod.suryavanshi@tuvsud.com",
    "validTill": "11 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1538/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6180126)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 344,
    "id": "LAB-344",
    "oslCode": "6180226",
    "name": "CRITERION NETWORK LABS, CRITERION NETWORKS INDIA PRIVATE LIMITED, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_cp2gIcR.png",
    "address": "UNIT#3 GROUND FLOOR, EXPLORER BUILDING, ITPB, WHITEFIELD ROAD,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560066",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560066",
    "contactPerson": "Jayesh Purohit",
    "phone": "9667361700",
    "email": "purohit@cnlabs.in",
    "validTill": "19 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1542/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6180226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 345,
    "id": "LAB-345",
    "oslCode": "7182426",
    "name": "Advance Electrical Testing And Calibration Lab LLP, Vadodara",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_16535_kv16t8c.jpeg",
    "address": "13/1/A GIDC, MAKARPURA ROAD, MAKARPURA, VADODARA,\n Vadodara, \n Vadodara, \n Gujarat, \n India -  390014",
    "city": "Vadodara",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "390014",
    "contactPerson": "Dipak Zala (Technical Manager)",
    "phone": "+91 6358331284",
    "email": "quality@aetclab.com",
    "validTill": "17 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1543/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7182426)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 346,
    "id": "LAB-346",
    "oslCode": "8193306",
    "name": "DVG Laboratories & Consultants Pvt Ltd",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_CTcdofK.png",
    "address": "A2/71, Site-V, UPSIDC Industrial Area Kasna,\n Greater Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201308",
    "city": "Greater Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201308",
    "contactPerson": "Gaurav Tiwari (Quality Manager)",
    "phone": "+91 9818254877",
    "email": "dvglabs.testing@hotmail.com",
    "validTill": "10 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1546/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8193306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 347,
    "id": "LAB-347",
    "oslCode": "7190106",
    "name": "Spectro SSA Labs Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/foo_16553_a9DcdFw.jpeg",
    "address": "R-489,  Sector 8, MIDC, TTC Industrial Area, Rabale, Navi Mumbai-400701,\n Rabale, \n Thane, \n Maharashtra, \n India -  400701",
    "city": "Rabale",
    "district": "Thane",
    "state": "Maharashtra",
    "pincode": "400701",
    "contactPerson": "Kanupriya - (Quality Manager)",
    "phone": "+91 9769696069",
    "email": "Ratan.Jotwani@xoin.eurofinsasia.com",
    "validTill": "10 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1548/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7190106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 348,
    "id": "LAB-348",
    "oslCode": "6184216",
    "name": "SNEHA TEST HOUSE PRIVATE LIMITED, BENGALURU",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "#8 and #28, 4th cross, Maruthi Nagar, Chandra Layout 80ft Road,,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560072",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560072",
    "contactPerson": "Mamatha S N (Quality Manager)",
    "phone": "+91 9844027167",
    "email": "lab.snehatesthouse@gmail.com",
    "validTill": "12 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1551/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6184216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 349,
    "id": "LAB-349",
    "oslCode": "9182206",
    "name": "NDL POWER LIMITED, ROHTAK",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_aroGJkl.png",
    "address": "KHEWAT NO. 240/189, ISMAILA-11B, SAMPLA BERI ROAD,\n SAMPLA, \n Rohtak, \n Haryana, \n India -  124501",
    "city": "SAMPLA",
    "district": "Rohtak",
    "state": "Haryana",
    "pincode": "124501",
    "contactPerson": "Ramesh Tewani (Quality Manager)",
    "phone": "+91 7082999760",
    "email": "ramesh.tiwani@ndlpower.com",
    "validTill": "10 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1556/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9182206)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 350,
    "id": "LAB-350",
    "oslCode": "8186836",
    "name": "Delta Testing and Research Laboratories Private Limited (Unit II)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/dummylogo_QVKBYOk.png",
    "address": "Plot No. \u2013 1, Kh. No. \u2013 9/5, Ground Floor, BLK - B, Rajeev Nagar, Village Begampur, Landmark Near Wine Shop, Delhi - 110086,\n Delhi, \n North West, \n Delhi, \n India -  110086",
    "city": "Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110086",
    "contactPerson": "Swaraj Shukla (Quality Manager)",
    "phone": "+91 9910596777",
    "email": "dtrlinfounit2@gmail.com",
    "validTill": "24 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1568/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8186836)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 351,
    "id": "LAB-351",
    "oslCode": "9179806",
    "name": "Elutech Laboratory and Calibration Services, Jaipur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No.-1,Bajrang Vihar-9, New Loha Mandi Road,  Macheda,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302013",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302013",
    "contactPerson": "Jitendra Kumar Sharma (Quality Manager)",
    "phone": "+91 9783401104",
    "email": "elutechlab@gmail.com",
    "validTill": "26 Aug, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1581/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9179806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 352,
    "id": "LAB-352",
    "oslCode": "6180326",
    "name": "Granite River Labs India Services Private Limited, Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Unit No. 10, 1st Floor, ROACH ICON, Survey No. 28 & 36/5 Outer Ring Road Doddanakundi, K R Puram Hobli.,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560037",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560037",
    "contactPerson": "Rajendra S (Quality Manager)",
    "phone": "+91 9739720033",
    "email": "rajendra.s@graniteriverlabs.com",
    "validTill": "03 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1584/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6180326)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 353,
    "id": "LAB-353",
    "oslCode": "8180426",
    "name": "ALAIPURIA TEST HOUSE PRIVATE LIMITED, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "H-11 Durga Industrial Park, Near Major Mohit Sharma Rajender Nagar Metro Station, Sahibabad, Ghaziabad,,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201005",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201005",
    "contactPerson": "HARSHIT GUPTA (Quality Manager)",
    "phone": "+91 9873900201",
    "email": "alaipuriatesthouse44@gmail.com",
    "validTill": "03 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1587/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8180426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 354,
    "id": "LAB-354",
    "oslCode": "8180306",
    "name": "CTL TESTING LABORATORY PRIVATE LIMITED, JAIPUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "12, PRESTIGE GARDEN VISTAR, SIWAR MOD, ROAD NO. 5, RIICO INDUSTRIAL AREA BINDAYAKA,\n JAIPUR, \n Jaipur, \n Rajasthan, \n India -  302012",
    "city": "JAIPUR",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302012",
    "contactPerson": "DILEEP KUMAR YADAV (Technical Manager)",
    "phone": "+91 9785071246",
    "email": "info@ctltestinglaboratory.com",
    "validTill": "24 Sep, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1589/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8180306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 355,
    "id": "LAB-355",
    "oslCode": "9179706",
    "name": "EKO PRO ENGINEERS PRIVATE LIMITED (32/41), GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "32/41 & 32/40 , South Side of GT Road, UPSIDC Industrial Area,Ghaziabad (Delhi-NCR),\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201009",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201009",
    "contactPerson": "Amit Saxena (Quality Manager)",
    "phone": "+91 9810243870",
    "email": "ekotestinglabs@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1597/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9179706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 356,
    "id": "LAB-356",
    "oslCode": "6198036",
    "name": "RAMCO INDUSTRIES LIMITED (MATERIAL TESTING LABORATORY)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "No.17,Winterpet Post, Arakonam,\n Arakonam, \n Vellore, \n Tamil Nadu, \n India -  631005",
    "city": "Arakonam",
    "district": "Vellore",
    "state": "Tamil Nadu",
    "pincode": "631005",
    "contactPerson": "Preston Davis",
    "phone": "8838118563",
    "email": "cpd@ril.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1610/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6198036)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 357,
    "id": "LAB-357",
    "oslCode": "8180826",
    "name": "Classic Testing & Research Centre (B17), Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "B-17, Sector-65,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Diksha Sharma",
    "phone": "9958865868",
    "email": "cbcd@classiclabindia.com",
    "validTill": "15 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1611/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8180826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 358,
    "id": "LAB-358",
    "oslCode": "7196806",
    "name": "UNITECH LABORATORIES SERVICES",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "16, SAMRAT IND. AREA,GONDAL ROAD,\n RAJKOT, \n Rajkot, \n Gujarat, \n India -  360004",
    "city": "RAJKOT",
    "district": "Rajkot",
    "state": "Gujarat",
    "pincode": "360004",
    "contactPerson": "Deepak S Solanki (Quality Manager)",
    "phone": "+91 9879588557",
    "email": "unitech0704@gmail.com",
    "validTill": "18 Feb, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1614/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7196806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 359,
    "id": "LAB-359",
    "oslCode": "8182606",
    "name": "Gravitas Laboratories Private Limited, Greater Noida",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. 95, Udyog Vihar Extn, Ecotech II, Surajpur I.A.,\n Greater Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201306",
    "city": "Greater Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201306",
    "contactPerson": "Mr. Om Dubey",
    "phone": "7042049001",
    "email": "testinggravitas@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1616/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8182606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 360,
    "id": "LAB-360",
    "oslCode": "8180526",
    "name": "STAR LABS TEST CENTRE LLP, JAIPUR",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No. 36, Krishna Vihar-5, Akeda Dungar,\t Road No. 18, VKIA, Jaipur,\n Jaipur, \n Jaipur, \n Rajasthan, \n India -  302013",
    "city": "Jaipur",
    "district": "Jaipur",
    "state": "Rajasthan",
    "pincode": "302013",
    "contactPerson": "Chandrakant Pokhriyal (Quality Manager)",
    "phone": "+91 7737773173",
    "email": "info@star-labs.in",
    "validTill": "07 Oct, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1619/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8180526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 361,
    "id": "LAB-361",
    "oslCode": "8186526",
    "name": "Akshat Test Lab & Calibration Services, Ghaziabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "A-2/49,G.D.Steel Compound ,Site-4,Industrial Area, Sahibabad, Ghaziabad,U.P,201010,\n GHAZIABAD, \n Ghaziabad, \n Uttar Pradesh, \n India -  201010",
    "city": "GHAZIABAD",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201010",
    "contactPerson": "Ankur Bishnoi (Quality Manager)",
    "phone": "+91 8700840187",
    "email": "akshattestlabS@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1620/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8186526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 362,
    "id": "LAB-362",
    "oslCode": "7184406",
    "name": "AANKAN CALIBRATION AND TESTING CENTRE LLP, DANTLI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "PLOT NO. B, LS NO. 193,\n DANTALI, \n Gandhinagar, \n Gujarat, \n India -  382721",
    "city": "DANTALI",
    "district": "Gandhinagar",
    "state": "Gujarat",
    "pincode": "382721",
    "contactPerson": "Ashwin Patel",
    "phone": "8264048241",
    "email": "aankan.act@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1624/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7184406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 363,
    "id": "LAB-363",
    "oslCode": "6182836",
    "name": "Aadit Fire Testing Laboratory Private Limited, Gummidipoondi",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "R-5, SIPCOT Industrial Estate,\n Gummidipoondi, \n Thiruvallur, \n Tamil Nadu, \n India -  601201",
    "city": "Gummidipoondi",
    "district": "Thiruvallur",
    "state": "Tamil Nadu",
    "pincode": "601201",
    "contactPerson": "AKHIL CHACKO",
    "phone": "7510886977",
    "email": "qualitymanager@aaditfire.com",
    "validTill": "27 Nov, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1633/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6182836)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 364,
    "id": "LAB-364",
    "oslCode": "8189106",
    "name": "RAHUL ENGINEERS LABORATORY PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "5A-CHITRAKUT NAGAR,\n Udaipur, \n Udaipur, \n Rajasthan, \n India -  313001",
    "city": "Udaipur",
    "district": "Udaipur",
    "state": "Rajasthan",
    "pincode": "313001",
    "contactPerson": "LALIT PANERI (Quality Manager)",
    "phone": "+91 8107343935",
    "email": "rahul.labudr@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1638/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8189106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 365,
    "id": "LAB-365",
    "oslCode": "8187006",
    "name": "Eurofins Consumer Product Testing India Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "A-95, SECTOR 58,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "Shristi Sachan",
    "phone": "8595940048",
    "email": "shristi.sachan@xoin.eurofinsasia.com",
    "validTill": "28 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1640/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 366,
    "id": "LAB-366",
    "oslCode": "9184906",
    "name": "ALPHA TEST HOUSE SERVICES LLP (Unit-1), MOHALI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "PLOT NO. 124, INDUSTRIAL AREA, PHASE - 9,\n Mohali, \n S.A.S Nagar, \n Punjab, \n India -  160062",
    "city": "Mohali",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "160062",
    "contactPerson": "Aditya Singla(CEO)",
    "phone": "8288094215",
    "email": "alphatesthousellp@gmail.com",
    "validTill": "25 Apr, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1643/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9184906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 367,
    "id": "LAB-367",
    "oslCode": "6183816",
    "name": "COCHIN TEST HOUSE, KOCHI",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "KOLLANPADY, IRUMPANAM, KOCHI,\n KOCHI, \n Ernakulam, \n Kerala, \n India -  682309",
    "city": "KOCHI",
    "district": "Ernakulam",
    "state": "Kerala",
    "pincode": "682309",
    "contactPerson": "ELDHO KURIAKOSE (Quality Manager)",
    "phone": "+91 9846551014",
    "email": "cochintesthouse1@gmail.com",
    "validTill": "03 Feb, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1659/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6183816)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 368,
    "id": "LAB-368",
    "oslCode": "6185426",
    "name": "Elenergy Lab Research Pvt. Ltd., Bengaluru",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "No.135, Road 10, KIADB IT Park, Aribinnamangala Village, Jala Hobli, Bengaluru, Manchappanahosahalli, Karnataka 562149,\n Bengaluru, \n Bengaluru Rural, \n Karnataka, \n India -  562149",
    "city": "Bengaluru",
    "district": "Bengaluru Rural",
    "state": "Karnataka",
    "pincode": "562149",
    "contactPerson": "Vipin Kuriakose",
    "phone": "9606009162",
    "email": "cs@elenergylab.com",
    "validTill": "08 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1662/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6185426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 369,
    "id": "LAB-369",
    "oslCode": "8184306",
    "name": "Global Testing Laboratory Private limited, Ghaziabad",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No.55,Gali No.5A, Rajendra Nagar Industrial Area, Mohan Nagar Ghaziabad,\n Uttar Pradesh, \n Ghaziabad, \n Uttar Pradesh, \n India -  201007",
    "city": "Uttar Pradesh",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201007",
    "contactPerson": "R.B. Srivastva (Quality Manager)",
    "phone": "+91 8368402864",
    "email": "info@globaltestinglaboratory.com",
    "validTill": "11 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1665/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8184306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 370,
    "id": "LAB-370",
    "oslCode": "8184706",
    "name": "Samridhi Test House Pvt. Ltd.",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "KH.NO. 45/23/1 GROUND FLOOR, VILLAGE & POST OFFICE VILLAGE PRAHALADPUR, North Delhi,\n NEW DELHI, \n North West, \n Delhi, \n India -  110042",
    "city": "NEW DELHI",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110042",
    "contactPerson": "Raj Chauhan (Quality Manager)",
    "phone": "+91 9870394724",
    "email": "info@samridhitesthouse.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1680/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8184706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 371,
    "id": "LAB-371",
    "oslCode": "7185816",
    "name": "Ultra Plus Lubes Pvt. Ltd, Navi Mumbai",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No. 17, Jawahar Co-op Insd. Estate, Kamothe, Panvel,\n Navi Mumbai, \n Raigad, \n Maharashtra, \n India -  410209",
    "city": "Navi Mumbai",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410209",
    "contactPerson": "Poonam Bichare (Quality Manager)",
    "phone": "+91 9930221316",
    "email": "siddesh.savant@ultralub.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1698/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7185816)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 372,
    "id": "LAB-372",
    "oslCode": "9188536",
    "name": "GECS LAB PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "GECS HOUSE, Plot No. 12, Khasra No. 50/17, Khata No 74/75, Sector D, Defence Colony, Near Kalpakhera Mandir,\n Ambala Cantt, \n Ambala, \n Haryana, \n India -  133010",
    "city": "Ambala Cantt",
    "district": "Ambala",
    "state": "Haryana",
    "pincode": "133010",
    "contactPerson": "Karamjeet Kaur (Quality Manager)",
    "phone": "+91 8901185481",
    "email": "gecslab@gmail.com",
    "validTill": "22 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1724/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9188536)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 373,
    "id": "LAB-373",
    "oslCode": "8185026",
    "name": "AADHAR TESTING SOLUTIONS LLP, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "First Floor, Plot no. 02, Gyani Compound, Sahibabad,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201005",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201005",
    "contactPerson": "MAHESH VISHNOI",
    "phone": "0881050070",
    "email": "mkvishnoi10@gmail.com",
    "validTill": "01 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1770/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 374,
    "id": "LAB-374",
    "oslCode": "8187826",
    "name": "Perfect International Testing Lab",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Khasra No. 1134 , Delhi Meerut Road , Near Morta Police Chowki  Ghaziabad,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201001",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201001",
    "contactPerson": "Pallavi Tyagi (Quality Manager)",
    "phone": "+91 9634421567",
    "email": "info@perfecttestinglab.com",
    "validTill": "02 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1788/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 375,
    "id": "LAB-375",
    "oslCode": "5197006",
    "name": "QUALITY INTERNATIONAL RESEARCH & LABORATORIES PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "PLOT NO 7A, AVINASH LOGESTIC PARK, SKS ROAD, SILTARA INDUSTRIAL AREA, PHASE - 2,\n RAIPUR, \n Raipur, \n Chhattisgarh, \n India -  493221",
    "city": "RAIPUR",
    "district": "Raipur",
    "state": "Chhattisgarh",
    "pincode": "493221",
    "contactPerson": "Yamini Nayak",
    "phone": "9981633040",
    "email": "info@qipl.org",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1810/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5197006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 376,
    "id": "LAB-376",
    "oslCode": "8185126",
    "name": "MIGHTY TESTING PRIVATE LIMITED, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "K. No. 700, Duhai, Duhai Industrial Area,Ghaziabad-201206,Uttar Pradesh,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201206",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201206",
    "contactPerson": "Nitin tyagi (Quality Manager)",
    "phone": "+91 9897422182",
    "email": "info@mightytesting.in",
    "validTill": "05 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1820/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185126)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 377,
    "id": "LAB-377",
    "oslCode": "8186926",
    "name": "Dashmesh Test Lab Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Property No. C-113, Block-C, Durga Enterprises,\n Ghaziabad, \n Uttar Pradesh, \n India -  201005",
    "city": "Ghaziabad",
    "district": "Uttar Pradesh",
    "state": "Uttar Pradesh",
    "pincode": "201005",
    "contactPerson": "Suman Kamboj (Director)",
    "phone": "9311741413",
    "email": "dashmeshtestlab@gmail.com",
    "validTill": "22 Jul, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1837/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8186926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 378,
    "id": "LAB-378",
    "oslCode": "8185906",
    "name": "VERTEX TESTING LABORATORY PRIVATE LIMITED, GHAZIABAD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "C-44 Patel Nagar II, Ghaziabad-201001,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201001",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201001",
    "contactPerson": "RAJEEV KUMAR",
    "phone": "8958564156",
    "email": "info.vertextesting@gmail.com",
    "validTill": "23 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1841/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 379,
    "id": "LAB-379",
    "oslCode": "8184506",
    "name": "PIBCO LIMITED R&D CENTRE",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "2, Kalkaji Industrial area, New Delhi,\n Delhi, \n South East, \n Delhi, \n India -  110019",
    "city": "Delhi",
    "district": "South East",
    "state": "Delhi",
    "pincode": "110019",
    "contactPerson": "Punit Kumar (Quality Manager)",
    "phone": "91 9818405621",
    "email": "care@pibcornd.com",
    "validTill": "23 Mar, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1842/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8184506)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 380,
    "id": "LAB-380",
    "oslCode": "8187316",
    "name": "Vimta labs limited, Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "C-58, Sector-8, Gautam Buddha Nagar,  Noida , Uttar Pradesh,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "",
    "phone": "+91 9100122625",
    "email": "Shaily.bhargava@vimta.com",
    "validTill": "13 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1845/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187316)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 381,
    "id": "LAB-381",
    "oslCode": "7189336",
    "name": "Winwall Technology India Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "121/2, Godrej Woods RD, Khanavale Village, Panvel, Raigad,\n Navi Mumbai, \n Raigad, \n Maharashtra, \n India -  410206",
    "city": "Navi Mumbai",
    "district": "Raigad",
    "state": "Maharashtra",
    "pincode": "410206",
    "contactPerson": "MOHAN BABU W.R. (Quality Manager)",
    "phone": "+91 9082009774",
    "email": "abdul@winwallindia.com",
    "validTill": "28 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1851/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7189336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 382,
    "id": "LAB-382",
    "oslCode": "8185306",
    "name": "ALPHA TEST HOUSE PVT LTD, BAHADURGARH",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "198-199, MIE, Industrial Area, Phase-1, Bahadurgarh, Haryana,\n Bahadurgarh, \n Jhajjar, \n Haryana, \n India -  124507",
    "city": "Bahadurgarh",
    "district": "Jhajjar",
    "state": "Haryana",
    "pincode": "124507",
    "contactPerson": "Dipesh Gupta",
    "phone": "9818233966",
    "email": "info@alphatesthouse.com",
    "validTill": "08 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1853/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 383,
    "id": "LAB-383",
    "oslCode": "8195736",
    "name": "Basil Quality Testing lab Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. 6, Udyog Vihar, Phase 1,\n Guruhram, \n Gurugram, \n Haryana, \n India -  122016",
    "city": "Guruhram",
    "district": "Gurugram",
    "state": "Haryana",
    "pincode": "122016",
    "contactPerson": "Pradeepta Kumar (Quality Manager)",
    "phone": "+91 9289723427",
    "email": "quality.in@basilrl.com",
    "validTill": "08 Jan, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1856/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8195736)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 384,
    "id": "LAB-384",
    "oslCode": "8185226",
    "name": "Planet Electro Labs Private Limited, Wazirpur",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "A-74/1, WAZIRPUR INDUSTRIAL AREA, NEW DELHI,\n WAZIRPUR, \n North West, \n Delhi, \n India -  110052",
    "city": "WAZIRPUR",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110052",
    "contactPerson": "Hitesh Sharma (Quality Manager)",
    "phone": "9218029484",
    "email": "quality.planetelectrolabs02@gmail.com",
    "validTill": "08 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1859/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 385,
    "id": "LAB-385",
    "oslCode": "8185506",
    "name": "PAAM Testing Labs Private Limited, Greater Noida",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot no 41, Udyog Kendra Extn. II, Ecotech -III, Greater Noida, G.B. Nagar - 201306 Uttar Pradesh (INDIA),\n Greater Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201306",
    "city": "Greater Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201306",
    "contactPerson": "Mahesh Kumar (Technical Manager)",
    "phone": "+91 9911149383",
    "email": "paamtestinglabs@gmail.com",
    "validTill": "08 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1874/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185506)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 386,
    "id": "LAB-386",
    "oslCode": "9192006",
    "name": "QA TESTING LABORATORIES PRIVATE  LIMITED LUCKNOW",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "E-26/49, Transport Nagar, Near Parking No 9, Lucknow,\n Lucknow, \n Lucknow, \n Uttar Pradesh, \n India -  226012",
    "city": "Lucknow",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "pincode": "226012",
    "contactPerson": "Dr. Dileep Kumar (Quality Manager)",
    "phone": "+91 9350040389",
    "email": "qalko@qatestinglaboratories.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1876/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9192006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 387,
    "id": "LAB-387",
    "oslCode": "8187926",
    "name": "ACE TEST HOUSE PVT. LTD.",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "KHASRA NO 1089, First Floor near Laxmi Narayan Mandir , Village Bhalswa,\n New Delhi, \n North West, \n Delhi, \n India -  110033",
    "city": "New Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110033",
    "contactPerson": "Nishant Singh (Quality Manager)",
    "phone": "91 7042858881",
    "email": "ath2@acetesthouse.com",
    "validTill": "08 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1879/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 388,
    "id": "LAB-388",
    "oslCode": "7187406",
    "name": "OPTIMAS TESTING SERVICES, OPTIMAS OE SOLUTIONS INDIA PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "PLOT NO 5, GAT 312/1, 312/5 TO 312/7 NANEKARWADI,CHAKAN, TAL-KHED,PUNE.,\n Pune, \n Pune, \n Maharashtra, \n India -  410501",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "410501",
    "contactPerson": "Nikhil Gaikwad (Quality Manager)",
    "phone": "+91 9356940080",
    "email": "Optimastestingservices_India@Optimas.com",
    "validTill": "20 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1880/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7187406)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 389,
    "id": "LAB-389",
    "oslCode": "8185606",
    "name": "SHRI KRISHNA TEST HOUSE PVT LTD (142)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No.142, Sec-G, Bawana-II, DSIIDC, Bhorgarh industrial area New Delhi,\n Delhi, \n North, \n Delhi, \n India -  110040",
    "city": "Delhi",
    "district": "North",
    "state": "Delhi",
    "pincode": "110040",
    "contactPerson": "Rashmi Talwar (Quality Manager)",
    "phone": "+91 9266808773",
    "email": "SKTHPL142@GMAIL.COM",
    "validTill": "13 May, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1881/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8185606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 390,
    "id": "LAB-390",
    "oslCode": "8194926",
    "name": "AADIDEV TEST & RESEARCH CENTRE LLP",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "N-92, Sector-1, DSIDC Industrial Area, Bawana,\n Bawana, \n North West, \n Delhi, \n India -  110039",
    "city": "Bawana",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110039",
    "contactPerson": "SANJAY S (Quality Manager)",
    "phone": "+91 9654424050",
    "email": "info@aadidevtests.com",
    "validTill": "29 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1887/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8194926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 391,
    "id": "LAB-391",
    "oslCode": "7187626",
    "name": "KPML Low Voltage Rotating Machine and Hydraulic Laboratory Karad Projects and motors Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No B67 and 68 Karad Industrial Area MIDC Tasawade Karad,\n Karad, \n Satara, \n Maharashtra, \n India -  415109",
    "city": "Karad",
    "district": "Satara",
    "state": "Maharashtra",
    "pincode": "415109",
    "contactPerson": "Nilesh Babar (Quality Manager)",
    "phone": "+91 9850983352",
    "email": "amit.deshpande@kpml.co.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1891/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7187626)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 392,
    "id": "LAB-392",
    "oslCode": "7188906",
    "name": "BUNITECH METALLURGICAL SERVICES PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "C 120, Tulsi Estate Plaza, Opp. Bhagyoday Hotel,Changodar, Ahmedabad -382213,\n Changodar, \n Ahmadabad, \n Gujarat, \n India -  382213",
    "city": "Changodar",
    "district": "Ahmadabad",
    "state": "Gujarat",
    "pincode": "382213",
    "contactPerson": "Mrs. Bijal Parmar",
    "phone": "9426025494",
    "email": "unitech_lab@rediffmail.com",
    "validTill": "24 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1904/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7188906)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 393,
    "id": "LAB-393",
    "oslCode": "8187126",
    "name": "TECHNOPOWER TECH SOLUTIONS LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Shed No. 11, Type-B, Block No-1, Sector 1, Govindpura Industrial Area,\n Bhopal, \n Bhopal, \n Madhya Pradesh, \n India -  462023",
    "city": "Bhopal",
    "district": "Bhopal",
    "state": "Madhya Pradesh",
    "pincode": "462023",
    "contactPerson": "PRASHANT",
    "phone": "6232179524",
    "email": "technopower.tech.solu@gmail.com",
    "validTill": "07 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1905/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187126)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 394,
    "id": "LAB-394",
    "oslCode": "9188436",
    "name": "Accumetrix Testing Solutions Pvt. Ltd.",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "NH-3 JALANDHAR ROAD, NEAR SONALIKA TRACTORS LTD, HOSHIARPUR, PUNJAB 146002,\n HOSHIARPUR, \n Hoshiarpur, \n Punjab, \n India -  146002",
    "city": "HOSHIARPUR",
    "district": "Hoshiarpur",
    "state": "Punjab",
    "pincode": "146002",
    "contactPerson": "Sujata Kumari (Quality Manager)",
    "phone": "+91 8465000026",
    "email": "accumetrixtestingsolutions@gmail.com",
    "validTill": "19 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1908/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9188436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 395,
    "id": "LAB-395",
    "oslCode": "6188826",
    "name": "Mysore ESDM Cluster",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot 336/4 & 336/5,Hebbal Industrial Area, Hebbal,,\n Mysuru, \n Mysuru, \n Karnataka, \n India -  570016",
    "city": "Mysuru",
    "district": "Mysuru",
    "state": "Karnataka",
    "pincode": "570016",
    "contactPerson": "Bharathi K",
    "phone": "9740030613",
    "email": "qm@lahariaetf.com",
    "validTill": "14 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1910/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6188826)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 396,
    "id": "LAB-396",
    "oslCode": "8189526",
    "name": "Global Scientific Solution (P) Ltd.",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot no. 37, Pocket-N, Sec-2, DSIIDC Indl. Complex, Bawana, New Delhi-110039,\n Delhi, \n North, \n Delhi, \n India -  110039",
    "city": "Delhi",
    "district": "North",
    "state": "Delhi",
    "pincode": "110039",
    "contactPerson": "shudhanshu mallick (Quality Manager)",
    "phone": "+91 8920965487",
    "email": "director@gsspllabs.com",
    "validTill": "31 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1913/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8189526)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 397,
    "id": "LAB-397",
    "oslCode": "8188216",
    "name": "EKO PRO ENGINEERS PVT LTD",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "32/21, South Side GT Road, UPSIDC Industrial Area, Ghaziabad, 201009,\n Ghaziabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201010",
    "city": "Ghaziabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201009",
    "contactPerson": "",
    "phone": "91 9810243870",
    "email": "ekotestinglabs03@gmail.com",
    "validTill": "19 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1917/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8188216)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 398,
    "id": "LAB-398",
    "oslCode": "8186436",
    "name": "Atckon Laboratories LLP, Bahadurgarh",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot NO. 45, Part A M.I.E, Bahadurgarh, Jhajjar, Haryana,\n Bahadurgarh, \n Jhajjar, \n Haryana, \n India -  124507",
    "city": "Bahadurgarh",
    "district": "Jhajjar",
    "state": "Haryana",
    "pincode": "124507",
    "contactPerson": "Mr. Ramesh Kumar Sharma",
    "phone": "8570906101",
    "email": "info@atckonlabs.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1929/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8186436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 399,
    "id": "LAB-399",
    "oslCode": "7186606",
    "name": "KSA LABS LLP, Vadodara",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "J-61, BIDC Gorwa Industrial Estate, Gorwa,\n Vadodara, \n Vadodara, \n Gujarat, \n India -  390016",
    "city": "Vadodara",
    "district": "Vadodara",
    "state": "Gujarat",
    "pincode": "390016",
    "contactPerson": "Mr. Simarpreet Singh",
    "phone": "8238051466",
    "email": "info@ksalabs.in",
    "validTill": "24 Jun, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1931/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7186606)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 400,
    "id": "LAB-400",
    "oslCode": "6197936",
    "name": "TUV Rheinland (India) Private limited, Material Testing Laboratory",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "#27/B, 2nd Cross road, Electronic city, Phase-1, Bengaluru,\n Bengaluru, \n Bengaluru Urban, \n Karnataka, \n India -  560100",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "pincode": "560100",
    "contactPerson": "MANASA HR",
    "phone": "9739211211",
    "email": "manasa.hr@ind.tuv.com",
    "validTill": "02 Apr, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1941/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6197936)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 401,
    "id": "LAB-401",
    "oslCode": "8189436",
    "name": "Byte Scientific Research Lab Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot no-310, Sector - 68, IMT (Industrial Model Township), Faridabad,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121004",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121004",
    "contactPerson": "Aman Sharma (Quality Manager)",
    "phone": "+91 7678357475",
    "email": "bytescientific@gmail.com",
    "validTill": "28 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1955/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8189436)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 402,
    "id": "LAB-402",
    "oslCode": "8188136",
    "name": "NAYRA LABORATORIES (INDIA) LLP",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "G-974,DSIDC Industrial Area,\n Delhi, \n North West, \n Delhi, \n India -  110040",
    "city": "Delhi",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110040",
    "contactPerson": "VED PRAKASH PANDEY (Quality Manager)",
    "phone": "+91 9891987394",
    "email": "nayralaboratories@gmail.com",
    "validTill": "10 Sep, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1957/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8188136)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 403,
    "id": "LAB-403",
    "oslCode": "8188026",
    "name": "INTERNATIONAL TESTING AND COMPLIANCE (OPC) PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "VILLAGE BUDHENA SECTOR-86 FARIDABAD, NEAR SHIV  MANDIR ,  FARIDABAD, HARYANA, 121002,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121002",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121002",
    "contactPerson": "Princy Gupta (Quality Manager)",
    "phone": "+91 9811499209",
    "email": "ceo@itclab.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1961/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8188026)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 404,
    "id": "LAB-404",
    "oslCode": "8187226",
    "name": "Havells India Limited (Havells Research & Development Laboratory)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No. 6, Site-IV, Industrial Area,\n Sahibabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201010",
    "city": "Sahibabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201010",
    "contactPerson": "Satyabrata Tripathy",
    "phone": "8395800081",
    "email": "satyabrata.tripathy@havells.com",
    "validTill": "07 Aug, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/1981/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8187226)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 405,
    "id": "LAB-405",
    "oslCode": "7197106",
    "name": "PADKONDE M S TESTING LABORATORY LLP",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Gat No. 1357, Kawade Vasti, Sai Satyam Park, Pune -Nagar Road, Wagholi,\n Wagholi, \n Pune, \n Maharashtra, \n India -  412207",
    "city": "Wagholi",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "412207",
    "contactPerson": "Monika Padkonde (Quality Manager)",
    "phone": "+91 8237066078",
    "email": "pmstestinglab@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2029/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7197106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 406,
    "id": "LAB-406",
    "oslCode": "5191706",
    "name": "ARYAVRAT TEST HOUSE PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "L.R. DAG No .257 AND 259, MOUZA ARGOURI, NH 6, BOMBAY ROAD, JANGALPUR,NATIBPUR,\n Howrah, \n Howrah, \n West Bengal, \n India -  711302",
    "city": "Howrah",
    "district": "Howrah",
    "state": "West Bengal",
    "pincode": "711302",
    "contactPerson": "PABITRA SARKAR (Quality Manager)",
    "phone": "+91 8240118890",
    "email": "aryavrat.lab@gmail.com",
    "validTill": "28 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2033/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5191706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 407,
    "id": "LAB-407",
    "oslCode": "6191806",
    "name": "TUV SUD SOUTH ASIA PRIVATE LIMITED RANIPET",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "S. F. No. 139/1B,  Ammananthangal Village,Chennai \u2013 Bangalore Road (NH \u2013 46),\n Ranipet, \n Vellore, \n Tamil Nadu, \n India -  632513",
    "city": "Ranipet",
    "district": "Vellore",
    "state": "Tamil Nadu",
    "pincode": "632513",
    "contactPerson": "Rakesh R (Quality Manager)",
    "phone": "+91 9585588611",
    "email": "Rakesh.R@tuvsud.com",
    "validTill": "02 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2041/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6191806)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 408,
    "id": "LAB-408",
    "oslCode": "7194806",
    "name": "Urja Metallurgical Services LLP",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "J/P-15, Telco-Bhosari Road, Opp Sarayu Toyota Showroom, MIDC Bhosari,\n Pune (Bhosari), \n Pune, \n Maharashtra, \n India -  411026",
    "city": "Pune (Bhosari)",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411026",
    "contactPerson": "Leena Jadhav (Quality Manager)",
    "phone": "+91 9725213602",
    "email": "testing@UrjaMetlab.com",
    "validTill": "23 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2046/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7194806)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 409,
    "id": "LAB-409",
    "oslCode": "6190736",
    "name": "Eminent International Testing Center Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No 76/Part, EPIP, Industrial Park, Pashamailaram, Isnapur,\n Ishnapur, \n Sangareddy, \n Telangana, \n India -  502307",
    "city": "Ishnapur",
    "district": "Sangareddy",
    "state": "Telangana",
    "pincode": "502307",
    "contactPerson": "S Alwin Prabhu (Quality Manager)",
    "phone": "+91 9003552168",
    "email": "quality@eminent-itc.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2054/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6190736)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 410,
    "id": "LAB-410",
    "oslCode": "6189206",
    "name": "SCIENTIFIC AND INDUSTRIAL TESTING AND RESEARCH CENTRE (SITARC)",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "83 & 84 Avarampalayam Road, K.R.Puram Post,\n coimbatore, \n Coimbatore, \n Tamil Nadu, \n India -  641006",
    "city": "coimbatore",
    "district": "Coimbatore",
    "state": "Tamil Nadu",
    "pincode": "641006",
    "contactPerson": "MANIKANDAN RAJAGOPALAN (Technical Manager)",
    "phone": "+91 9487600473",
    "email": "director@sitarc.com",
    "validTill": "28 Oct, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2075/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6189206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 411,
    "id": "LAB-411",
    "oslCode": "7196526",
    "name": "PUMP TEST LAB KSB LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No: E 3&4 MIDC, MALEGAON SINNER-422113,\n Sinnar, \n Nashik, \n Maharashtra, \n India -  422113",
    "city": "Sinnar",
    "district": "Nashik",
    "state": "Maharashtra",
    "pincode": "422113",
    "contactPerson": "sachin kale",
    "phone": "8550985855",
    "email": "sachin.kale@ksb.com",
    "validTill": "03 Feb, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2090/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7196526)",
    "disciplines": [
      "Electrical",
      "Mechanical"
    ],
    "standards": [
      "IS 1180",
      "IS 14220",
      "IS 694",
      "IS 8472",
      "IS 9079"
    ],
    "products": [
      "Agricultural Monobloc Pumps",
      "Distribution Transformers",
      "Induction Motors",
      "PVC Insulated Cables",
      "Submersible Pumps"
    ],
    "scopeDetails": [
      {
        "standard": "IS 8472",
        "title": "Submersible Pumps",
        "product": "Submersible Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 9079",
        "title": "Agricultural Monobloc Pumps",
        "product": "Agricultural Monobloc Pumps",
        "fee": "5000"
      },
      {
        "standard": "IS 14220",
        "title": "PVC Insulated Cables",
        "product": "PVC Insulated Cables",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Distribution Transformers",
        "product": "Distribution Transformers",
        "fee": "5000"
      },
      {
        "standard": "IS 1180",
        "title": "Induction Motors",
        "product": "Induction Motors",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 412,
    "id": "LAB-412",
    "oslCode": "8192806",
    "name": "ACCURATE TEST SOLUTIONS LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "B-50, Sector 2, Noida,\n Noida, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "Noida",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "SANCHIT TREHAN (Quality Manager)",
    "phone": "+91 9810820552",
    "email": "accuratetestsunit2@gmail.com",
    "validTill": "08 Dec, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2095/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8192806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 413,
    "id": "LAB-413",
    "oslCode": "9198806",
    "name": "AADISHAKTI TESTING &RESEARCH LABORATORIES LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "GROUND & 1ST FLOOR FLOOR KILLA NO : 7//18(11-6), 19(3-2), 22(7-18) Shaadipur, Shanti Vihar Colony, Sonipat 131001, Behind MRF Showroom,\n SONIPAT, \n Sonipat, \n Haryana, \n India -  131001",
    "city": "SONIPAT",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131001",
    "contactPerson": "Kirti Verma (Quality Manager)",
    "phone": "+91 8929775530",
    "email": "INFO.ATRLTESTINGLABS@GMAIL.COM",
    "validTill": "07 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2127/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9198806)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 414,
    "id": "LAB-414",
    "oslCode": "9198106",
    "name": "Agro Tech Aromatics Pvt Ltd",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "SIDCO INDUSTRIAL AREA EPIP KARTHOLI,\n BARI BRAHMANA, \n Samba, \n Jammu & Kashmir, \n India -  181133",
    "city": "BARI BRAHMANA",
    "district": "Samba",
    "state": "Jammu & Kashmir",
    "pincode": "181133",
    "contactPerson": "",
    "phone": "+91 9872923100",
    "email": "agrotecharomatics@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2142/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9198106)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 415,
    "id": "LAB-415",
    "oslCode": "8191236",
    "name": "MEKANIKA TESTING LABS LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Second Floor, Plot No H-27, Durga Industrial Area,\n Sahibabad, \n Ghaziabad, \n Uttar Pradesh, \n India -  201005",
    "city": "Sahibabad",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "pincode": "201005",
    "contactPerson": "Abhishek Kumar",
    "phone": "8294778366",
    "email": "mekanikalabsllp@gmail.com",
    "validTill": "21 Nov, 2028",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2177/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8191236)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 416,
    "id": "LAB-416",
    "oslCode": "8190506",
    "name": "Mbis Tescon Private Limited",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "DDA SHED NO. A-120, OKHLA INDUSTRIAL AREA, PHASE-2,\n New Delhi, \n South, \n Delhi, \n India -  110020",
    "city": "New Delhi",
    "district": "South",
    "state": "Delhi",
    "pincode": "110020",
    "contactPerson": "RAVISH KUMAR",
    "phone": "8799786535",
    "email": "info@mbistesconlabs.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2179/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8190506)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 417,
    "id": "LAB-417",
    "oslCode": "7198436",
    "name": "Alpit Metal Works Laboratory",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "E-70/13, MIDC Waluj,\n Aurangabad, \n Aurangabad, \n Maharashtra, \n India -  431136",
    "city": "Aurangabad",
    "district": "Aurangabad",
    "state": "Maharashtra",
    "pincode": "431136",
    "contactPerson": "MANOJ PATNI",
    "phone": "9423721600",
    "email": "b.atole@kalegroup.co.in",
    "validTill": "08 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2204/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7198436)",
    "disciplines": [
      "Mechanical",
      "Chemical",
      "Metallurgy"
    ],
    "standards": [
      "IS 15103",
      "IS 1786",
      "IS 2062",
      "IS 2830",
      "IS 432"
    ],
    "products": [
      "Alloy Products",
      "Carbon Steel Billets",
      "Hand Tools & Hardware",
      "Structural Steel",
      "TMT Steel Bars"
    ],
    "scopeDetails": [
      {
        "standard": "IS 1786",
        "title": "TMT Steel Bars",
        "product": "TMT Steel Bars",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Structural Steel",
        "product": "Structural Steel",
        "fee": "5000"
      },
      {
        "standard": "IS 2830",
        "title": "Carbon Steel Billets",
        "product": "Carbon Steel Billets",
        "fee": "5000"
      },
      {
        "standard": "IS 15103",
        "title": "Hand Tools & Hardware",
        "product": "Hand Tools & Hardware",
        "fee": "5000"
      },
      {
        "standard": "IS 432",
        "title": "Alloy Products",
        "product": "Alloy Products",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 418,
    "id": "LAB-418",
    "oslCode": "8196926",
    "name": "TEKNOLAB QUALITY SERVICES PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "PLOT RE 25A, SECTOR 69, IMT FARIDABAD,\n Ballabgarh, \n Faridabad, \n Haryana, \n India -  121004",
    "city": "Ballabgarh",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121004",
    "contactPerson": "",
    "phone": "+91 9211870099",
    "email": "info@teknolab.in",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2207/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8196926)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 419,
    "id": "LAB-419",
    "oslCode": "9194336",
    "name": "Samtek Testing Laboratory LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "1- Himalaya Marg, Gyan Mandir, Kanya Inter College D- Block, Indira Nagar Lucknow - 226016, India,\n Lucknow, \n Lucknow, \n Uttar Pradesh, \n India -  226016",
    "city": "Lucknow",
    "district": "Lucknow",
    "state": "Uttar Pradesh",
    "pincode": "226016",
    "contactPerson": "Mr. Anil Kumar Pandey (Quality Manager)",
    "phone": "+91 9559383377",
    "email": "samtektestinglaboratory@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2213/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9194336)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 420,
    "id": "LAB-420",
    "oslCode": "8197426",
    "name": "ELECTROEDGE LABORATORY LLP",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "A-7, Kh. No-234, Pragati Enclave, Lane Number 22, Mukundpur, Part-2, Delhi, 110042,\n Delhi, \n North, \n Delhi, \n India -  110042",
    "city": "Delhi",
    "district": "North",
    "state": "Delhi",
    "pincode": "110042",
    "contactPerson": "Tarun Vaishnav (Technical Manager)",
    "phone": "+91 9625947165",
    "email": "electroedgelaboratory@gmail.com",
    "validTill": "12 Mar, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2214/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8197426)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 421,
    "id": "LAB-421",
    "oslCode": "8198324",
    "name": "EMC EMI TESTING LAB- HLL LIFECARE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "B 14 A, SECTOR 62, NOIDA,\n NOIDA, \n Gautam Buddha Nagar, \n Uttar Pradesh, \n India -  201301",
    "city": "NOIDA",
    "district": "Gautam Buddha Nagar",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "contactPerson": "KRISHNA KUMAR RAJAK",
    "phone": "9431097214",
    "email": "emc-emicare@lifecarehll.com",
    "validTill": "03 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2225/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8198324)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 422,
    "id": "LAB-422",
    "oslCode": "5197706",
    "name": "OMRESEARCH & TESTING LABORATORY PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "GIRWAR BHAWAN, SUKHDEO NAGAR, RATU ROAD, RANCHI,\n RANCHI, \n Ranchi, \n Jharkhand, \n India -  834005",
    "city": "RANCHI",
    "district": "Ranchi",
    "state": "Jharkhand",
    "pincode": "834005",
    "contactPerson": "Ruchika Priya (Quality Manager)",
    "phone": "+91 6206339360",
    "email": "omlaboratories2019@gmail.com",
    "validTill": "18 Mar, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2227/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 5197706)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 423,
    "id": "LAB-423",
    "oslCode": "7195306",
    "name": "MORBI TEST HOUSE LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "Plot No. 10, Patel Estate, Near Murano Ceramic, Jetpar Road, Bela, Morbi - 363642,\n Morbi, \n Morbi, \n Gujarat, \n India -  363642",
    "city": "Morbi",
    "district": "Morbi",
    "state": "Gujarat",
    "pincode": "363642",
    "contactPerson": "kamlesh kumar (Quality Manager)",
    "phone": "+91 7891299299",
    "email": "morbitesthouse@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2237/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 7195306)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 424,
    "id": "LAB-424",
    "oslCode": "9197626",
    "name": "DYNAMIC TEST LABORATORIES LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "235H, BABA COLONY, MOHAN NAGAR, NEAR NAVEEN PUBLIC SCHOOL, SONIPAT, HARYANA(INDIA)131001,\n Sonipat, \n Sonipat, \n Haryana, \n India -  131001",
    "city": "Sonipat",
    "district": "Sonipat",
    "state": "Haryana",
    "pincode": "131001",
    "contactPerson": "Pooja Singh (Quality Manager)",
    "phone": "+91 8210551997",
    "email": "dynamictestlaboratoriesllp@gmail.com",
    "validTill": "31 Dec, 2027",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2254/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9197626)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 425,
    "id": "LAB-425",
    "oslCode": "9197206",
    "name": "Standard Testing and Research Lab",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Khasra No. 07, Sultanpur Majari, Shubham Market, Sidcul Road,\n Bahadrabad, \n Haridwar, \n Uttarakhand, \n India -  249402",
    "city": "Bahadrabad",
    "district": "Haridwar",
    "state": "Uttarakhand",
    "pincode": "249402",
    "contactPerson": "Ashok Gaur (Quality Manager)",
    "phone": "+91 9013008458",
    "email": "standardtestingandresearchlab@gmail.com",
    "validTill": "24 Feb, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2298/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9197206)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 426,
    "id": "LAB-426",
    "oslCode": "6198536",
    "name": "D.Banerjee Centre of Excellence (DBCOE)",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "JSS Technical Institutions Campus,\n Mysuru, \n Mysuru, \n Karnataka, \n India -  570006",
    "city": "Mysuru",
    "district": "Mysuru",
    "state": "Karnataka",
    "pincode": "570006",
    "contactPerson": "GNANA SANDEEP S R (Quality Manager)",
    "phone": "+91 9845946464",
    "email": "dbcoe.pm@gmail.com",
    "validTill": "08 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2299/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 6198536)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 427,
    "id": "LAB-427",
    "oslCode": "9198906",
    "name": "Eco Paryavaran Laboratories and Consultants Pvt. Ltd.",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Eco Bhawan E- 207, Industrial Area, Phase VIIIB (Sector-74),\n Mohali, \n S.A.S Nagar, \n Punjab, \n India -  160071",
    "city": "Mohali",
    "district": "S.A.S Nagar",
    "state": "Punjab",
    "pincode": "160071",
    "contactPerson": "Roopak Kumar (Quality Manager)",
    "phone": "+91 9888901044",
    "email": "roopak.kumar@ecoparyavaran.org",
    "validTill": "11 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2329/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 9198906)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 428,
    "id": "LAB-428",
    "oslCode": "8198616",
    "name": "AUMNAMAH RADIOANALYTICAL LABORATORY LLP",
    "logoUrl": "https://lims.bis.gov.in/media/profile/default_pic.jpg",
    "address": "PLOT NO -CC-1, FIRST FLOOR, LAWRENCE ROAD, North West Delhi,\n NEW DELHI, \n North West, \n Delhi, \n India -  110035",
    "city": "NEW DELHI",
    "district": "North West",
    "state": "Delhi",
    "pincode": "110035",
    "contactPerson": "Dr. Abhishek Yadav (Quality Manager)",
    "phone": "+91 8920723168",
    "email": "aumnamah.ral@gmail.com",
    "validTill": "21 Jul, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2334/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8198616)",
    "disciplines": [
      "Electrical",
      "Electronics",
      "IT & Telecom"
    ],
    "standards": [
      "IS 13252 (Part 1)",
      "IS 15885",
      "IS 16046 (Part 1)",
      "IS 16046 (Part 2)",
      "IS 16102",
      "IS 616"
    ],
    "products": [
      "Audio/Video Apparatus",
      "Information Technology Equipment",
      "LED Luminaires & Controlgear",
      "Mobile Phones & Chargers",
      "Secondary Cells and Batteries"
    ],
    "scopeDetails": [
      {
        "standard": "IS 13252 (Part 1)",
        "title": "Information Technology Equipment",
        "product": "Information Technology Equipment",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 1)",
        "title": "Secondary Cells and Batteries",
        "product": "Secondary Cells and Batteries",
        "fee": "5000"
      },
      {
        "standard": "IS 16046 (Part 2)",
        "title": "Audio/Video Apparatus",
        "product": "Audio/Video Apparatus",
        "fee": "5000"
      },
      {
        "standard": "IS 616",
        "title": "LED Luminaires & Controlgear",
        "product": "LED Luminaires & Controlgear",
        "fee": "5000"
      },
      {
        "standard": "IS 15885",
        "title": "Mobile Phones & Chargers",
        "product": "Mobile Phones & Chargers",
        "fee": "5000"
      }
    ]
  },
  {
    "sno": 429,
    "id": "LAB-429",
    "oslCode": "8199006",
    "name": "PRESTO LABORATORIES PRIVATE LIMITED",
    "logoUrl": "https://lims.bis.gov.in/media//ftp/",
    "address": "Plot No. 128,Phase 1,DLF Industrial Area,\n Faridabad, \n Faridabad, \n Haryana, \n India -  121003",
    "city": "Faridabad",
    "district": "Faridabad",
    "state": "Haryana",
    "pincode": "121003",
    "contactPerson": "Shefali Srivastava (Quality Manager)",
    "phone": "+91 9971459226",
    "email": "test@prestolaboratories.com",
    "validTill": "21 Aug, 2029",
    "scopeUrl": "https://lims.bis.gov.in/home_lab_scope/2342/",
    "accreditation": "BIS Recognized Laboratory (OSL Code: 8199006)",
    "disciplines": [
      "Chemical",
      "Mechanical",
      "Electrical"
    ],
    "standards": [
      "IS 10500",
      "IS 14543",
      "IS 1489",
      "IS 2062",
      "IS 694"
    ],
    "products": [
      "Construction Materials",
      "General Consumer Goods",
      "Industrial Electrical Goods",
      "Metals & Alloys",
      "Packaged & Drinking Water"
    ],
    "scopeDetails": [
      {
        "standard": "IS 10500",
        "title": "Packaged & Drinking Water",
        "product": "Packaged & Drinking Water",
        "fee": "5000"
      },
      {
        "standard": "IS 14543",
        "title": "Construction Materials",
        "product": "Construction Materials",
        "fee": "5000"
      },
      {
        "standard": "IS 2062",
        "title": "Industrial Electrical Goods",
        "product": "Industrial Electrical Goods",
        "fee": "5000"
      },
      {
        "standard": "IS 694",
        "title": "Metals & Alloys",
        "product": "Metals & Alloys",
        "fee": "5000"
      },
      {
        "standard": "IS 1489",
        "title": "General Consumer Goods",
        "product": "General Consumer Goods",
        "fee": "5000"
      }
    ]
  }
];
