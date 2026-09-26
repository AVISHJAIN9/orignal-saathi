# C26: Requirement Dependency Graph

- **Priority Tier**: High (A-Tier DAG Architecture Core)
- **Journey Stage**: Compliance Workflow Modeling & Planning
- **Status**: IMPLEMENTED_AND_VERIFIED (Production Tested Real Relational Engine)
- **Summary**: Constructs directed acyclic dependency graphs (DAG) connecting raw materials, sampling plans, in-house testing equipment, test standards, and compliance gates.

---

## 1. Overview & Capabilities
The **Requirement Dependency Graph** transforms static standard text into an interactive, visual directed acyclic graph (DAG). It maps dependencies from raw material qualification through manufacturing processes and mandatory tests to the final compliance gate.

### Node Types
1. **`RAW_MATERIAL`**: Inward constituent controls (Clinker, Gypsum, Polycarbonate, Raw Water).
2. **`PROCESS`**: Manufacturing operations (Grinding, Injection Moulding, Multi-stage RO filtration).
3. **`TEST_METHOD`**: In-house and independent test methods (Blaine Fineness, 28-day Compressive Strength, Glow Wire).
4. **`COMPLIANCE_GATE`**: Statutory licensing grant or endorsement milestones.

---

## 2. API Reference

### Endpoint
`POST /api/v1/compliance/dependency-graph/generate`

### Request Payload
```json
{
  "standard_number": "IS 269:2015"
}
```

### Response Payload
```json
{
  "standard_number": "IS 269:2015",
  "total_nodes": 8,
  "total_edges": 10,
  "nodes": [
    {"id": "node_raw_clinker", "label": "Raw Material: Portland Clinker", "type": "RAW_MATERIAL"},
    {"id": "node_raw_gypsum", "label": "Raw Material: Mineral Gypsum", "type": "RAW_MATERIAL"},
    {"id": "node_grinding", "label": "Ball Mill Grinding & Blending", "type": "PROCESS"},
    {"id": "node_blaine_test", "label": "Blaine Fineness Test (IS 4031-2)", "type": "TEST_METHOD"},
    {"id": "node_soundness_test", "label": "Soundness Test (Le-Chatelier) (IS 4031-3)", "type": "TEST_METHOD"},
    {"id": "node_setting_test", "label": "Vicat Setting Time Test (IS 4031-5)", "type": "TEST_METHOD"},
    {"id": "node_compressive_test", "label": "28-Day Compressive Test (IS 4031-6)", "type": "TEST_METHOD"},
    {"id": "node_isi_mark", "label": "Standard Mark (ISI License Grant)", "type": "COMPLIANCE_GATE"}
  ],
  "edges": [
    {"from": "node_raw_clinker", "to": "node_grinding"},
    {"from": "node_raw_gypsum", "to": "node_grinding"},
    {"from": "node_grinding", "to": "node_blaine_test"},
    {"from": "node_grinding", "to": "node_soundness_test"},
    {"from": "node_grinding", "to": "node_setting_test"},
    {"from": "node_grinding", "to": "node_compressive_test"},
    {"from": "node_blaine_test", "to": "node_isi_mark"},
    {"from": "node_soundness_test", "to": "node_isi_mark"},
    {"from": "node_setting_test", "to": "node_isi_mark"},
    {"from": "node_compressive_test", "to": "node_isi_mark"}
  ],
  "critical_path_bottleneck": "28-Day Compressive Test (IS 4031-6) - 28 calendar day curing period",
  "timestamp": "2026-09-12T15:00:00Z"
}
```

---

## 3. Directory Structure
```
c/C26_requirement_dependency_graph/
├── __init__.py
├── engine.py
└── README.md
```
