import { Reason } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface ReasonErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useReasons(areaId: number) {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ReasonErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof ReasonErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof ReasonErrors) => {
    updateError(operation, null);
  };

  const fetchReasons = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.reasons.listByArea(areaId).then(setReasons);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener los motivos');
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  const createReason = async (name: string) => {
    updateError('create', null);

    try {
      const newReason = await window.api.reasons.create({ name, areaId });
      setReasons((prev) => [...prev, newReason]);
      return newReason;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear el motivo';
      updateError('create', errorMessage);
      return null;
    }
  };

  const updateReason = async (id: number, name: string) => {
    updateError('update', null);

    try {
      await window.api.reasons.update(id, { name });
      setReasons((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar el motivo';
      updateError('update', errorMessage);
    }
  };

  const deleteReason = async (id: number) => {
    updateError('delete', null);

    try {
      await window.api.reasons.delete(id);
      setReasons((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido eliminar el motivo';
      updateError('delete', errorMessage);
    }
  };

  /**
   * Busca un motivo por nombre en el área, o lo crea si no existe.
   * Actualiza el estado local para reflejar el nuevo motivo si fue creado.
   */
  const findOrCreate = async (name: string): Promise<Reason | null> => {
    try {
      const reason = await window.api.reasons.findOrCreate({ name, areaId });
      setReasons((prev) => (prev.some((r) => r.id === reason.id) ? prev : [...prev, reason]));
      return reason;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  return {
    reasons,
    loading,
    errors,
    refetch: fetchReasons,
    createReason,
    updateReason,
    deleteReason,
    findOrCreate,
    clearError
  };
}
