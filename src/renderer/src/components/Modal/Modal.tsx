import { X } from 'lucide-react';
import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import { IconButton } from '../Button';
import './modal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl'
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  closeOnOutsideClick?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOutsideClick = true
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      dialog.focus();
      requestAnimationFrame(() => {
        dialog.classList.add('modal-open');
      });
    } else {
      dialog.classList.remove('modal-open');
      const timer = setTimeout(() => {
        dialog.close();
      }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (!closeOnOutsideClick) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={handleClose}
      className="
        backdrop:bg-black bg-transparent p-0 rounded-lg shadow-xl 
        fixed top-1/2 left-1/2 m-0
        opacity-0 backdrop:opacity-0
        transition-all duration-200
      "
      style={{
        transform: 'translate(-50%, -50%) scale(0.95)'
      }}
    >
      <div
        className={`bg-white rounded-lg ${sizeClasses[size]} w-full max-h-[85vh] flex flex-col relative`}
      >
        {/* Close button */}
        <IconButton
          icon={<X size={20} />}
          variant="ghost"
          size="sm"
          rounded
          ariaLabel="Cerrar"
          onClick={handleClose}
          className="absolute top-3 right-3 z-10"
        />

        {/* Content - scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </dialog>
  );
};
