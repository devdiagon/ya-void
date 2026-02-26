import { FormRequesterDTO, Requester } from '@renderer/types';
import { useCallback, useEffect, useState } from 'react';

interface RequesterErrors {
  fetch: string | null;
  create: string | null;
  update: string | null;
  delete: string | null;
  remove: string | null;
}

export function useRequesters(areaId: number) {
  const [requesters, setRequesters] = useState<Requester[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<RequesterErrors>({
    fetch: null,
    create: null,
    update: null,
    delete: null,
    remove: null
  });

  const updateError = (operation: keyof RequesterErrors, error: string | null) => {
    setErrors((prev) => ({ ...prev, [operation]: error }));
  };

  const clearError = (operation: keyof RequesterErrors) => {
    updateError(operation, null);
  };

  const fetchRequesters = useCallback(() => {
    if (!areaId) {
      setRequesters([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    updateError('fetch', null);

    try {
      window.api.requesters.listByArea(areaId).then(setRequesters);
    } catch (err) {
      console.error(err);
      updateError('fetch', 'No se ha podido obtener los solicitantes');
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  const createRequester = async (requesterData: FormRequesterDTO) => {
    updateError('create', null);

    try {
      const newRequester = await window.api.requesters.create(requesterData);
      await window.api.requesters.assignToArea({ requesterId: newRequester.id, areaId });
      setRequesters((prevRequesters) => [...prevRequesters, newRequester]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido crear el solicitante';
      updateError('create', errorMessage);
    }
  };

  const updateRequester = async (requester: Requester) => {
    updateError('update', null);

    try {
      const updatedRequester = await window.api.requesters.update(requester.id, {
        name: requester.name
      });
      setRequesters((prevRequesters) =>
        prevRequesters.map((item) => (item.id === updatedRequester.id ? updatedRequester : item))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido actualizar el solicitante';
      updateError('update', errorMessage);
    }
  };

  const deleteRequester = async (requesterId: number) => {
    updateError('delete', null);

    try {
      await window.api.requesters.delete(requesterId);
      setRequesters((prevRequesters) =>
        prevRequesters.filter((requester) => requester.id !== requesterId)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido eliminar el solicitante';
      updateError('delete', errorMessage);
    }
  };

  const removeRequesterFromArea = async (requesterId: number) => {
    updateError('remove', null);

    try {
      await window.api.requesters.removeFromArea({ requesterId, areaId });
      setRequesters((prevRequesters) =>
        prevRequesters.filter((requester) => requester.id !== requesterId)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'No se ha podido quitar el solicitante del área';
      updateError('remove', errorMessage);
    }
  };

  useEffect(() => {
    fetchRequesters();
  }, [fetchRequesters]);

  return {
    requesters,
    loading,
    errors,
    refetch: fetchRequesters,
    createRequester,
    updateRequester,
    deleteRequester,
    removeRequesterFromArea,
    clearError
  };
}
