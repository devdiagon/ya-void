import { FormTripDTO, Trip, TripStatus } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface TripErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  confirm: string | null;
  delete: string | null;
}

export function useTrips(workZoneSheetId: number) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<TripErrors>({
    fetch: null,
    create: null,
    update: null,
    confirm: null,
    delete: null
  });

  const updateError = (operation: keyof TripErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof TripErrors) => {
    updateError(operation, null);
  };

  const fetchTrips = useCallback(() => {
    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.trips.listByWorkZoneSheet(workZoneSheetId).then(setTrips);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se han podido obtener los viajes');
    } finally {
      setLoading(false);
    }
  }, [workZoneSheetId]);

  const fetchTripsByStatus = useCallback(
    (status: TripStatus) => {
      setLoading(true);
      updateError('fetch', null);

      try {
        window.api.trips.listByWorkZoneSheetAndStatus(workZoneSheetId, status).then(setTrips);
      } catch (err) {
        console.error(err);
        updateError('fetch', 'No se han podido obtener los viajes');
      } finally {
        setLoading(false);
      }
    },
    [workZoneSheetId]
  );

  const createTrip = async (data: FormTripDTO): Promise<Trip | null> => {
    updateError('create', null);

    try {
      const newTrip = await window.api.trips.create(data);
      setTrips((prev) => [...prev, newTrip]);
      return newTrip;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido crear el viaje';
      updateError('create', errorMessage);
      return null;
    }
  };

  const updateTrip = async (id: number, data: FormTripDTO): Promise<boolean> => {
    updateError('update', null);

    try {
      const ok = await window.api.trips.update(id, data);
      if (ok) {
        setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
      }
      return ok;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar el viaje';
      updateError('update', errorMessage);
      return false;
    }
  };

  /**
   * Confirma un viaje (status → ready, captura snapshots).
   * Devuelve el resultado del servidor: { success } o { success: false, missing }.
   */
  const confirmTrip = async (
    id: number
  ): Promise<{ success: true } | { success: false; missing: string[] }> => {
    updateError('confirm', null);

    try {
      const result = await window.api.trips.confirm(id);
      if (result.success) {
        setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'ready' } : t)));
      } else {
        updateError('confirm', `Faltan campos: ${result.missing.join(', ')}`);
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido confirmar el viaje';
      updateError('confirm', errorMessage);
      return { success: false, missing: [] };
    }
  };

  const reopenTrip = async (id: number): Promise<boolean> => {
    updateError('confirm', null);

    try {
      const ok = await window.api.trips.reopen(id);
      if (ok) {
        setTrips((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: 'pending',
                  routeSnapshot: null,
                  reasonSnapshot: null,
                  subareaSnapshot: null
                }
              : t
          )
        );
      }
      return ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteTrip = async (id: number): Promise<void> => {
    updateError('delete', null);

    try {
      await window.api.trips.delete(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'No se ha podido eliminar el viaje';
      updateError('delete', errorMessage);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    loading,
    errors,
    refetch: fetchTrips,
    fetchTripsByStatus,
    createTrip,
    updateTrip,
    confirmTrip,
    reopenTrip,
    deleteTrip,
    clearError
  };
}
