import React from "react";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Modal({ isOpen, title, onClose, children, actions }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl animate-[fadeIn_.2s_ease-out]">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        {actions && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
