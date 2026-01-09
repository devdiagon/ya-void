import { FormFarmDTO, Farm } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface FarmErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FarmErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof FarmErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof FarmErrors) => {
    updateError(operation, null);
  };

  const fetchFarms = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.farms.list().then(setFarms);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se ha podido obtener las fincas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFarm = async (farmData: FormFarmDTO) => {
    updateError('create', null);

    try {
      const newFarm = await window.api.farms.create(farmData);
      setFarms((prevFarms) => [...prevFarms, newFarm]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear la finca';
      updateError('create', errorMessage);
    }
  };

  const updateFarm = async (farm: Farm) => {
    updateError('update', null);

    try {
      await window.api.farms.update(farm.id, { name: farm.name });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar la finca';
      updateError('update', errorMessage);
    }
  };

  const deleteFarm = async (farmId: number) => {
    updateError('delete', null);

    try {
      await window.api.farms.delete(farmId);
      setFarms((prevFarms) => prevFarms.filter((farm) => farm.id !== farmId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido eliminar la finca';
      updateError('delete', errorMessage);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  return {
    farms,
    loading,
    errors,
    refetch: fetchFarms,
    createFarm,
    updateFarm,
    deleteFarm,
    clearError
  };
}
