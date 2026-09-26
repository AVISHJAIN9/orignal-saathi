import { UploadCloud } from "lucide-react";
import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx";

interface DocumentDropzoneProps {
  onFilesAdded: (files: FileList) => void;
}

/** D5 — UI-only drag-and-drop upload target; dropped/selected files are handed to the parent to queue, nothing is actually uploaded. */
export function DocumentDropzone({ onFilesAdded }: DocumentDropzoneProps) {
  const { t } = useTranslation("admin");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files.length > 0) onFilesAdded(event.dataTransfer.files);
  }

  function openBrowse() {
    inputRef.current?.click();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBrowse();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openBrowse}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "elevation-lift flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-[240ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] hover:border-primary/50 hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        isDragOver && "border-primary bg-primary/5",
      )}
    >
      <UploadCloud className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{t("documents.dropzone.title")}</p>
      <p className="text-xs text-muted-foreground">{t("documents.dropzone.hint")}</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) onFilesAdded(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
