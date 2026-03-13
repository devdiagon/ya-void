import { useEffect, useState } from 'react';
import { ActionButton, OutlineButton } from '../Button';
import { Modal } from './Modal';

type UpdaterState = 'idle' | 'available' | 'downloading' | 'ready' | 'error';

interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

export function UpdaterModal() {
  const [state, setState] = useState<UpdaterState>('idle');
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    window.updater.onUpdateAvailable((info) => {
      setInfo(info);
      setState('available');
    });

    window.updater.onDownloadProgress((pct) => {
      setProgress(pct);
      setState('downloading');
    });

    window.updater.onUpdateDownloaded(() => {
      setState('ready');
    });

    window.updater.onError((err) => {
      setError(err);
      setState('error');
    });
  }, []);

  const handleClose = () => setState('idle');

  return (
    <Modal
      size="sm"
      isOpen={state !== 'idle'}
      onClose={handleClose}
      closeOnOutsideClick={state !== 'downloading'}
    >
      {state === 'available' && (
        <>
          <h2 className="text-2xl text-blue-700 font-semibold mb-4">
            Hay una nueva versión disponible
          </h2>
          <p className="text-sm text-gray-500 my-4">
            La versión <span className="font-medium text-green-600">{info?.version}</span> está
            lista para descargar.
          </p>
          <div className="flex gap-2 justify-end m-4">
            <OutlineButton onClick={() => setState('idle')}>Más tarde</OutlineButton>
            <ActionButton onClick={() => window.updater.downloadUpdate()}>Descargar</ActionButton>
          </div>
        </>
      )}
      {state === 'downloading' && (
        <>
          <h2 className="text-lg font-semibold mb-3">Descargando actualización...</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-right">{progress}%</p>
        </>
      )}
      {state === 'ready' && (
        <>
          <h2 className="text-lg font-semibold mb-1">¡Lista para instalar!</h2>
          <p className="text-sm text-gray-500 mb-4">
            La actualización fue descargada. Reinicia para aplicarla.
          </p>
          <div className="flex gap-2 justify-end">
            <OutlineButton onClick={() => setState('idle')}>Más tarde</OutlineButton>
            <ActionButton onClick={() => window.updater.installUpdate()}>
              Reiniciar ahora
            </ActionButton>
          </div>
        </>
      )}
      {state === 'error' && (
        <>
          <h2 className="text-lg font-semibold text-red-600 mb-1">Error al actualizar</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <div className="flex justify-end">
            <ActionButton onClick={() => setState('idle')}>Cerrar</ActionButton>
          </div>
        </>
      )}
    </Modal>
  );
}
