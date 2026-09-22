import {
  Body, Controller, Get, Post, Put, Delete,
  Query, Param, HttpCode, HttpStatus, UseGuards, Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GatewayService } from './gateway.service';

// ── JWT Auth Guard — wires to P1 via AUTH_SERVICE_URL ─────────────────────
// Phase 1.6: Import the real P1 JWT guard from the auth module.
// Until the shared auth-client package is published, we use a lightweight
// pass-through guard that validates the Authorization header via P1's /auth/verify.
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
class P1JwtAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (process.env.SKIP_AUTH === 'true' || process.env.NODE_ENV === 'test') return true;
    const req = ctx.switchToHttp().getRequest();
    const authHeader: string = req.headers['authorization'] ?? '';
    if (!authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Missing Bearer token');
    const token = authHeader.slice(7);
    const authUrl = process.env.AUTH_SERVICE_URL ?? 'http://localhost:8001';
    try {
      const { data } = await axios.post(`${authUrl}/auth/verify`, { token }, { timeout: 3000 });
      req.user = data.user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH GATEWAY (P1 proxy — public endpoints, no guard)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Authentication (P1 Auth Service Proxy)')
@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user — returns JWT via P1 Auth' })
  async login(@Body() body: Record<string, unknown>) { return this.gw.authLogin(body); }

  @Post('anonymous')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue anonymous guest JWT via P1 Auth' })
  async anonymous() { return this.gw.authAnonymous(); }

  @Get('me')
  @ApiOperation({ summary: 'Fetch currently authenticated profile via P1 Auth' })
  async me(@Headers('authorization') authHeader?: string) { return this.gw.authMe(authHeader); }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user via P1 Auth' })
  async register(@Body() body: Record<string, unknown>) { return this.gw.authRegister(body); }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token via P1 Auth' })
  async refresh(@Body() body: { refreshToken: string }) { return this.gw.authRefreshToken(body.refreshToken); }
}

// ─────────────────────────────────────────────────────────────────────────────
// C-SERIES — Compliance Intelligence (C1–C46)
// Phase 1.6: JWT guard applied to all mutating/sensitive endpoints
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Compliance (C-Series)')
@ApiBearerAuth()
@Controller('compliance')
@UseGuards(P1JwtAuthGuard)
export class ComplianceGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Get('status')
  @ApiOperation({ summary: 'C-series module status (unauthenticated health check)' })
  status() { return this.gw.getComplianceStatus(); }

  @Post('c1/qco-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C1 — QCO Applicability Engine' })
  c1(@Body() b: { product?: string; hsnCode?: string }) { return this.gw.c1CheckQco(b.product ?? '', b.hsnCode ?? ''); }

  @Post('c2/standard-diff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C2 — Standard Revision Diff' })
  c2(@Body() b: { standardNumber?: string }) { return this.gw.c2CompareStandards(b.standardNumber ?? ''); }

  @Post('c3/gap-analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C3 — Compliance Gap Analyzer' })
  c3(@Body() b: { currentTesting?: string; standardNumber?: string }) { return this.gw.c3AnalyzeGaps(b.currentTesting ?? '', b.standardNumber ?? ''); }

  @Get('c4/readiness-score')
  @ApiOperation({ summary: 'C4 — Application Readiness Score' })
  c4(@Query('applicationId') applicationId: string) { return this.gw.c4ReadinessScore(applicationId ?? ''); }

  @Post('c5/select-scheme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C5 — Intelligent Scheme Selector' })
  c5(@Body() b: { product?: string; hsn?: string }) { return this.gw.c5SelectScheme(b.product ?? '', b.hsn ?? ''); }

  @Post('c6/resolve-chain')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C6 — Product→Standard→Scheme→Test→Lab Chain' })
  c6(@Body() b: { product?: string; hsn?: string }) { return this.gw.c6ResolveChain(b.product ?? '', b.hsn ?? ''); }

  @Post('c7/match-lab')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C7 — Intelligent Laboratory Matcher' })
  c7(@Body() b: { product?: string; testType?: string; state?: string }) { return this.gw.c7MatchLab(b.product ?? '', b.testType ?? '', b.state ?? ''); }

  @Get('c8/regulatory-alerts')
  @ApiOperation({ summary: 'C8 — Regulatory Change Alerts' })
  c8(@Query('category') category: string) { return this.gw.c8RegulatoryAlerts(category ?? ''); }

  @Post('c9/test-requirements')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C9 — Test Requirement Generator' })
  c9(@Body() b: { standardNumber?: string }) { return this.gw.c9TestRequirements(b.standardNumber ?? ''); }

  @Get('c10/technical-file')
  @ApiOperation({ summary: 'C10 — Technical File Generator' })
  c10(@Query('applicationId') applicationId: string) { return this.gw.c10TechnicalFile(applicationId ?? ''); }

  @Post('c11/estimate-fees')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C11 — BIS Fee Estimator' })
  c11(@Body() b: { schemeType?: string; productCategory?: string }) { return this.gw.c11EstimateFees(b.schemeType ?? '', b.productCategory ?? ''); }

  @Get('c12/certification-timeline')
  @ApiOperation({ summary: 'C12 — Certification Timeline Simulator' })
  c12(@Query('applicationId') applicationId: string) { return this.gw.c12CertificationTimeline(applicationId ?? ''); }

  @Post('c13/manufacturer-type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C13 — Manufacturer Type Intelligence' })
  c13(@Body() b: Record<string, unknown>) { return this.gw.c13ManufacturerType(b); }

  @Get('c14/renewal-intelligence')
  @ApiOperation({ summary: 'C14 — Renewal Intelligence' })
  c14(@Query('licenseId') licenseId: string) { return this.gw.c14RenewalIntelligence(licenseId ?? ''); }

  @Get('c15/compliance-calendar')
  @ApiOperation({ summary: 'C15 — Compliance Calendar' })
  c15(@Query('applicationId') applicationId: string) { return this.gw.c15ComplianceCalendar(applicationId ?? ''); }

  @Post('c16/evidence-answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C16 — Evidence-Based Answer Builder' })
  c16(@Body() b: { query?: string; standardNumber?: string }) { return this.gw.c16EvidenceAnswer(b.query ?? '', b.standardNumber ?? ''); }

  @Post('c17/safety-guardrail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C17 — Safety Guardrail (Refuse to Guess)' })
  c17(@Body() b: { query?: string }) { return this.gw.c17SafeGuardrail(b.query ?? ''); }

  @Post('c18/escalation-packet')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C18 — Human Escalation Packet' })
  c18(@Body() b: { query?: string; userId?: string }) { return this.gw.c18EscalationPacket(b.query ?? '', b.userId ?? ''); }

  @Get('c19/compliance-passport')
  @ApiOperation({ summary: 'C19 — Compliance Passport' })
  c19(@Query('manufacturerId') manufacturerId: string) { return this.gw.c19CompliancePassport(manufacturerId ?? ''); }

  @Post('c20/impact-simulator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C20 — Regulatory Change Impact Simulator' })
  c20(@Body() b: { changeDescription?: string; affectedProducts?: string[] }) { return this.gw.c20ImpactSimulator(b.changeDescription ?? '', b.affectedProducts ?? []); }

  @Post('c21/classify-product')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C21 — Product Classification Assistant' })
  c21(@Body() b: { description?: string }) { return this.gw.c21ClassifyProduct(b.description ?? ''); }

  @Post('c22/multi-standard-conflict')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C22 — Multi-Standard Conflict Engine' })
  c22(@Body() b: { standards?: string[] }) { return this.gw.c22MultiStandardConflict(b.standards ?? []); }

  @Post('c23/why-not-standard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C23 — Why Not This Standard?' })
  c23(@Body() b: { productDescription?: string; excludedStandard?: string }) { return this.gw.c23WhyNotStandard(b.productDescription ?? '', b.excludedStandard ?? ''); }

  @Post('c24/scope-checker')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C24 — Standard Scope Checker' })
  c24(@Body() b: { standardNumber?: string; productDescription?: string }) { return this.gw.c24ScopeChecker(b.standardNumber ?? '', b.productDescription ?? ''); }

  @Post('c25/clause-extractor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C25 — Clause & Requirement Extractor' })
  c25(@Body() b: { standardNumber?: string; clauseRef?: string }) { return this.gw.c25ClauseExtractor(b.standardNumber ?? '', b.clauseRef ?? ''); }

  @Get('c26/gap-tracker')
  @ApiOperation({ summary: 'C26 — Compliance Gap Tracker' })
  c26(@Query('applicationId') applicationId: string) { return this.gw.c26GapTracker(applicationId ?? ''); }

  @Post('c27/what-if')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C27 — What-If Product Change Sandbox' })
  c27(@Body() b: Record<string, unknown>) { return this.gw.c27WhatIf(b); }

  @Post('c28/knowledge-diff')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C28 — Knowledge Diff Engine' })
  c28(@Body() b: { standardNumber?: string; fromDate?: string; toDate?: string }) { return this.gw.c28KnowledgeDiff(b.standardNumber ?? '', b.fromDate ?? '', b.toDate ?? ''); }

  @Get('c29/circular-tracker')
  @ApiOperation({ summary: 'C29 — BIS Circular & Amendment Tracker' })
  c29(@Query('circularId') circularId: string) { return this.gw.c29CircularTracker(circularId ?? ''); }

  @Post('c30/multi-region')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C30 — Multi-Region Compliance Advisor' })
  c30(@Body() b: { product?: string; regions?: string[] }) { return this.gw.c30MultiRegion(b.product ?? '', b.regions ?? []); }

  @Get('c31/supplier-compliance')
  @ApiOperation({ summary: 'C31 — Supplier Compliance Aggregator' })
  c31(@Query('supplierId') supplierId: string) { return this.gw.c31SupplierCompliance(supplierId ?? ''); }

  @Post('c32/export-compliance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C32 — Export Compliance Advisor' })
  c32(@Body() b: { product?: string; targetMarkets?: string[] }) { return this.gw.c32ExportCompliance(b.product ?? '', b.targetMarkets ?? []); }

  @Get('c33/health-score')
  @ApiOperation({ summary: 'C33 — Compliance Health Score' })
  c33(@Query('manufacturerId') manufacturerId: string) { return this.gw.c33HealthScore(manufacturerId ?? ''); }

  @Post('c34/chat-memory')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C34 — Compliance Chatbot Memory' })
  c34(@Body() b: { sessionId?: string; messages?: any[] }) { return this.gw.c34ChatMemory(b.sessionId ?? '', b.messages ?? []); }

  @Get('c35/evidence-vault')
  @ApiOperation({ summary: 'C35 — Compliance Evidence Vault' })
  c35(@Query('applicationId') applicationId: string) { return this.gw.c35EvidenceVault(applicationId ?? ''); }

  @Get('c36/evidence-freshness')
  @ApiOperation({ summary: 'C36 — Evidence Freshness & Expiry Detection' })
  c36(@Query('standardNumber') standardNumber: string) { return this.gw.c36EvidenceFreshness(standardNumber ?? ''); }

  @Post('c37/trend-analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C37 — Compliance Trend Analytics' })
  c37(@Body() b: { sector?: string; dateRange?: Record<string, string> }) { return this.gw.c37TrendAnalytics(b.sector ?? '', b.dateRange ?? {}); }

  @Post('c38/auto-report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C38 — Automated Compliance Report Generator' })
  c38(@Body() b: { applicationId?: string; reportType?: string }) { return this.gw.c38AutoReport(b.applicationId ?? '', b.reportType ?? 'full'); }

  @Post('c39/notification-orchestrator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C39 — Notification Orchestrator' })
  c39(@Body() b: { userId?: string; eventType?: string }) { return this.gw.c39NotificationOrchestrator(b.userId ?? '', b.eventType ?? ''); }

  @Get('c40/risk-heatmap')
  @ApiOperation({ summary: 'C40 — Compliance Risk Heatmap' })
  c40(@Query('sector') sector: string) { return this.gw.c40RiskHeatmap(sector ?? ''); }

  @Post('c41/precedent-engine')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C41 — Regulatory Precedent Engine' })
  c41(@Body() b: { query?: string }) { return this.gw.c41PrecedentEngine(b.query ?? ''); }

  @Get('c42/product-lifecycle')
  @ApiOperation({ summary: 'C42 — Product Lifecycle Compliance Tracker' })
  c42(@Query('productId') productId: string) { return this.gw.c42ProductLifecycle(productId ?? ''); }

  @Post('c43/batch-monitor')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C43 — Batch Compliance Monitor' })
  c43(@Body() b: { batchIds?: string[] }) { return this.gw.c43BatchMonitor(b.batchIds ?? []); }

  @Post('c44/document-authenticity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C44 — Document Authenticity Verifier' })
  c44(@Body() b: { documentHash?: string }) { return this.gw.c44DocumentAuthenticity(b.documentHash ?? ''); }

  @Post('c45/peer-benchmark')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C45 — Compliance Peer Benchmarker' })
  c45(@Body() b: { manufacturerId?: string; sector?: string }) { return this.gw.c45PeerBenchmark(b.manufacturerId ?? '', b.sector ?? ''); }

  @Post('c46/adaptive-learning')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'C46 — Adaptive Learning Engine' })
  c46(@Body() b: { userId?: string; interactionHistory?: any[] }) { return this.gw.c46AdaptiveLearning(b.userId ?? '', b.interactionHistory ?? []); }
}

