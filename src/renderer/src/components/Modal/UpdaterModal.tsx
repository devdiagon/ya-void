import { useEffect, useState } from 'react';

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

  if (state === 'idle') return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        {state === 'available' && (
          <>
            <h2 className="text-lg font-semibold mb-1">Nueva actualización disponible</h2>
            <p className="text-sm text-gray-500 mb-4">
              Versión <span className="font-medium">{info?.version}</span> está lista para descargar.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setState('idle')}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Más tarde
              </button>
              <button
                onClick={() => window.updater.downloadUpdate()}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Descargar
              </button>
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
              <button
                onClick={() => setState('idle')}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Más tarde
              </button>
              <button
                onClick={() => window.updater.installUpdate()}
                className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Reiniciar ahora
              </button>
            </div>
          </>
        )}

        {state === 'error' && (
          <>
            <h2 className="text-lg font-semibold text-red-600 mb-1">Error al actualizar</h2>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setState('idle')}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
