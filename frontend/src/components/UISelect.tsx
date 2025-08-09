import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export type SelectOption = {
  value: string;
  label: string;
};

type UISelectProps = {
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

export default function UISelect({ value, placeholder = "Select", options, onChange, className = "" }: UISelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full inline-flex items-center justify-between px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "text-gray-500"}>{selected ? selected.label : placeholder}</span>
        <FaChevronDown className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 z-50 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-lg overflow-hidden">
          <ul role="listbox" className="max-h-60 overflow-y-auto">
            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No options</li>
            )}
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-3 py-2 cursor-pointer text-sm select-none hover:bg-blue-600 hover:text-white ${
                    isSelected ? "bg-blue-600 text-white" : ""
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
