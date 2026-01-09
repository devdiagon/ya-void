import { useState } from 'react';

interface UseModalOptions<T = any> {
  onOpen?: (data?: T) => void;
  onClose?: () => void;
}

export const useModal = <T = any>(options?: UseModalOptions<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = (modalData?: T) => {
    setData(modalData || null);
    setIsOpen(true);
    options?.onOpen?.(modalData);
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
    options?.onClose?.();
  };

  return {
    isOpen,
    data,
    open,
    close
  };
};