// ─────────────────────────────────────────────────────────────────────────────
// S-SERIES — Application Lifecycle (S1–S44)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Lifecycle (S-Series)')
@ApiBearerAuth()
@Controller('lifecycle')
@UseGuards(P1JwtAuthGuard)
export class LifecycleGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Get('status')
  status() { return this.gw.getLifecycleStatus(); }

  @Post('s1/bind-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S1 — ID-Linked BIS Account Binding' })
  s1(@Body() b: { userId?: string; bisAccountId?: string }) { return this.gw.s1AccountBinding(b.userId ?? '', b.bisAccountId ?? ''); }

  @Get('s2/dashboard')
  @ApiOperation({ summary: 'S2 — Personalized Status Dashboard' })
  s2(@Query('userId') userId: string) { return this.gw.s2Dashboard(userId ?? ''); }

  @Post('s3/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'S3 — New Applicant Registration Wizard' })
  s3(@Body() b: Record<string, unknown>) { return this.gw.s3Register(b); }

  @Post('s4/notify-update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S4 — Automated Requirement Update Notification' })
  s4(@Body() b: { applicationId?: string }) { return this.gw.s4NotifyUpdate(b.applicationId ?? ''); }

  @Get('s5/payment-status')
  @ApiOperation({ summary: 'S5 — Payment & Fee Status Tracker' })
  s5(@Query('applicationId') applicationId: string) { return this.gw.s5PaymentStatus(applicationId ?? ''); }

  @Post('s6/schedule-audit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S6 — Government Officer Visit Scheduler' })
  s6(@Body() b: { applicationId?: string; preferredDates?: string[] }) { return this.gw.s6ScheduleAudit(b.applicationId ?? '', b.preferredDates ?? []); }

  @Post('s7/resubmit-document')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S7 — Document Re-submission & Correction Flow' })
  s7(@Body() b: { applicationId?: string; documentType?: string }) { return this.gw.s7ResubmitDocument(b.applicationId ?? '', b.documentType ?? ''); }

  @Post('s8/appeals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S8 — Appeals & Dispute Resolution Flow' })
  s8(@Body() b: { applicationId?: string; reason?: string }) { return this.gw.s8AppealsDispute(b.applicationId ?? '', b.reason ?? ''); }

  @Get('s9/business-accounts')
  @ApiOperation({ summary: 'S9 — Multi-user Business Accounts' })
  s9(@Query('companyId') companyId: string) { return this.gw.s9BusinessAccounts(companyId ?? ''); }

  @Get('s10/verify-certificate')
  @ApiOperation({ summary: 'S10 — Certificate Download & Public Verification' })
  s10(@Query('licenseNumber') licenseNumber: string) { return this.gw.s10VerifyCertificate(licenseNumber ?? ''); }

  @Get('s11/renewal-timeline')
  @ApiOperation({ summary: 'S11 — Renewal Reminders on a Timeline' })
  s11(@Query('licenseId') licenseId: string) { return this.gw.s11RenewalTimeline(licenseId ?? ''); }

  @Post('s12/voice-nav')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S12 — Full Voice Assistant Navigation' })
  s12(@Body() b: { query?: string; lang?: string }) { return this.gw.s12VoiceNav(b.query ?? '', b.lang ?? 'en'); }

  @Post('s13/locale-voice')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S13 — Locale-Aware Multilingual Voice Output' })
  s13(@Body() b: { text?: string; lang?: string }) { return this.gw.s13LocaleVoice(b.text ?? '', b.lang ?? 'hi'); }

  @Post('s14/sms-fallback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S14 — SMS & Offline Fallback Channel' })
  s14(@Body() b: { userId?: string; message?: string }) { return this.gw.s14SMSFallback(b.userId ?? '', b.message ?? ''); }

  @Post('s15/document-checklist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S15 — Registration-Specific Document Checklist' })
  s15(@Body() b: { applicationId?: string; schemeType?: string }) { return this.gw.s15DocumentChecklist(b.applicationId ?? '', b.schemeType ?? ''); }

  @Get('s16/grievance-officer')
  @ApiOperation({ summary: 'S16 — Grievance Officer Contact & Consent Management' })
  s16(@Query('region') region: string) { return this.gw.s16GrievanceOfficer(region ?? ''); }

  @Post('s17/reappeal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S17 — Initial Application Rejection & Reappeal' })
  s17(@Body() b: { applicationId?: string; groundsOfAppeal?: string }) { return this.gw.s17Reappeal(b.applicationId ?? '', b.groundsOfAppeal ?? ''); }

  @Get('s18/lab-sample-tracker')
  @ApiOperation({ summary: 'S18 — Lab & Sample Testing Status Tracker' })
  s18(@Query('sampleId') sampleId: string) { return this.gw.s18LabSampleTracker(sampleId ?? ''); }

  @Post('s19/surveillance-renewal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S19 — Annual Renewal Flow with Surveillance Audit' })
  s19(@Body() b: { licenseId?: string }) { return this.gw.s19SurveillanceRenewal(b.licenseId ?? ''); }

  @Post('s20/calendar-sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S20 — In-App Calendar & Reminder Sync' })
  s20(@Body() b: { userId?: string; events?: any[] }) { return this.gw.s20CalendarSync(b.userId ?? '', b.events ?? []); }

  @Post('s21/factory-audit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S21 — Factory Audit Scheduling & Coordination' })
  s21(@Body() b: { factoryId?: string; auditType?: string }) { return this.gw.s21FactoryAudit(b.factoryId ?? '', b.auditType ?? ''); }

  @Post('s22/non-conformance-alert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S22 — Product Recall & Non-Conformance Alert System' })
  s22(@Body() b: { productId?: string; issueType?: string }) { return this.gw.s22NonConformanceAlert(b.productId ?? '', b.issueType ?? ''); }

  @Get('s23/suspension-remediation')
  @ApiOperation({ summary: 'S23 — License Suspension Notice & Remediation' })
  s23(@Query('licenseId') licenseId: string) { return this.gw.s23SuspensionRemediation(licenseId ?? ''); }

  @Get('s24/gst-invoice')
  @ApiOperation({ summary: 'S24 — Fee Invoice & GST-Compliant Receipt Generator' })
  s24(@Query('applicationId') applicationId: string) { return this.gw.s24GSTInvoice(applicationId ?? ''); }

  @Post('s25/regional-routing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S25 — Regional Office Auto-Routing' })
  s25(@Body() b: { applicationId?: string; state?: string }) { return this.gw.s25RegionalRouting(b.applicationId ?? '', b.state ?? ''); }

  @Get('s26/multi-factory')
  @ApiOperation({ summary: 'S26 — Multi-Factory & Multi-Location License Management' })
  s26(@Query('companyId') companyId: string) { return this.gw.s26MultiFactory(companyId ?? ''); }

  @Get('s27/quality-ops-metrics')
  @ApiOperation({ summary: 'S27 — Live Retrieval Quality Metrics Ops Page' })
  s27() { return this.gw.s27QualityOpsMetrics(); }

  @Post('s28/staff-invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S28 — Staff Role Invitations' })
  s28(@Body() b: { managerId?: string; email?: string; role?: string }) { return this.gw.s28StaffInvite(b.managerId ?? '', b.email ?? '', b.role ?? 'viewer'); }

  @Post('s29/save-draft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S29 — Save & Resume Application Draft' })
  s29(@Body() b: { userId?: string; draftData?: Record<string, unknown> }) { return this.gw.s29SaveDraft(b.userId ?? '', b.draftData ?? {}); }

  @Get('s30/progress-bar')
  @ApiOperation({ summary: 'S30 — Application Progress Bar Calculator' })
  s30(@Query('applicationId') applicationId: string) { return this.gw.s30ProgressBar(applicationId ?? ''); }

  @Post('s31/document-upload')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S31 — Document Upload Service' })
  s31(@Body() b: { applicationId?: string; documentType?: string }) { return this.gw.s31DocumentUpload(b.applicationId ?? '', b.documentType ?? ''); }

  @Post('s32/auto-scan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S32 — Auto-Scan & Auto-Fill from Uploaded Documents (OCR)' })
  s32(@Body() b: { documentTextContent?: string }) { return this.gw.s32AutoScan(b.documentTextContent ?? ''); }

  @Post('s33/duplicate-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S33 — Duplicate Application Detector' })
  s33(@Body() b: Record<string, unknown>) { return this.gw.s33DuplicateCheck(b); }

  @Post('s34/lab-slot-book')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S34 — Lab Slot Booking' })
  s34(@Body() b: { labId?: string; productId?: string; preferredDate?: string }) { return this.gw.s34LabSlotBook(b.labId ?? '', b.productId ?? '', b.preferredDate ?? ''); }

  @Get('s35/emi-options')
  @ApiOperation({ summary: 'S35 — EMI Option Service' })
  s35(@Query('applicationId') applicationId: string) { return this.gw.s35EMIOptions(applicationId ?? ''); }

  @Get('s36/live-audit-checklist')
  @ApiOperation({ summary: 'S36 — Live Audit Checklist' })
  s36(@Query('auditId') auditId: string) { return this.gw.s36LiveAuditChecklist(auditId ?? ''); }

  @Get('s37/dispute-status')
  @ApiOperation({ summary: 'S37 — Dispute Status Tracker' })
  s37(@Query('disputeId') disputeId: string) { return this.gw.s37DisputeStatus(disputeId ?? ''); }

  @Get('s38/application-timeline')
  @ApiOperation({ summary: 'S38 — Application Timeline Visualization' })
  s38(@Query('applicationId') applicationId: string) { return this.gw.s38ApplicationTimeline(applicationId ?? ''); }

  @Post('s39/satisfaction-survey')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S39 — Satisfaction Survey' })
  s39(@Body() b: { userId?: string; context?: string }) { return this.gw.s39SatisfactionSurvey(b.userId ?? '', b.context ?? ''); }

  @Post('s40/sign-language')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S40 — Sign Language Assistant' })
  s40(@Body() b: { videoUrl?: string }) { return this.gw.s40SignLanguage(b.videoUrl ?? ''); }

  @Post('s41/missed-call-callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S41 — Missed Call Callback Registration' })
  s41(@Body() b: { phoneNumber?: string }) { return this.gw.s41MissedCallCallback(b.phoneNumber ?? ''); }

  @Post('s42/web-push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S42 — Web Push Notification' })
  s42(@Body() b: { userId?: string; notification?: Record<string, unknown> }) { return this.gw.s42WebPush(b.userId ?? '', b.notification ?? {}); }

  @Get('s43/digital-signage')
  @ApiOperation({ summary: 'S43 — Digital Signage Feed' })
  s43(@Query('locationId') locationId: string) { return this.gw.s43DigitalSignage(locationId ?? ''); }

  @Get('s44/digital-signage')
  @ApiOperation({ summary: 'S44 — Digital Signage Integration for BIS Regional Offices' })
  s44(@Query('office') office: string) { return this.gw.s44DigitalSignage(office ?? 'WRO_MUMBAI'); }
}

