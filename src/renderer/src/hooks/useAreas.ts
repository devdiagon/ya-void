import { Area, FormAreaDTO } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface AreaErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useAreas(farmId: number) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<AreaErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof AreaErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof AreaErrors) => {
    updateError(operation, null);
  };

  const fetchAreas = useCallback(() => {
    if (!farmId) {
      setAreas([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.areas.listByFarm(farmId).then(setAreas);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se ha podido obtener las áreas');
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  const createArea = async (areaData: FormAreaDTO) => {
    updateError('create', null);

    try {
      const newArea = await window.api.areas.create(areaData);
      setAreas((prevAreas) => [...prevAreas, newArea]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear el área';
      updateError('create', errorMessage);
    }
  };

  const updateArea = async (area: Area) => {
    updateError('update', null);

    try {
      await window.api.areas.update(area.id, { name: area.name, farmId: area.farm_id });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar el área';
      updateError('update', errorMessage);
    }
  };

  const deleteArea = async (areaId: number) => {
    updateError('delete', null);

    try {
      await window.api.areas.delete(areaId);
      setAreas((prevAreas) => prevAreas.filter((area) => area.id !== areaId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido eliminar el área';
      updateError('delete', errorMessage);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  return {
    areas,
    loading,
    errors,
    refetch: fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    clearError
  };
}
