import { BusinessMetrics } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface MetricErrors {
  fetch: string | null;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<MetricErrors>({ fetch: null });

  const updateError = useCallback((operation: keyof MetricErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  }, []);

  const clearError = useCallback(
    (operation: keyof MetricErrors) => {
      updateError(operation, null);
    },
    [updateError]
  );

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    updateError('fetch', null);

    try {
      const data = await window.api.metrics.get();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'No se han podido obtener las métricas';
      updateError('fetch', message);
    } finally {
      setLoading(false);
    }
  }, [updateError]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    errors,
    refetch: fetchMetrics,
    clearError
  };
}
