with open("app.py", "r") as f:
    code = f.read()

export_code = '''
from fastapi.responses import Response
import io
import csv

@app.post("/audit/export")
def export_audit_csv(req: AuditRequest):
    audit_res = generate_audit_pack(req)
    if audit_res["status"] == "unverified":
        return Response(content="Query unverified or out of scope.", media_type="text/plain")

    pack = audit_res["audit_pack"]
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(["COMPLIANCE AUDIT PACK SUMMARY"])
    writer.writerow(["Evaluated Product / Query", req.text])
    writer.writerow(["Target Standard", pack["governance"]["standard"]])
    writer.writerow(["Statutory QCO Order", pack["governance"]["qco_order"]])
    writer.writerow(["Certification Scheme", pack["governance"]["scheme"]])
    writer.writerow(["Assigned Homologation / Test Lab", pack["testing_and_labs"]["authorized_lab"]])
    writer.writerow(["Filing Portal", pack["governance"]["filing_portal"]])
    writer.writerow(["Readiness Score", pack["gap_and_readiness"]["readiness_score"]])
    writer.writerow(["Readiness Status", pack["gap_and_readiness"]["status"]])
    writer.writerow(["Critical Blocker Flag", pack["gap_and_readiness"]["critical_gap_flag"]])
    writer.writerow([])
    writer.writerow(["IDENTIFIED GAPS & STATUTORY REMEDIATION"])
    writer.writerow(["Item", "Weight Loss", "Critical Blocker", "Action Required"])
    for gap in pack["gap_and_readiness"]["gaps_identified"]:
        writer.writerow([gap["item"], f"-{gap['weight_loss']}%", gap["critical"], gap["action_required"]])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=audit_report_{pack['governance']['standard'].replace(' ', '_')}.csv"}
    )
'''

if "/audit/export" not in code:
    code += export_code
    with open("app.py", "w") as f:
        f.write(code)
    print("Export route successfully attached to app.py.")
else:
    print("Export route already exists in app.py.")
