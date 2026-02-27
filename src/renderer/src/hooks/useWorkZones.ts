import { FormWorkZoneDTO, WorkZone } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface WorkZoneErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useWorkZones() {
  const [workZones, setWorkZones] = useState<WorkZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<WorkZoneErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof WorkZoneErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof WorkZoneErrors) => {
    updateError(operation, null);
  };

  const fetchWorkZones = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.workZones.list().then(setWorkZones);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se ha podido obtener las zonas de trabajo');
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkZone = async (workZoneData: FormWorkZoneDTO) => {
    updateError('create', null);

    try {
      const newWorkZone = await window.api.workZones.create(workZoneData);
      setWorkZones((prevWorkZones) => [...prevWorkZones, newWorkZone]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido crear la zona de trabajo';
      updateError('create', errorMessage);
    }
  };

  const updateWorkZone = async (workZone: WorkZone) => {
    updateError('update', null);

    try {
      await window.api.workZones.update(workZone.id, {
        name: workZone.name,
        startDate: String(workZone.startDate),
        endDate: String(workZone.endDate)
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar la zona de trabajo';
      updateError('update', errorMessage);
    }
  };

  const deleteWorkZone = async (workZoneId: number) => {
    updateError('delete', null);

    try {
      await window.api.workZones.delete(workZoneId);
      setWorkZones((prevWorkZones) =>
        prevWorkZones.filter((workZone) => workZone.id !== workZoneId)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido eliminar la zona de trabajo';
      updateError('delete', errorMessage);
    }
  };

  useEffect(() => {
    fetchWorkZones();
  }, [fetchWorkZones]);

  return {
    workZones,
    loading,
    errors,
    refetch: fetchWorkZones,
    createWorkZone,
    updateWorkZone,
    deleteWorkZone,
    clearError
  };
}
