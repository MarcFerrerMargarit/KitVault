"use client";

import * as React from "react";
import type { QuotaStatus } from "@/lib/quota";

interface QuotaContextValue {
  quota: QuotaStatus | null;
  /** Replace the quota after the server reports a new figure. */
  setQuota: (quota: QuotaStatus | null) => void;
}

const QuotaContext = React.createContext<QuotaContextValue | null>(null);

/**
 * Shares the user's AI quota between the header counter and the Add Shirt
 * modal, so spending a credit updates both without a page reload.
 */
export function QuotaProvider({
  initial,
  children,
}: {
  initial: QuotaStatus | null;
  children: React.ReactNode;
}) {
  const [quota, setQuota] = React.useState<QuotaStatus | null>(initial);

  // Re-sync whenever the server sends a fresh value (e.g. router.refresh()).
  const [syncedProp, setSyncedProp] = React.useState<QuotaStatus | null>(
    initial,
  );
  if (initial !== syncedProp) {
    setSyncedProp(initial);
    setQuota(initial);
  }

  const value = React.useMemo(() => ({ quota, setQuota }), [quota]);

  return (
    <QuotaContext.Provider value={value}>{children}</QuotaContext.Provider>
  );
}

/** Read the shared quota. Returns nulls outside a provider. */
export function useQuota(): QuotaContextValue {
  const ctx = React.useContext(QuotaContext);
  return ctx ?? { quota: null, setQuota: () => {} };
}
