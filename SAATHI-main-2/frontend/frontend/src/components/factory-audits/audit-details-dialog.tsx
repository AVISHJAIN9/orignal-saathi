import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  FileText,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  AlertCircle,
  FileEdit,
  History,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/lib/router-compat";
import {
  factoryAuditsApi,
  type FactoryAudit,
} from "@/lib/factory-audits-api";
import { AuditStatusBadge } from "./audit-status-badge";
import { RescheduleRequestDialog } from "./reschedule-request-dialog";

interface AuditDetailsDialogProps {
  audit: FactoryAudit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuditUpdated: () => void;
}

export function AuditDetailsDialog({
  audit,
  open,
  onOpenChange,
  onAuditUpdated,
}: AuditDetailsDialogProps) {
  const { t } = useTranslation(["audits"]);
  const [activeTab, setActiveTab] = useState("checklist");
  const [notes, setNotes] = useState(audit?.applicantNotes || "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

  if (!audit) return null;

  const handleToggleItem = async (itemId: string, currentReady: boolean) => {
    await factoryAuditsApi.togglePreparationItem(audit.id, itemId, !currentReady);
    onAuditUpdated();
  };

  const handleConfirmAttendance = async () => {
    await factoryAuditsApi.confirmAttendance(audit.id, "Rahul Sharma (Managing Director)");
    onAuditUpdated();
  };

  const handleSaveNotes = async () => {
    await factoryAuditsApi.updateInternalNotes(audit.id, notes);
    setNotesSaved(true);
    onAuditUpdated();
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const totalItems = audit.preparationItems.length;
  const readyItems = audit.preparationItems.filter((i) => i.isReady).length;
  const progressPercent = totalItems > 0 ? Math.round((readyItems / totalItems) * 100) : 100;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 md:p-7">
          <DialogHeader className="gap-2 pb-3 border-b border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AuditStatusBadge status={audit.status} />
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  {audit.auditNumber}
                </span>
              </div>
            </div>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1 break-words">
              {audit.productName} ({audit.modelNumber})
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-0.5">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <CalendarIcon className="size-4 text-primary shrink-0" />
                <span>
                  {new Date(audit.scheduledDate).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5 shrink-0" />
                <span>{audit.scheduledTime} ({audit.estimatedDurationHours} hrs)</span>
              </div>
            </div>
          </DialogHeader>

          {/* Responsive Tab navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="w-full overflow-x-auto pb-1 -mx-1 px-1 custom-scrollbar">
              <TabsList className="inline-flex min-w-full md:grid md:grid-cols-5 bg-muted/60 p-1 text-xs gap-1">
                <TabsTrigger
                  value="checklist"
                  className="text-xs font-semibold py-1.5 px-3 whitespace-nowrap shrink-0"
                >
                  Checklist ({readyItems}/{totalItems})
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="text-xs font-semibold py-1.5 px-3 whitespace-nowrap shrink-0"
                >
                  Details & Team
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="text-xs font-semibold py-1.5 px-3 whitespace-nowrap shrink-0"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="instructions"
                  className="text-xs font-semibold py-1.5 px-3 whitespace-nowrap shrink-0"
                >
                  Instructions
                </TabsTrigger>
                <TabsTrigger
                  value="actions"
                  className="text-xs font-semibold py-1.5 px-3 whitespace-nowrap shrink-0"
                >
                  Coordination
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: Preparation Checklist */}
            <TabsContent value="checklist" className="flex flex-col gap-4 py-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Preparation Readiness: {progressPercent}%
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("audits:dialog.checklistDesc")}
                  </p>
                </div>
                <div className="w-full sm:w-36 bg-muted rounded-full h-2.5 overflow-hidden shrink-0">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {audit.preparationItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item.id, item.isReady)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      item.isReady
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border/70 bg-card hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      checked={item.isReady}
                      onCheckedChange={() => handleToggleItem(item.id, item.isReady)}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-foreground break-words">
                          {item.title}
                        </span>
                        <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 break-words">
                        {item.description}
                      </p>
                      {item.notes && (
                        <span className="text-2xs text-amber-600 dark:text-amber-400 font-medium block mt-1 break-words">
                          Note: {item.notes}
                        </span>
                      )}
                      {item.linkedDocumentName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-2xs text-primary font-medium break-all">
                          <FileText className="size-3 shrink-0" />
                          <span className="break-all">{item.linkedDocumentName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 2: Details & Team */}
            <TabsContent value="info" className="flex flex-col gap-4 py-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground font-semibold block mb-1">Standard</span>
                  <span className="font-bold text-foreground text-sm block break-words">{audit.standardNumber}</span>
                  <span className="text-muted-foreground break-words">{audit.standardTitle}</span>
                </div>
                <div className="p-3 rounded-xl border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground font-semibold block mb-1">Application / License</span>
                  <span className="font-bold text-foreground text-sm block break-words">{audit.applicationId}</span>
                  <span className="text-muted-foreground break-words">{audit.certificateNumber}</span>
                </div>
              </div>

              {/* Plant Venue */}
              <div className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-3">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-foreground block mb-0.5">
                    {t("audits:dialog.plantAddress")}
                  </span>
                  <span className="text-muted-foreground break-words">
                    {audit.plantAddress}, {audit.plantCity}, {audit.plantState} - {audit.plantPincode}
                  </span>
                </div>
              </div>

              {/* Lead Officer & Team */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-card">
                <h5 className="font-bold text-foreground text-sm mb-2 flex items-center gap-1.5">
                  <User className="size-4 text-blue-600 shrink-0" />
                  <span className="break-words">Lead Inspecting Officer: {audit.leadOfficer.name}</span>
                </h5>
                <p className="text-muted-foreground mb-2 break-words">
                  {audit.leadOfficer.designation} · {audit.leadOfficer.branchOffice}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground font-mono break-all">
                  <span>Email: {audit.leadOfficer.email}</span>
                  <span>Tel: {audit.leadOfficer.phone}</span>
                  <span>ID: {audit.leadOfficer.officialId}</span>
                </div>
              </div>

              {/* Scope Summary */}
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20">
                <h5 className="font-semibold text-foreground mb-1">{t("audits:dialog.scopeTitle")}</h5>
                <p className="text-muted-foreground leading-relaxed break-words">{audit.scopeSummary}</p>
              </div>
            </TabsContent>

            {/* TAB 3: Required Documents */}
            <TabsContent value="documents" className="flex flex-col gap-3 py-3">
              <p className="text-xs text-muted-foreground">{t("audits:dialog.documentsDesc")}</p>
              <div className="flex flex-col gap-2">
                {audit.requiredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-border/70 bg-card text-xs"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <FileText className="size-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground block break-words">{doc.title}</span>
                        <span className="text-2xs text-muted-foreground block break-all">{doc.vaultDocumentName || doc.category}</span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-2xs font-bold px-2 py-0.5 rounded-full shrink-0 w-fit ${
                        doc.status === "AVAILABLE"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link to="/document-corrections">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold w-full sm:w-auto">
                    <FileEdit className="size-3.5" />
                    <span>Manage in Document Corrections</span>
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* TAB 4: Instructions */}
            <TabsContent value="instructions" className="flex flex-col gap-3 py-3">
              <div className="flex flex-col gap-2.5">
                {audit.officialInstructions.map((inst, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
                  >
                    <span className="size-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-2xs mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-foreground leading-relaxed break-words">{inst}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 5: Actions & Notes */}
            <TabsContent value="actions" className="flex flex-col gap-4 py-3">
              {/* Primary Actions Row */}
              <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                {audit.status !== "CONFIRMED" ? (
                  <Button
                    onClick={handleConfirmAttendance}
                    size="sm"
                    className="gap-1.5 font-semibold w-full sm:w-auto"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>{t("audits:card.confirmAttendance")}</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span className="break-words">
                      {t("audits:card.attendanceConfirmed")} (by {audit.attendanceConfirmedBy || "Applicant"})
                    </span>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRescheduleDialogOpen(true)}
                  className="gap-1.5 text-xs font-semibold w-full sm:w-auto"
                >
                  <Clock className="size-3.5" />
                  <span>{t("audits:card.requestReschedule")}</span>
                </Button>
              </div>

              {/* Internal Notes */}
              <div className="flex flex-col gap-2">
                <h5 className="text-xs font-bold text-foreground">
                  {t("audits:dialog.internalNotes")}
                </h5>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("audits:dialog.notesPlaceholder")}
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotes}
                  className="w-full sm:w-fit text-xs font-semibold"
                >
                  {notesSaved ? "Saved" : t("audits:dialog.saveNotes")}
                </Button>
              </div>

              {/* Cross Links to S6, S20, C3 */}
              <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-2">
                <Link to="/officer-visits">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
                    <span>Officer Visits</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
                <Link to="/calendar">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
                    <span>View in Calendar</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
                <Link to="/conformity">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
                    <span>Compliance Gaps</span>
                    <ExternalLink className="size-3" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-border/60">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Child reschedule request dialog */}
      <RescheduleRequestDialog
        audit={audit}
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
        onRescheduleSubmitted={() => {
          onAuditUpdated();
        }}
      />
    </>
  );
}
