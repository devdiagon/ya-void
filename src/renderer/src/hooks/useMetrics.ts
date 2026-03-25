import { BusinessMetrics } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface MetricErrors {
  fetch: string | null;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<MetricErrors>({
    fetch: null
  });

  const updateError = (operation: keyof MetricErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof MetricErrors) => {
    updateError(operation, null);
  };

  const fetchMetrics = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);
    try {
      window.api.metrics.get().then((data) => {
        setMetrics(data);
        setLoading(false);
      });
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener las métricas');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
