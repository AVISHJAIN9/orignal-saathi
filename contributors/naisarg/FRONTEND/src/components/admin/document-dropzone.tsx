import { UploadCloud } from "lucide-react";
import {
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const DEFAULT_ACCEPT = ".pdf,.doc,.docx";

interface DocumentDropzoneProps {
  onFilesAdded: (files: FileList) => void;
  /** Accepted file types for the browse picker (default: PDF/DOC/DOCX). */
  accept?: string;
  /** Default true. When false, a multi-file drop hands over only the first
   * file, matching what the single-file picker allows. */
  multiple?: boolean;
  /** Headline and hint; default to the generic "Drag & drop files here…"
   * copy. Surfaces with their own translated copy pass it in; an empty
   * hint hides the hint line. */
  title?: string;
  hint?: string;
  /** "compact" is a single-row target for forms with a small optional
   * attachment; "default" is the full panel. */
  size?: "default" | "compact";
  className?: string;
  /** Extra, non-interactive content under the hint. */
  children?: ReactNode;
}

/** The one drag-and-drop upload target used by every document workflow in
 * the app (click, Enter/Space or drop). UI-only: dropped/selected files are
 * handed to the parent to queue, nothing is actually uploaded. */
export function DocumentDropzone({
  onFilesAdded,
  accept = DEFAULT_ACCEPT,
  multiple = true,
  title,
  hint,
  size = "default",
  className,
  children,
}: DocumentDropzoneProps) {
  const { t } = useTranslation("admin");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const compact = size === "compact";

  function handOver(files: FileList) {
    if (files.length === 0) return;
    if (multiple || files.length === 1) {
      onFilesAdded(files);
      return;
    }
    const first = new DataTransfer();
    first.items.add(files[0]);
    onFilesAdded(first.files);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    handOver(event.dataTransfer.files);
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
        "elevation-lift flex cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/30 outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-[240ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] hover:border-primary/50 hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        compact
          ? "items-center gap-2.5 px-3 py-2.5 text-left"
          : "flex-col items-center gap-1.5 px-6 py-8 text-center",
        className,
        isDragOver && "border-primary bg-primary/5",
      )}
    >
      <UploadCloud
        className={cn(
          "shrink-0 text-muted-foreground",
          compact ? "size-4 text-primary" : "size-6",
        )}
      />
      <div
        className={cn(
          "flex flex-col",
          compact ? "min-w-0" : "items-center gap-1.5",
        )}
      >
        <p
          className={cn(
            "font-medium text-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {title ?? t("documents.dropzone.title")}
        </p>
        {hint !== "" && (
          <p
            className={cn(
              "text-muted-foreground",
              compact ? "text-2xs" : "text-xs",
            )}
          >
            {hint ?? t("documents.dropzone.hint")}
          </p>
        )}
        {children}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handOver(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
