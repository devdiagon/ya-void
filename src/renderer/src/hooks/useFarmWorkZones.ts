import { FarmWorkZone, FormFarmWorkZoneDTO } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface FarmWorkZoneErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useFarmWorkZones(workZoneId: number) {
  const [farmWorkZones, setFarmWorkZones] = useState<FarmWorkZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FarmWorkZoneErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof FarmWorkZoneErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof FarmWorkZoneErrors) => {
    updateError(operation, null);
  };

  const fetchFarmWorkZones = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.farmWorkZones.listByWorkZone(workZoneId).then(setFarmWorkZones);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener las zonas de trabajo de la finca');
    } finally {
      setLoading(false);
    }
  }, [workZoneId]);

  const createFarmWorkZone = async (farmWorkZoneData: FormFarmWorkZoneDTO) => {
    updateError('create', null);

    try {
      const newFarmWorkZone = await window.api.farmWorkZones.create(farmWorkZoneData);
      setFarmWorkZones((prev) => [...prev, newFarmWorkZone]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido crear la zona de trabajo de la finca';
      updateError('create', errorMessage);
    }
  };

  const updateFarmWorkZone = async (farmWorkZone: FarmWorkZone) => {
    updateError('update', null);

    try {
      await window.api.farmWorkZones.update({
        id: farmWorkZone.id,
        workZoneId: farmWorkZone.workZoneId,
        farmId: farmWorkZone.farmId,
        name: farmWorkZone.name
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se ha podido actualizar la zona de trabajo de la finca';
      updateError('update', errorMessage);
    }
  };

  const deleteFarmWorkZone = async (farmWorkZoneId: number) => {
    updateError('delete', null);

    try {
      await window.api.farmWorkZones.delete(farmWorkZoneId);
      setFarmWorkZones((prev) => prev.filter((fwz) => fwz.id !== farmWorkZoneId));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se ha podido eliminar la zona de trabajo de la finca';
      updateError('delete', errorMessage);
    }
  };

  useEffect(() => {
    fetchFarmWorkZones();
  }, [fetchFarmWorkZones]);

  return {
    farmWorkZones,
    loading,
    errors,
    refetch: fetchFarmWorkZones,
    createFarmWorkZone,
    updateFarmWorkZone,
    deleteFarmWorkZone,
    clearError
  };
}
