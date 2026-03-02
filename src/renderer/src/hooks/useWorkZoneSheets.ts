import { FormWorkZoneSheetDTO, WorkZoneSheet } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface WorkZoneSheetErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
}

export function useWorkZoneSheets(farmWorkZoneId: number) {
  const [workZoneSheets, setWorkZoneSheets] = useState<WorkZoneSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<WorkZoneSheetErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null
  });

  const updateError = (operation: keyof WorkZoneSheetErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof WorkZoneSheetErrors) => {
    updateError(operation, null);
  };

  const fetchWorkZoneSheets = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.workZoneSheets.listByFarmWorkZone(farmWorkZoneId).then(setWorkZoneSheets);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener las hojas de zona de trabajo');
    } finally {
      setLoading(false);
    }
  }, [farmWorkZoneId]);

  const createWorkZoneSheet = async (data: FormWorkZoneSheetDTO) => {
    updateError('create', null);

    try {
      const newSheet = await window.api.workZoneSheets.create(data);
      setWorkZoneSheets((prev) => [...prev, newSheet]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido crear la hoja de zona de trabajo';
      updateError('create', errorMessage);
    }
  };

  const updateWorkZoneSheet = async (sheet: WorkZoneSheet) => {
    updateError('update', null);

    try {
      await window.api.workZoneSheets.update({
        id: sheet.id,
        name: sheet.name,
        farmWorkZoneId: sheet.farmWorkZoneId,
        areaId: sheet.areaId,
        totalSheet: sheet.totalSheet
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se ha podido actualizar la hoja de zona de trabajo';
      updateError('update', errorMessage);
    }
  };

  const deleteWorkZoneSheet = async (sheetId: number) => {
    updateError('delete', null);

    try {
      await window.api.workZoneSheets.delete(sheetId);
      setWorkZoneSheets((prev) => prev.filter((s) => s.id !== sheetId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido eliminar la hoja de zona de trabajo';
      updateError('delete', errorMessage);
    }
  };

  useEffect(() => {
    fetchWorkZoneSheets();
  }, [fetchWorkZoneSheets]);

  return {
    workZoneSheets,
    loading,
    errors,
    refetch: fetchWorkZoneSheets,
    createWorkZoneSheet,
    updateWorkZoneSheet,
    deleteWorkZoneSheet,
    clearError
  };
}