// ─────────────────────────────────────────────────────────────────────────────
// I-SERIES — International Trust (I1–I25)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('International (I-Series)')
@Controller('international')
export class InternationalGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Get('status')
  status() { return this.gw.getInternationalStatus(); }

  @Get('i1/search-directory')
  @ApiOperation({ summary: 'I1 — Public Search Directory' })
  i1(@Query('q') q: string) { return this.gw.i1SearchDirectory(q ?? '', {}); }

  @Get('i2/manufacturer-profile')
  @ApiOperation({ summary: 'I2 — Per-Manufacturer Certification Profile' })
  i2(@Query('manufacturerId') id: string) { return this.gw.i2ManufacturerProfile(id ?? ''); }

  @Get('i3/factory-health')
  @ApiOperation({ summary: 'I3 — Live Factory Certification Health Status' })
  i3(@Query('factoryId') id: string) { return this.gw.i3FactoryHealth(id ?? ''); }

  @Get('i4/accredited-labs')
  @ApiOperation({ summary: 'I4 — Accredited Lab Directory' })
  i4(@Query('state') state: string, @Query('testType') testType: string) { return this.gw.i4AccreditedLabs(state ?? '', testType ?? ''); }

  @Get('i5/doc')
  @ApiOperation({ summary: 'I5 — Declaration of Conformity Generator' })
  i5(@Query('productId') productId: string) { return this.gw.i5DOC(productId ?? ''); }

  @Post('i6/risk-classifier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I6 — Upfront Risk Classifier' })
  i6(@Body() b: { productDescription?: string }) { return this.gw.i6RiskClassifier(b.productDescription ?? ''); }

  @Get('i7/trust-badge')
  @ApiOperation({ summary: 'I7 — Voluntary Trust Badge' })
  i7(@Query('manufacturerId') id: string) { return this.gw.i7TrustBadge(id ?? ''); }

  @Get('i8/cert-qrcode')
  @ApiOperation({ summary: 'I8 — Certificate QR Code' })
  i8(@Query('licenseNumber') licenseNumber: string) { return this.gw.i8CertQRCode(licenseNumber ?? ''); }

  @Get('i9/unit-traceability')
  @ApiOperation({ summary: 'I9 — Unit Traceability' })
  i9(@Query('unitId') unitId: string) { return this.gw.i9UnitTraceability(unitId ?? ''); }

  @Post('i10/genuine-claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I10 — Genuine vs Fake Claim Checker' })
  i10(@Body() b: { productId?: string; claimText?: string }) { return this.gw.i10GenuineClaim(b.productId ?? '', b.claimText ?? ''); }

  @Get('i11/trust-score')
  @ApiOperation({ summary: 'I11 — Consumer Trust Score' })
  i11(@Query('manufacturerId') id: string) { return this.gw.i11TrustScore(id ?? ''); }

  @Get('i12/recall-feed')
  @ApiOperation({ summary: 'I12 — Unified Recall Feed' })
  i12(@Query('category') category: string) { return this.gw.i12RecallFeed(category ?? ''); }

  @Get('i13/recall-lookup')
  @ApiOperation({ summary: 'I13 — Consumer Recall Lookup Tool' })
  i13(@Query('productId') productId: string) { return this.gw.i13RecallLookup(productId ?? ''); }

  @Post('i14/cb-scheme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I14 — CB Scheme Cross-Recognition Checker' })
  i14(@Body() b: { countryCode?: string; standardNumber?: string }) { return this.gw.i14CBScheme(b.countryCode ?? '', b.standardNumber ?? ''); }

  @Post('i15/reduced-documentation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I15 — Reduced Documentation Pathway' })
  i15(@Body() b: { manufacturerId?: string; targetMarket?: string }) { return this.gw.i15ReducedDocumentation(b.manufacturerId ?? '', b.targetMarket ?? ''); }

  @Post('i16/test-standard-mapper')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I16 — Category-Wise Test Standard Mapper' })
  i16(@Body() b: { productCategory?: string; targetMarket?: string }) { return this.gw.i16TestStandardMapper(b.productCategory ?? '', b.targetMarket ?? ''); }

  @Get('i17/qr-embedded')
  @ApiOperation({ summary: 'I17 — QR-Embedded Conformity Mark' })
  i17(@Query('licenseNumber') licenseNumber: string) { return this.gw.i17QREmbedded(licenseNumber ?? ''); }

  @Get('i18/cert-registry')
  @ApiOperation({ summary: 'I18 — Real-Time Central Certificate Registry' })
  i18(@Query('licenseNumber') licenseNumber: string) { return this.gw.i18CertRegistry(licenseNumber ?? ''); }

  @Post('i19/cross-mark-equivalence')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I19 — Cross-Mark Equivalence Checker' })
  i19(@Body() b: { sourceMark?: string; targetMarket?: string }) { return this.gw.i19CrossMarkEquivalence(b.sourceMark ?? '', b.targetMarket ?? ''); }

  @Get('i20/shared-tcf')
  @ApiOperation({ summary: 'I20 — Shared Technical File Reuse Tool' })
  i20(@Query('productFamilyId') id: string) { return this.gw.i20SharedTCF(id ?? ''); }

  @Post('i21/escalation-ladder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'I21 — Formal Escalation Ladder' })
  i21(@Body() b: { issueType?: string; severity?: string }) { return this.gw.i21EscalationLadder(b.issueType ?? '', b.severity ?? 'medium'); }

  @Get('i22/environmental-scorecard')
  @ApiOperation({ summary: 'I22 — Full-Lifecycle Environmental Scorecard' })
  i22(@Query('productId') productId: string) { return this.gw.i22EnvironmentalScorecard(productId ?? ''); }

  @Get('i23/sustainability-badge')
  @ApiOperation({ summary: 'I23 — Third-Party Verified Sustainability Badge' })
  i23(@Query('manufacturerId') id: string) { return this.gw.i23SustainabilityBadge(id ?? ''); }

  @Get('i24/gem-eligibility')
  @ApiOperation({ summary: 'I24 — Government Procurement (GeM) Eligibility Flag' })
  i24(@Query('manufacturerId') id: string) { return this.gw.i24GeMEligibility(id ?? ''); }

  @Get('i25/liability-insurance')
  @ApiOperation({ summary: 'I25 — Liability Insurance Status' })
  i25(@Query('manufacturerId') id: string) { return this.gw.i25LiabilityInsurance(id ?? ''); }
}

