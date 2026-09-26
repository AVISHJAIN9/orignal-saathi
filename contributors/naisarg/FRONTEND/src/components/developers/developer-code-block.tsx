import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DeveloperCodeBlockProps {
  snippets: {
    curl: string;
    javascript: string;
    python: string;
  };
}

type LangTab = "curl" | "javascript" | "python";

const LANGS: { value: LangTab; label: string }[] = [
  { value: "curl", label: "cURL" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
];

export function DeveloperCodeBlock({ snippets }: DeveloperCodeBlockProps) {
  const { t } = useTranslation("developers");
  const [activeTab, setActiveTab] = useState<LangTab>("curl");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-muted/40">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as LangTab)}
        className="gap-0"
      >
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-2 py-1.5">
          <TabsList className="bg-transparent p-0">
            {LANGS.map((lang) => (
              <TabsTrigger
                key={lang.value}
                value={lang.value}
                className="font-mono text-xs"
              >
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">
                  {t("copied")}
                </span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>{t("copy")}</span>
              </>
            )}
          </button>
        </div>

        {LANGS.map((lang) => (
          <TabsContent key={lang.value} value={lang.value} className="m-0">
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed whitespace-pre text-foreground">
              <code>{snippets[lang.value]}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
