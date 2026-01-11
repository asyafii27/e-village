import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Select({ options, placeholder = "Pilih...", value, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(value);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (val: string) => {
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  useEffect(() => {
    if (selectedValue !== undefined) {
      setOpen(false);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={"select-root" + (open ? " select-open" : "")}
      data-open={open ? "true" : "false"}
    >
      <button
        type="button"
        className="select-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selectedOption ? "select-value" : "select-placeholder"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="select-caret">▾</span>
      </button>
      {open && (
        <div className="select-menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={
                "select-option" +
                (opt.value === selectedValue ? " select-option-selected" : "")
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleSelect(opt.value);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
