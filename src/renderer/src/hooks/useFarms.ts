import { CreateFarmDTO, Farm } from '@renderer/types';
import { useEffect, useState } from 'react';

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarms = () => {
    setLoading(true);
    setError(null);
    window.api.farms
      .list()
      .then(setFarms)
      .catch((err) => {
        console.error(err);
        setError('No se ha podido obtener las fincas');
      })
      .finally(() => setLoading(false));
  };

  const createFarm = async (farmData: CreateFarmDTO) => {
    setError(null);
    try {
      const newFarm = await window.api.farms.create(farmData);
      setFarms((prevFarms) => [...prevFarms, newFarm]);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear la finca';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const clearError = () => setError(null);

  return { farms, loading, error, refetch: fetchFarms, createFarm, clearError };
}
