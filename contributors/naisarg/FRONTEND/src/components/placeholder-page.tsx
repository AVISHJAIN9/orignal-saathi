import { useTranslation } from "react-i18next";

interface PlaceholderPageProps {
  title: string;
  allowed: boolean;
}

/** Simple stand-in for a not-yet-built role-gated page — proves the nav/role concept without real functionality. */
export function PlaceholderPage({ title, allowed }: PlaceholderPageProps) {
  const { t } = useTranslation("chat");

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
      <p className="text-muted-foreground">
        {allowed ? t("placeholder.comingSoon") : t("placeholder.roleRequired")}
      </p>
    </div>
  );
}
