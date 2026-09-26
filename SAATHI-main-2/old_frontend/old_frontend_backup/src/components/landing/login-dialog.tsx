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
import { consumePendingAuthRedirect, useAuth } from "@/lib/auth";
import { useRole, type Role } from "@/lib/role";
import { cn } from "@/lib/utils";

const ACCOUNT_TYPES: Role[] = ["public", "industry", "admin"];
const ROLE_ICONS: Record<Role, LucideIcon> = {
  public: User,
  industry: Building2,
  admin: ShieldCheck,
};
// Loose enough to reject empty/obviously-malformed input without implying
// this is a real credential check — no password field exists here at all,
// since this is an honestly-labeled mock sign-in, not a fake login (see
// auth.json's `description`).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The app's one mock sign-in surface (opened via LoginGateContext from
 * every "Login"/"Start chatting" entry point). Two independent things
 * happen on submit: `login()` (AuthProvider — real, if mock, identity)
 * and `setRole()` (RoleProvider — the pre-existing persona preview) are
 * both set, but neither provider knows about the other; see
 * auth-provider.tsx's doc comment for why they're kept separate.
 *
 * Deliberately has no password field: this used to validate a fake
 * password (never checked against anything), which read as a real login
 * form despite not being one. Now it only collects a name + identifier —
 * an honest shape for "no real backend verifies this."
 */
export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { login, authError } = useAuth();
  const { setRole } = useRole();
  const [accountType, setAccountType] = useState<Role>("public");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): string | null {
    if (name.trim() === "") return t("errors.nameRequired");
    if (identifier.trim() === "") return t("errors.identifierRequired");
    if (!EMAIL_PATTERN.test(identifier.trim()))
      return t("errors.identifierInvalid");
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validate();
    setValidationError(error);
    if (error) return;

    setIsSubmitting(true);
    try {
      await login({ name: name.trim(), email: identifier.trim() });
      setRole(accountType);
      onOpenChange(false);
      const redirectTo = consumePendingAuthRedirect();
      navigate(redirectTo ?? "/chat");
    } catch {
      // authError from useAuth() already carries the safe generic message
      // — nothing further to do here.
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayedError = validationError ?? authError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar flex max-h-[92vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-y-auto rounded-[2rem] border border-white/75 bg-[var(--plate-ground)]/75 p-0 text-[var(--plate-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_32px_90px_rgba(32,43,51,0.24)] backdrop-blur-2xl sm:!max-w-2xl">
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
                  className="relative flex size-12 items-center justify-center rounded-2xl border border-white/70 bg-primary text-xl font-semibold text-primary-foreground shadow-[inset_1px_1px_0_rgba(255,255,255,0.55),0_12px_24px_rgba(12,50,86,0.2)]"
                >
                  <span className="absolute left-2 top-1.5 h-3 w-5 rotate-[-22deg] rounded-full bg-white/25 blur-sm" />
                  <span className="relative">S</span>
                </motion.div>
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold tracking-[0.22em] text-[var(--plate-accent-deep)] uppercase">
                    Secure access
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] tracking-[0.16em] text-[var(--plate-muted)] uppercase">
                    BIS navigator
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/30 px-3 py-1.5 font-mono text-[0.58rem] tracking-[0.14em] text-[var(--plate-muted)] uppercase sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                Demo environment
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
            className="relative z-10 mt-7 w-full min-w-0 rounded-[1.5rem] border border-white/65 bg-white/25 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_28px_rgba(57,67,73,0.08)] backdrop-blur-xl"
          >
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
              className="flex w-full min-w-0 flex-col gap-5 p-3 pt-5 sm:p-4 sm:pt-5"
            >
              {displayedError && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  role="alert"
                  className="flex items-start gap-2 rounded-2xl border border-amber-300/50 bg-amber-50/80 px-3 py-2.5 text-sm text-amber-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{displayedError}</span>
                </motion.div>
              )}

              <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-2">
                  <Label
                    htmlFor="login-name"
                    className="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--plate-muted)] uppercase"
                  >
                    {t("nameLabel")}
                  </Label>
                  <Input
                    id="login-name"
                    type="text"
                    autoComplete="off"
                    placeholder={t("namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={displayedError ? true : undefined}
                    className="h-12 rounded-xl border-white/65 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-200 placeholder:text-[var(--plate-muted)]/65 focus-visible:border-primary/50 focus-visible:bg-white/60 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <Label
                    htmlFor="login-identifier"
                    className="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--plate-muted)] uppercase"
                  >
                    {t("identifierLabel")}
                  </Label>
                  <Input
                    id="login-identifier"
                    type="text"
                    autoComplete="off"
                    placeholder={t("identifierPlaceholder")}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    aria-invalid={displayedError ? true : undefined}
                    className="h-12 rounded-xl border-white/65 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-200 placeholder:text-[var(--plate-muted)]/65 focus-visible:border-primary/50 focus-visible:bg-white/60 focus-visible:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="font-mono text-[0.65rem] tracking-[0.16em] text-[var(--plate-muted)] uppercase">
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
                        onClick={() => setAccountType(type)}
                        aria-pressed={selected}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "relative flex min-h-[82px] min-w-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-2 py-3 text-center text-sm font-medium transition-colors duration-200",
                          selected
                            ? "border-primary/80 bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_20px_rgba(12,50,86,0.18)]"
                            : "border-white/65 bg-white/30 text-[var(--plate-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-white/55 hover:text-[var(--plate-ink)]",
                        )}
                      >
                        {selected && (
                          <motion.span
                            layoutId="login-role-glow"
                            className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"
                          />
                        )}
                        <Icon className="relative size-4" aria-hidden />
                        <span className="relative">
                          {t(`accountType.${type}`)}
                        </span>
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
                className="mt-1 h-12 rounded-xl border border-white/25 bg-primary font-mono text-xs font-semibold tracking-[0.16em] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_12px_22px_rgba(12,50,86,0.2)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
              >
                {isSubmitting ? t("signingIn") : t("submit")}
              </Button>
            </form>
          </motion.div>

          <div className="relative z-10 mt-5 flex items-center justify-center gap-2 font-mono text-[0.58rem] tracking-[0.14em] text-[var(--plate-muted)]/80 uppercase">
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
