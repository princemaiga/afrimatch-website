"use client";

import { useState, useCallback } from "react";

export type PaymentProvider = "stripe" | "flutterwave";

export interface UsePaymentOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callPaymentAPI = useCallback(
    async (body: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          const msg = data.error || "Payment failed";
          setError(msg);
          options.onError?.(msg);
          return null;
        }
        options.onSuccess?.(data);
        return data;
      } catch (err: any) {
        const msg = err.message || "Network error";
        setError(msg);
        options.onError?.(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const subscribe = useCallback(
    async (planId: string, provider: PaymentProvider, countryCode: string, promoCode?: string) => {
      const data = await callPaymentAPI({ action: "subscribe", planId, provider, countryCode, promoCode });
      if (data?.url) {
        window.location.href = data.url;
      }
      return data;
    },
    [callPaymentAPI]
  );

  const cancelSubscription = useCallback(
    async (subscriptionId: string, provider: PaymentProvider, immediately = false) => {
      return callPaymentAPI({ action: "cancel", subscriptionId, provider, immediately });
    },
    [callPaymentAPI]
  );

  const retryPayment = useCallback(
    async (subscriptionId: string, provider: PaymentProvider, planId?: string, countryCode = "US") => {
      const data = await callPaymentAPI({ action: "retry", subscriptionId, provider, planId, countryCode });
      if (data?.url) {
        window.location.href = data.url;
      }
      return data;
    },
    [callPaymentAPI]
  );

  const openManagePortal = useCallback(async () => {
    const data = await callPaymentAPI({ action: "manage", provider: "stripe" });
    if (data?.url) {
      window.location.href = data.url;
    }
    return data;
  }, [callPaymentAPI]);

  const validatePromo = useCallback(
    async (promoCode: string, planId: string) => {
      return callPaymentAPI({ action: "validate-promo", promoCode, planId });
    },
    [callPaymentAPI]
  );

  return {
    loading,
    error,
    subscribe,
    cancelSubscription,
    retryPayment,
    openManagePortal,
    validatePromo,
  };
}
