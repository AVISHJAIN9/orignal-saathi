import { ChevronDown, ChevronUp, Code2, Server } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DeveloperCodeBlock } from "@/components/developers/developer-code-block";
import type { ApiEndpoint } from "@/lib/developer-data";

interface DeveloperEndpointCardProps {
  endpoint: ApiEndpoint;
}

// GET reuses --secondary (already a pale blue in this app's palette) rather
// than raw sky, matching how the Jurisdiction page's status badges were
// corrected. POST and the PUT/DELETE catch-all keep raw emerald/amber —
// there's no --success or --warning token in this app to reach for instead,
// the same gap that justifies DocumentStatusBadge's "indexed" state.
const METHOD_STYLES: Record<ApiEndpoint["method"], string> = {
  POST: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  GET: "bg-secondary text-secondary-foreground border-transparent",
  PUT: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  DELETE:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function DeveloperEndpointCard({
  endpoint,
}: DeveloperEndpointCardProps) {
  const { t } = useTranslation("developers");
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      id={endpoint.id}
      className="elevation-1 flex scroll-mt-20 flex-col gap-4 rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-md sm:p-6"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold tracking-wider uppercase ${METHOD_STYLES[endpoint.method]}`}
          >
            {endpoint.method}
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            {endpoint.path}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 self-end text-xs font-medium text-muted-foreground hover:text-foreground sm:self-auto"
        >
          <span>{expanded ? t("collapseSpec") : t("expandSpec")}</span>
          {expanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-foreground">
          {endpoint.title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {endpoint.summary}
        </p>
        <p className="pt-1 text-xs text-muted-foreground/90 italic">
          {endpoint.description}
        </p>
      </div>

      {expanded && (
        <div className="flex flex-col gap-6 pt-2">
          {/* Request headers */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Server className="size-3.5 text-primary" />
              {t("sections.headers")}
            </span>
            <div className="overflow-x-auto rounded-xl border border-border bg-background">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/50 font-mono text-muted-foreground">
                  <tr>
                    <th className="px-3.5 py-2 font-medium">
                      {t("table.header")}
                    </th>
                    <th className="px-3.5 py-2 font-medium">
                      {t("table.exampleValue")}
                    </th>
                    <th className="px-3.5 py-2 font-medium">
                      {t("table.description")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  {endpoint.headers.map((h) => (
                    <tr key={h.key} className="hover:bg-muted/30">
                      <td className="px-3.5 py-2 font-bold text-primary">
                        {h.key}
                      </td>
                      <td className="px-3.5 py-2 text-muted-foreground">
                        {h.value}
                      </td>
                      <td className="px-3.5 py-2 font-sans text-foreground">
                        {h.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Parameters */}
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Code2 className="size-3.5 text-primary" />
                {t("sections.parameters")}
              </span>
              <div className="overflow-x-auto rounded-xl border border-border bg-background">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/50 font-mono text-muted-foreground">
                    <tr>
                      <th className="px-3.5 py-2 font-medium">
                        {t("table.parameter")}
                      </th>
                      <th className="px-3.5 py-2 font-medium">
                        {t("table.type")}
                      </th>
                      <th className="px-3.5 py-2 font-medium">
                        {t("table.required")}
                      </th>
                      <th className="px-3.5 py-2 font-medium">
                        {t("table.description")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {endpoint.parameters.map((p) => (
                      <tr key={p.name} className="hover:bg-muted/30">
                        <td className="px-3.5 py-2 font-mono font-bold text-foreground">
                          {p.name}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-[11px] text-primary">
                          {p.type}
                        </td>
                        <td className="px-3.5 py-2 font-mono">
                          {p.required ? (
                            <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                              {t("sections.required")}
                            </span>
                          ) : (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {t("sections.optional")}
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2 text-muted-foreground">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request/response schemas + code snippets */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              {endpoint.requestBody && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    {t("sections.requestBody")} (
                    {endpoint.requestBody.contentType})
                  </span>
                  <pre className="max-h-48 overflow-x-auto rounded-xl border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground">
                    <code>{endpoint.requestBody.exampleJson}</code>
                  </pre>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">
                    {t("sections.responseBody")} (
                    {endpoint.responseBody.contentType})
                  </span>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    HTTP {endpoint.responseBody.status} OK
                  </span>
                </div>
                <pre className="max-h-56 overflow-x-auto rounded-xl border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground">
                  <code>{endpoint.responseBody.exampleJson}</code>
                </pre>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-foreground">
                {t("sections.implementation")}
              </span>
              <DeveloperCodeBlock snippets={endpoint.codeSnippets} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
