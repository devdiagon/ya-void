import { useEffect, useState } from 'react';
import type { Farm } from '../../types/electron';

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.api.farms
      .list()
      .then(setFarms)
      .catch((err) => {
        console.error(err);
        setError('No se ha podido obtener las fincas');
      })
      .finally(() => setLoading(false));
  }, []);

  return { farms, loading, error };
}
