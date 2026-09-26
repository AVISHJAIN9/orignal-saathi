/**
 * Thin compatibility layer so components written against react-router's
 * `Link` / `useNavigate` / `Navigate` API work on TanStack Router, which is
 * this project's router. Paths stay plain strings here; TanStack's typed
 * `to` is relaxed at this single boundary instead of in every call site.
 */
import {
  Link as RouterLink,
  useNavigate as useRouterNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ComponentProps } from "react";

type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  to: string;
  replace?: boolean;
  // Plain object, forwarded to TanStack's own `search` prop so a query
  // string (e.g. `?tab=complianceGaps` for standard-detail.tsx's deep
  // link) is built safely instead of hand-concatenating it into `to`.
  search?: Record<string, string>;
};

export function Link({ to, search, ...rest }: LinkProps) {
  const AnyLink = RouterLink as unknown as React.ComponentType<
    Record<string, unknown>
  >;
  return <AnyLink to={to} search={search} {...rest} />;
}

export function useNavigate() {
  const navigate = useRouterNavigate();
  return (to: string, options?: { replace?: boolean }) =>
    navigate({ to, replace: options?.replace } as never);
}

export function Navigate({
  to,
  replace = true,
}: {
  to: string;
  replace?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    void router.navigate({ to, replace } as never);
  }, [router, to, replace]);
  return null;
}
