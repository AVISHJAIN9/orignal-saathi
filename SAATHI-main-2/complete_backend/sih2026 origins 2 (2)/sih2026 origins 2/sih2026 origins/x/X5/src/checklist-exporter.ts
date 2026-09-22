import { ComplianceChecklistInstance } from './checklist.types';

export class ChecklistExporter {
  public exportToMarkdown(checklist: ComplianceChecklistInstance): string {
    let md = `# BIS Compliance Action Plan & Audit Checklist\n`;
    md += `**Standard:** ${checklist.standardNumber} — ${checklist.productName}\n`;
    md += `**Certification Scheme:** ${checklist.schemeType}\n`;
    md += `**Enterprise Scale:** ${checklist.enterpriseScale} (${checklist.feeStructure.concessionDescription})\n`;
    md += `**Mandatory QCO:** ${checklist.isMandatoryQCO ? 'YES (Mandatory ISI Mark)' : 'NO'}\n`;
    md += `**Audit Progress:** ${checklist.completedItemsCount}/${checklist.totalItemsCount} items (${checklist.progressPercentage}%)\n\n`;

    md += `## 1. Statutory Fee Structure & MSME Concessions\n`;
    md += `| Fee Component | Standard Rate | Payable (After Concession) |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| Application Fee | ₹1,000 | ₹${checklist.feeStructure.applicationFeeInr.toLocaleString('en-IN')} |\n`;
    md += `| Annual License Fee | ₹1,000 | ₹${checklist.feeStructure.annualLicenseFeeInr.toLocaleString('en-IN')} |\n`;
    md += `| Minimum Marking Fee | Variable | ₹${checklist.feeStructure.minimumMarkingFeeInr.toLocaleString('en-IN')} |\n`;
    md += `| **Total Initial Estimated Cost** | | **₹${checklist.feeStructure.totalEstimatedInitialCostInr.toLocaleString('en-IN')}** |\n\n`;

    md += `## 2. Documentation Prerequisites\n`;
    for (const doc of checklist.documentationRequirements) {
      const status = doc.completed ? '[x]' : '[ ]';
      md += `- ${status} **[${doc.id}] ${doc.title}**: ${doc.description}\n`;
    }
    md += `\n`;

    md += `## 3. Mandatory Testing Parameters\n`;
    for (const tst of checklist.testingParameters) {
      const status = tst.verifiedInHouse ? '[x]' : '[ ]';
      md += `- ${status} **[${tst.id}] ${tst.parameterName}** (${tst.clauseReference}): Limit \`${tst.acceptableLimit}\` | Method: ${tst.testMethodStandard}\n`;
    }
    md += `\n`;

    md += `## 4. Factory & Lab Equipment Requirements\n`;
    for (const fac of checklist.factoryRequirements) {
      const status = fac.installed ? '[x]' : '[ ]';
      md += `- ${status} **[${fac.id}] ${fac.category}**: ${fac.requirement} (${fac.clauseReference})\n`;
    }
    md += `\n`;

    md += `## 5. Licensing Roadmap\n`;
    for (const step of checklist.licensingSteps) {
      const status = step.isCompleted ? '[x]' : '[ ]';
      md += `${step.stepNumber}. ${status} **${step.title}** (~${step.estimatedDays} days)\n`;
    }

    return md;
  }

  public exportToJson(checklist: ComplianceChecklistInstance): string {
    return JSON.stringify(checklist, null, 2);
  }

  /**
   * Generates a printable, styled HTML document ready for PDF conversion
   */
  public exportToPrintableHtml(checklist: ComplianceChecklistInstance): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>BIS Compliance Plan - ${checklist.standardNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; }
    h1 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    .badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f8fafc; }
    .progress-bar { background: #e2e8f0; border-radius: 8px; height: 16px; width: 100%; overflow: hidden; margin: 12px 0; }
    .progress-fill { background: #10b981; height: 100%; width: ${checklist.progressPercentage}%; }
  </style>
</head>
<body>
  <h1>BIS Compliance Action Plan & Audit Checklist</h1>
  <p><strong>Standard:</strong> ${checklist.standardNumber} — ${checklist.productName} <span class="badge">${checklist.enterpriseScale}</span></p>
  <div class="progress-bar"><div class="progress-fill"></div></div>
  <p>Progress: ${checklist.completedItemsCount} of ${checklist.totalItemsCount} items (${checklist.progressPercentage}%)</p>
  <h3>Statutory Fee Summary</h3>
  <table>
    <tr><th>Component</th><th>Amount (INR)</th></tr>
    <tr><td>Application Fee</td><td>₹${checklist.feeStructure.applicationFeeInr.toLocaleString('en-IN')}</td></tr>
    <tr><td>Annual License Fee</td><td>₹${checklist.feeStructure.annualLicenseFeeInr.toLocaleString('en-IN')}</td></tr>
    <tr><td>Minimum Marking Fee</td><td>₹${checklist.feeStructure.minimumMarkingFeeInr.toLocaleString('en-IN')}</td></tr>
    <tr><td><strong>Total Initial Cost</strong></td><td><strong>₹${checklist.feeStructure.totalEstimatedInitialCostInr.toLocaleString('en-IN')}</strong></td></tr>
  </table>
</body>
</html>`;
  }
}
