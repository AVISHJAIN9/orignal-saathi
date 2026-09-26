import {
  AlertCircle,
  Building2,
  Check,
  LucideIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@/lib/router-compat";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, consumePendingAuthRedirect } from "@/lib/auth";
import { useRole, type Role } from "@/lib/role";
import { cn } from "@/lib/utils";

// The login form only ever collects email + password (no separate "name"
// field — see AuthForm below), but AuthUser/AccountMenu need a display
// name for the avatar initials and pill. Derived the same way most demo
// auth flows do: the email's local-part, split on the usual separators and
// title-cased, e.g. "priya.sharma@example.com" -> "Priya Sharma".
function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const name = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return name || "Account";
}

const ACCOUNT_TYPES: Role[] = ["public", "industry", "admin"];
const ROLE_ICONS: Record<Role, LucideIcon> = {
  public: User,
  industry: Building2,
  admin: ShieldCheck,
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(
  email: string,
  password: string,
  t: (key: string) => string,
): string | null {
  if (email.trim() === "") return t("errors.emailRequired");
  if (!EMAIL_PATTERN.test(email.trim())) return t("errors.emailInvalid");
  if (password === "") return t("errors.passwordRequired");
  if (password.length < 6) return t("errors.passwordTooShort");
  return null;
}

interface AuthFormProps {
  idPrefix: string;
  accountType: Role;
  onAccountTypeChange: (role: Role) => void;
  /** Resolves to an error message to show in the form, or null once the
   * sign-in has succeeded (the dialog then closes itself). */
  onValidSubmit: (input: { email: string }) => Promise<string | null>;
  submitLabel: string;
}

function AuthForm({
  idPrefix,
  accountType,
  onAccountTypeChange,
  onValidSubmit,
  submitLabel,
}: AuthFormProps) {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const validationError = validate(email, password, t);
    setError(validationError);
    if (validationError) return;
    setIsSubmitting(true);
    const failure = await onValidSubmit({ email });
    setIsSubmitting(false);
    // Same alert as the validation errors above; the dialog stays open.
    if (failure) setError(failure);
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
      className="flex w-full min-w-0 flex-col gap-5 pt-5"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          role="alert"
          className="flex items-start gap-2 rounded-2xl border border-amber-300/50 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          <Label
            htmlFor={`${idPrefix}-email`}
            className="font-mono text-2xs tracking-[0.16em] text-[var(--plate-muted)] uppercase"
          >
            {t("emailLabel")}
          </Label>
          <Input
            id={`${idPrefix}-email`}
            type="text"
            autoComplete="off"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="h-12 rounded-xl border-border/50 bg-card/70 shadow-sm backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-200 placeholder:text-[var(--plate-muted)]/65 focus-visible:border-primary/50 focus-visible:bg-card/70 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <Label
            htmlFor={`${idPrefix}-password`}
            className="font-mono text-2xs tracking-[0.16em] text-[var(--plate-muted)] uppercase"
          >
            {t("passwordLabel")}
          </Label>
          <PasswordInput
            id={`${idPrefix}-password`}
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="h-12 rounded-xl border-border/50 bg-card/70 shadow-sm backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-200 placeholder:text-[var(--plate-muted)]/65 focus-visible:border-primary/50 focus-visible:bg-card/70 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="font-mono text-2xs tracking-[0.16em] text-[var(--plate-muted)] uppercase">
          {t("accountTypeLabel")}
        </Label>
        <div
          role="group"
          aria-label={t("accountTypeLabel")}
          className="grid w-full min-w-0 grid-cols-3 gap-2.5"
        >
          {ACCOUNT_TYPES.map((type) => {
            const Icon = ROLE_ICONS[type];
            const selected = accountType === type;
            return (
              <motion.button
                key={type}
                type="button"
                onClick={() => onAccountTypeChange(type)}
                aria-pressed={selected}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex min-h-[82px] min-w-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-2 py-3 text-center text-sm font-medium transition-colors duration-200",
                  selected
                    ? "border-primary/80 bg-primary text-primary-foreground shadow-sm"
                    : "border-border/50 bg-card/70 text-[var(--plate-muted)] shadow-sm hover:bg-card/70 hover:text-[var(--plate-ink)]",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId={`${idPrefix}-role-glow`}
                    className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"
                  />
                )}
                <Icon className="relative size-4" aria-hidden />
                <span className="relative">{t(`accountType.${type}`)}</span>
                {selected && (
                  <Check
                    className="absolute right-2 top-2 size-3.5 opacity-75"
                    aria-hidden
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting || undefined}
        className="mt-1 h-12 rounded-xl border border-border/50 bg-primary font-mono text-xs font-semibold tracking-[0.16em] uppercase shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      >
        {submitLabel}
      </Button>
    </form>
  );
}

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { setRole } = useRole();
  const { login } = useAuth();
  const [accountType, setAccountType] = useState<Role>("industry");

  async function handleValidSubmit({
    email,
  }: {
    email: string;
  }): Promise<string | null> {
    try {
      await login({ name: displayNameFromEmail(email), email });
    } catch {
      // Stay open and say so: carrying on would leave the visitor thinking
      // they're signed in, or drop them on a page that needs a session
      // they don't have. The role is only applied once sign-in succeeds.
      return t("genericError");
    }
    setRole(accountType);
    onOpenChange(false);

    const pendingTarget = consumePendingAuthRedirect();
    if (pendingTarget) {
      navigate(pendingTarget);
    } else {
      navigate("/chat");
    }
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar flex max-h-[92vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-y-auto rounded-[2rem] border border-border/50 bg-[var(--plate-ground)]/75 p-0 text-[var(--plate-ink)] shadow-sm backdrop-blur-2xl sm:!max-w-2xl">
        <div className="relative overflow-hidden px-6 pb-7 pt-7 sm:px-9 sm:pb-9 sm:pt-9">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#c7d8e4]/55 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-36 -left-28 size-80 rounded-full bg-[#d8c7b1]/40 blur-3xl"
          />

          <DialogHeader className="relative z-10 gap-4 text-left">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -8, scale: 0.86, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                  className="relative flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-primary text-xl font-semibold text-primary-foreground shadow-[inset_1px_1px_0_rgba(255,255,255,0.55),0_12px_24px_rgba(0,0,0,0.1)]"
                >
                  <span className="absolute left-2 top-1.5 h-3 w-5 rotate-[-22deg] rounded-full bg-card/70 blur-sm" />
                  <span className="relative">S</span>
                </motion.div>
                <div>
                  <p className="font-mono text-2xs font-semibold tracking-[0.22em] text-[var(--plate-accent-deep)] uppercase">
                    Secure access
                  </p>
                  <p className="mt-1 font-mono text-2xs tracking-[0.16em] text-[var(--plate-muted)] uppercase">
                    BIS navigator
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card/70 px-3 py-1.5 font-mono text-2xs tracking-[0.14em] text-[var(--plate-muted)] uppercase sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                SIH 2026
              </div>
            </div>
            <div>
              <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--plate-muted)] sm:text-base">
                {t("description")}
              </DialogDescription>
            </div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
            className="relative z-10 mt-7 w-full min-w-0 rounded-[1.5rem] border border-border/50 bg-card/70 p-2 shadow-sm backdrop-blur-xl"
          >
            <Tabs defaultValue="login" className="flex w-full min-w-0 flex-col">
              <TabsList className="grid h-12 w-full min-w-0 grid-cols-2 rounded-xl border border-border/50 bg-card/70 p-1">
                <TabsTrigger
                  value="login"
                  className="relative rounded-lg font-mono text-xs tracking-[0.12em] text-[var(--plate-muted)] uppercase transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                >
                  {t("tabs.login")}
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="relative rounded-lg font-mono text-xs tracking-[0.12em] text-[var(--plate-muted)] uppercase transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                >
                  {t("tabs.signup")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="w-full min-w-0 px-1 pb-1">
                <AuthForm
                  idPrefix="login"
                  accountType={accountType}
                  onAccountTypeChange={setAccountType}
                  onValidSubmit={handleValidSubmit}
                  submitLabel={t("loginSubmit")}
                />
              </TabsContent>
              <TabsContent value="signup" className="w-full min-w-0 px-1 pb-1">
                <AuthForm
                  idPrefix="signup"
                  accountType={accountType}
                  onAccountTypeChange={setAccountType}
                  onValidSubmit={handleValidSubmit}
                  submitLabel={t("signupSubmit")}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          <div className="relative z-10 mt-5 flex items-center justify-center gap-2 font-mono text-2xs tracking-[0.14em] text-[var(--plate-muted)]/80 uppercase">
            <ShieldCheck
              className="size-3.5 text-[var(--plate-accent-deep)]"
              aria-hidden
            />
            <span>Answers backed by verified standards</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
