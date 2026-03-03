import { Route } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface RouteErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useRoutes(areaId: number) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<RouteErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof RouteErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof RouteErrors) => {
    updateError(operation, null);
  };

  const fetchRoutes = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.routes.listByArea(areaId).then(setRoutes);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener las rutas');
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  const createRoute = async (name: string) => {
    updateError('create', null);

    try {
      const newRoute = await window.api.routes.create({ name, areaId });
      setRoutes((prev) => [...prev, newRoute]);
      return newRoute;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear la ruta';
      updateError('create', errorMessage);
      return null;
    }
  };

  const updateRoute = async (id: number, name: string) => {
    updateError('update', null);

    try {
      await window.api.routes.update(id, { name });
      setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar la ruta';
      updateError('update', errorMessage);
    }
  };

  const deleteRoute = async (id: number) => {
    updateError('delete', null);

    try {
      await window.api.routes.delete(id);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido eliminar la ruta';
      updateError('delete', errorMessage);
    }
  };

  /**
   * Busca una ruta por nombre en el área, o la crea si no existe.
   * Actualiza el estado local para reflejar la nueva ruta si fue creada.
   */
  const findOrCreate = async (name: string): Promise<Route | null> => {
    try {
      const route = await window.api.routes.findOrCreate({ name, areaId });
      setRoutes((prev) => (prev.some((r) => r.id === route.id) ? prev : [...prev, route]));
      return route;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return {
    routes,
    loading,
    errors,
    refetch: fetchRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    findOrCreate,
    clearError
  };
}
