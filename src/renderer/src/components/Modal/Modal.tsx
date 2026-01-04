import { X } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import { IconButton } from "../Button";

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  overlayClassName?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  className = '',
  overlayClassName = ''
} : ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
    >
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Modal container */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl 
          w-full ${sizeClasses[size]}
          transform transition-all duration-300
          max-h-[90vh] flex flex-col
          ${className}
        `}
      >
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {!title && <div />}
            
            {showCloseButton && (
              <IconButton
                icon={<X size={20} />}
                variant="ghost"
                size="sm"
                rounded
                ariaLabel="Cerrar"
                onClick={onClose}
              />
            )}
          </div>
        )}

        {/* Modal content with scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}