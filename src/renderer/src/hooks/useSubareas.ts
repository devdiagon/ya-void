import { Subarea } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface SubareaErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useSubareas(areaId: number) {
  const [subareas, setSubareas] = useState<Subarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<SubareaErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof SubareaErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof SubareaErrors) => {
    updateError(operation, null);
  };

  const fetchSubareas = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.subareas.listByArea(areaId).then(setSubareas);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener las subáreas');
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  const createSubarea = async (name: string) => {
    updateError('create', null);

    try {
      const newSubarea = await window.api.subareas.create({ name, areaId });
      setSubareas((prev) => [...prev, newSubarea]);
      return newSubarea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear la subárea';
      updateError('create', errorMessage);
      return null;
    }
  };

  const updateSubarea = async (id: number, name: string) => {
    updateError('update', null);

    try {
      await window.api.subareas.update(id, { name });
      setSubareas((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar la subárea';
      updateError('update', errorMessage);
    }
  };

  const deleteSubarea = async (id: number) => {
    updateError('delete', null);

    try {
      await window.api.subareas.delete(id);
      setSubareas((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido eliminar la subárea';
      updateError('delete', errorMessage);
    }
  };

  const findOrCreate = async (name: string): Promise<Subarea | null> => {
    try {
      const subarea = await window.api.subareas.findOrCreate({ name, areaId });
      setSubareas((prev) => (prev.some((s) => s.id === subarea.id) ? prev : [...prev, subarea]));
      return subarea;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    fetchSubareas();
  }, [fetchSubareas]);

  return {
    subareas,
    loading,
    errors,
    refetch: fetchSubareas,
    createSubarea,
    updateSubarea,
    deleteSubarea,
    findOrCreate,
    clearError
  };
}