// ─────────────────────────────────────────────────────────────────────────────
// X-SERIES — Experience & Analytics (X1–X15)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Experience (X-Series)')
@ApiBearerAuth()
@Controller('experience')
@UseGuards(P1JwtAuthGuard)
export class ExperienceGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Get('status')
  status() { return this.gw.getExperienceStatus(); }

  @Get('x1/dashboard')
  @ApiOperation({ summary: 'X1 — User Dashboard' })
  x1(@Query('userId') userId: string) { return this.gw.x1UserDashboard(userId ?? ''); }

  @Post('x2/feedback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X2 — Compliance Feedback & Groundedness Score' })
  x2(@Body() b: Record<string, any>) { return this.gw.x2ComplianceFeedback(b.sessionId ?? '', b.query ?? '', b.answer ?? '', b); }

  @Put('x3/notification-prefs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X3 — Notification Preferences' })
  x3(@Body() b: { userId?: string; prefs?: Record<string, unknown> }) { return this.gw.x3NotificationPrefs(b.userId ?? '', b.prefs ?? {}); }

  @Put('x4/multilingual-prefs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X4 — Multilingual Preferences' })
  x4(@Body() b: { userId?: string; lang?: string }) { return this.gw.x4MultilingualPrefs(b.userId ?? '', b.lang ?? 'en'); }

  @Get('x5/application-drafts')
  @ApiOperation({ summary: 'X5 — Application Drafts' })
  x5(@Query('userId') userId: string) { return this.gw.x5ApplicationDrafts(userId ?? ''); }

  @Post('x6/export-report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X6 — Export & Reporting' })
  x6(@Body() b: { reportId?: string; format?: string }) { return this.gw.x6ExportReport(b.reportId ?? '', b.format ?? 'pdf'); }

  @Get('x7/team-workspace')
  @ApiOperation({ summary: 'X7 — Team Collaboration Workspace' })
  x7(@Query('teamId') teamId: string) { return this.gw.x7TeamCollab(teamId ?? ''); }

  @Get('x8/document-preview')
  @ApiOperation({ summary: 'X8 — Document Preview & Annotation' })
  x8(@Query('documentId') documentId: string) { return this.gw.x8DocumentPreview(documentId ?? ''); }

  @Get('x9/search-history')
  @ApiOperation({ summary: 'X9 — Search History' })
  x9(@Query('userId') userId: string) { return this.gw.x9SearchHistory(userId ?? ''); }

  @Post('x10/compliance-tagging')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X10 — Compliance Tagging' })
  x10(@Body() b: { documentId?: string; tags?: string[] }) { return this.gw.x10ComplianceTagging(b.documentId ?? '', b.tags ?? []); }

  @Post('x11/analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X11 — Compliance Analytics' })
  x11(@Body() b: { sector?: string; dateRange?: Record<string, string> }) { return this.gw.x11Analytics(b.sector ?? '', b.dateRange ?? {}); }

  @Post('x12/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'X12 — Webhook Dispatch' })
  x12(@Body() b: { event?: string; payload?: Record<string, unknown> }) { return this.gw.x12Webhook(b.event ?? '', b.payload ?? {}); }

  @Get('x13/saved-searches')
  @ApiOperation({ summary: 'X13 — Saved Searches' })
  x13(@Query('userId') userId: string) { return this.gw.x13SavedSearches(userId ?? ''); }

  @Get('x14/bookmarked-standards')
  @ApiOperation({ summary: 'X14 — Bookmarked Standards' })
  x14(@Query('userId') userId: string) { return this.gw.x14BookmarkedStandards(userId ?? ''); }

  @Get('x15/answer-pdf')
  @ApiOperation({ summary: 'X15 — Downloadable PDF Summary of Any Answer' })
  x15(@Query('sessionId') sessionId: string) { return this.gw.x15AnswerPdfSummary(sessionId ?? ''); }
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM GATEWAY (P-Series: P1–P7)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Platform (P-Series)')
@Controller('platform')
export class PlatformGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Get('status')
  @ApiOperation({ summary: 'Platform services module status' })
  status() { return this.gw.getPlatformStatus(); }

  @Post('p5/sandbox/app')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'P5 — Create Developer Sandbox Application' })
  p5CreateApp(@Body() b: { developerName?: string; scopes?: string[]; ownerEmail?: string }) {
    return this.gw.p5CreateSandboxApp(b.developerName, b.scopes, b.ownerEmail);
  }

  @Post('p5/sandbox/simulate-webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'P5 — Simulate Sandbox Webhook Dispatch' })
  p5SimulateWebhook(@Body() b: { webhookUrl: string; eventType?: string; payload?: any }) {
    return this.gw.p5SimulateWebhook(b.webhookUrl, b.eventType, b.payload);
  }

  @Get('p6/dr-status')
  @ApiOperation({ summary: 'P6 — Disaster Recovery Drill Status' })
  p6DrStatus() { return this.gw.p6DrillStatus(); }

  @Post('p6/dr-trigger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'P6 — Trigger Simulated Disaster Recovery Drill' })
  p6TriggerDrill(@Body() b: { targetRegion?: string }) {
    return this.gw.p6TriggerDrill(b.targetRegion);
  }

  @Get('p7/uptime')
  @ApiOperation({ summary: 'P7 — Uptime Status Page for Citizens' })
  p7Uptime() { return this.gw.p7UptimeStatus(); }
}

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNANCE GATEWAY (G-Series: G1–G22)
// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Governance (G-Series)')
@Controller('governance')
export class GovernanceGatewayController {
  constructor(private readonly gw: GatewayService) {}

  @Get('status')
  @ApiOperation({ summary: 'Governance services status' })
  status() { return this.gw.getGovernanceStatus(); }

  // G20 — Single Sign-On for Government Portals (National SSO / MeriPehchaan / Parichay)
  @Post('g20/sso/exchange')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'G20 — Exchange Government Portal SSO Token (MeriPehchaan/Parichay)' })
  g20Exchange(@Body() b: { authCode?: string; ssoToken?: string; portal?: string; officialGovEmail?: string; designation?: string; ministry?: string }) {
    return this.gw.g20ExchangeSsoToken(b);
  }

  @Get('g20/sso/session')
  @ApiOperation({ summary: 'G20 — Validate Government SSO Session' })
  g20Session(@Query('sessionId') sessionId: string) {
    return this.gw.g20ValidateSsoSession(sessionId ?? '');
  }

  // G19 — Biometric Login Option (WebAuthn / FIDO2)
  @Post('g19/biometric/challenge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'G19 — Generate WebAuthn/FIDO2 Biometric Challenge' })
  g19Challenge(@Body() b: { userId: string }) {
    return this.gw.g19GenerateChallenge(b.userId ?? '');
  }

  @Post('g19/biometric/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'G19 — Verify Biometric Assertion Signature' })
  g19Verify(@Body() b: { userId: string; credentialId?: string; challenge: string; authenticatorData?: string; signature?: string }) {
    return this.gw.g19VerifyBiometric(b);
  }

  // G22 — Welcome Tour for First-Time Users
  @Get('g22/welcome-tour')
  @ApiOperation({ summary: 'G22 — Welcome Tour Steps for First-Time Users' })
  g22Tour(@Query() q: Record<string, unknown>) {
    return this.gw.g22WelcomeTour(q);
  }
}
