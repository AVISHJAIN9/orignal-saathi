import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SEED_DOCUMENTS } from "@/lib/mock-documents";

export interface VaultDocItem {
  id: string;
  name: string;
  standardNumber?: string;
  category: string;
  lastUpdated: string;
  status: string;
}

interface VaultDocumentPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (doc: VaultDocItem) => void;
}

export function VaultDocumentPicker({
  open,
  onOpenChange,
  onSelect,
}: VaultDocumentPickerProps) {
  const { t } = useTranslation(["corrections", "admin", "standards"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Derive available vault documents
  const vaultItems: VaultDocItem[] = SEED_DOCUMENTS.map((doc) => ({
    id: doc.id,
    name:
      doc.kind === "seed"
        ? `${doc.standardNumber} — ${t(`standards:list.${doc.key}`, { defaultValue: doc.standardNumber })}`
        : doc.fileName,
    standardNumber: doc.kind === "seed" ? doc.standardNumber : undefined,
    category:
      doc.kind === "seed"
        ? t(`admin:topics.${doc.categoryKey}`, { defaultValue: doc.categoryKey })
        : "Uploaded Report",
    lastUpdated: doc.lastUpdated,
    status: doc.status,
  }));

  // Also include custom verified test reports commonly in Vault
  const additionalVaultDocs: VaultDocItem[] = [
    {
      id: "vault-nabl-14543-v2",
      name: "NABL_Full_Test_Report_IS14543_Calibrated_2026.pdf",
      standardNumber: "IS 14543",
      category: "Laboratory Test Reports",
      lastUpdated: "2026-09-12",
      status: "indexed",
    },
    {
      id: "vault-form-v-signed",
      name: "Form_V_Quality_Undertaking_Signed_DSC.pdf",
      standardNumber: "Scheme-I",
      category: "Legal & Undertakings",
      lastUpdated: "2026-09-11",
      status: "indexed",
    },
    {
      id: "vault-plant-blueprint",
      name: "Factory_Manesar_Approved_Layout_QAP_2026.pdf",
      standardNumber: "IS 14543",
      category: "Factory Documentation",
      lastUpdated: "2026-09-10",
      status: "indexed",
    },
  ];

  const allVaultDocs = [...additionalVaultDocs, ...vaultItems];

  const filteredDocs = allVaultDocs.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.standardNumber && doc.standardNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDoc = allVaultDocs.find((d) => d.id === selectedId);

  const handleConfirm = () => {
    if (selectedDoc) {
      onSelect(selectedDoc);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {t("corrections:vault.dialogTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("corrections:vault.dialogDescription")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="shrink-0 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("corrections:vault.search")}
              className="pl-9 h-10 text-sm rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0 pr-2">
          <div className="flex flex-col gap-2 py-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                      : "border-border bg-card/60 hover:bg-muted/60 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {doc.standardNumber && (
                          <Badge variant="outline" className="text-2xs px-2 py-0 h-5 font-mono">
                            {doc.standardNumber}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{doc.category}</span>
                        <span className="text-2xs text-muted-foreground/80">• {doc.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="shrink-0 ml-3 text-primary">
                      <CheckCircle2 className="size-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {t("corrections:vault.empty")}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 pt-4 border-t border-border flex flex-row items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            {t("corrections:vault.cancel")}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!selectedId}
            onClick={handleConfirm}
            className="rounded-xl text-xs gap-2 font-semibold"
          >
            <CheckCircle2 className="size-3.5" />
            {t("corrections:vault.select")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
