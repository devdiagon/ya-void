import type { UpdateInfo } from 'builder-util-runtime';
import { PackageIcon, TriangleAlertIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ActionButton, OutlineButton } from '../Button';
import { Modal } from './Modal';

type UpdaterState = 'idle' | 'available' | 'downloading' | 'ready' | 'error';

interface Updater {
  onUpdateAvailable: (cb: (info: UpdateInfo) => void) => void;
  onDownloadProgress: (cb: (pct: number) => void) => void;
  onUpdateDownloaded: (cb: () => void) => void;
  onError: (cb: (err: string) => void) => void;
  downloadUpdate: () => void;
  installUpdate: () => void;
}

declare global {
  interface Window {
    updater: Updater;
  }
}

export function UpdaterModal() {
  const [state, setState] = useState<UpdaterState>('idle');
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    window.updater.onUpdateAvailable((updateInfo) => {
      setInfo(updateInfo);
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
  const getVersion = () => info?.version ?? '';

  return (
    <Modal
      size="lg"
      isOpen={state !== 'idle'}
      onClose={handleClose}
      closeOnOutsideClick={state !== 'downloading'}
    >
      {state === 'available' && (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-md p-3 flex-shrink-0">
              <PackageIcon className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">
              Hay una nueva versión disponible
            </h3>
          </div>
          <p className="text-gray-700 mb-8">
            La versión <span className="font-medium text-green-600">{getVersion()}</span> está lista
            para descargar.
          </p>
          <div className="flex gap-2 justify-end">
            <OutlineButton onClick={() => setState('idle')}>Más tarde</OutlineButton>
            <ActionButton onClick={() => window.updater.downloadUpdate()}>Descargar</ActionButton>
          </div>
        </div>
      )}
      {state === 'downloading' && (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-md p-3 flex-shrink-0">
              <PackageIcon className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Descarga en curso</h3>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 text-right">{progress}%</p>
        </div>
      )}
      {state === 'ready' && (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-md p-3 flex-shrink-0">
              <PackageIcon className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Descarga completada</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Reinicia la aplicación para aplicarla.</p>
          <div className="flex gap-2 justify-end">
            <OutlineButton onClick={() => setState('idle')}>Más tarde</OutlineButton>
            <ActionButton onClick={() => window.updater.installUpdate()}>
              Reiniciar ahora
            </ActionButton>
          </div>
        </div>
      )}
      {state === 'error' && (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 rounded-md p-3 flex-shrink-0">
              <TriangleAlertIcon className="text-red-600" size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-red-700 mb-4">Error al actualizar</h3>
          </div>
          <p className="text-gray-700 mb-8">{error}</p>
          <div className="flex justify-end">
            <ActionButton onClick={() => setState('idle')}>Cerrar</ActionButton>
          </div>
        </div>
      )}
    </Modal>
  );
}
