import { useEffect, useMemo, useRef, useState } from "react";

interface DatePickerProps {
  placeholder?: string;
}

function formatDisplay(date: Date | null): string {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DatePicker({ placeholder = "dd/mm/yyyy" }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const rootRef = useRef<HTMLDivElement | null>(null);

  const weeks = useMemo(() => {
    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const startWeekday = start.getDay() === 0 ? 7 : start.getDay();
    const totalDays = end.getDate();

    const days: (Date | null)[] = [];
    for (let i = 1; i < startWeekday; i += 1) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d += 1) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }
    return rows;
  }, [viewDate]);

  const years = useMemo(() => {
    const currentYear = viewDate.getFullYear();
    const list: number[] = [];
    for (let year = currentYear - 90; year <= currentYear + 10; year += 1) {
      list.push(year);
    }
    return list;
  }, [viewDate]);

  const displayValue = selectedDate ? formatDisplay(selectedDate) : "";

  const handleSelectDay = (day: Date | null) => {
    if (!day) return;
    setSelectedDate(day);
  };

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const handleNextYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  const handleMonthChange = (event: any) => {
    const newMonth = Number(event.target.value);
    setViewDate((prev) => new Date(prev.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (event: any) => {
    const newYear = Number(event.target.value);
    setViewDate((prev) => new Date(newYear, prev.getMonth(), 1));
  };

  useEffect(() => {
    // Tutup popup setiap kali ada tanggal yang terpilih
    if (selectedDate) {
      setOpen(false);
    }
  }, [selectedDate]);

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

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <div ref={rootRef} className="date-picker-root">
      <button
        type="button"
        className="date-picker-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={displayValue ? "date-picker-value" : "date-picker-placeholder"}>
          {displayValue || placeholder}
        </span>
        <span className="date-picker-icon">📅</span>
      </button>
      {open && (
        <div className="date-picker-popover">
          <div className="date-picker-header">
            <button
              type="button"
              className="btn-base btn-ghost date-picker-nav"
              onClick={handlePrevYear}
            >
              «
            </button>
            <button
              type="button"
              className="btn-base btn-ghost date-picker-nav"
              onClick={handlePrevMonth}
            >
              ‹
            </button>
            <div className="date-picker-month">
              <select
                className="date-picker-month-select"
                value={viewDate.getMonth()}
                onChange={handleMonthChange}
              >
                {monthNames.map((name, index) => (
                  <option key={name} value={index}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                className="date-picker-year-select"
                value={viewDate.getFullYear()}
                onChange={handleYearChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn-base btn-ghost date-picker-nav"
              onClick={handleNextMonth}
            >
              ›
            </button>
            <button
              type="button"
              className="btn-base btn-ghost date-picker-nav"
              onClick={handleNextYear}
            >
              »
            </button>
          </div>
          <div className="date-picker-grid">
            {["S", "M", "S", "R", "K", "J", "S"].map((d) => (
              <div key={d} className="date-picker-weekday">
                {d}
              </div>
            ))}
            {weeks.map((row, rowIndex) =>
              row.map((day, idx) => {
                const key = `${rowIndex}-${idx}`;
                if (!day) {
                  return <div key={key} className="date-picker-day empty" />;
                }
                const isSelected =
                  selectedDate &&
                  day.getDate() === selectedDate.getDate() &&
                  day.getMonth() === selectedDate.getMonth() &&
                  day.getFullYear() === selectedDate.getFullYear();

                return (
                  <button
                    key={key}
                    type="button"
                    className={
                      "date-picker-day" + (isSelected ? " date-picker-day-selected" : "")
                    }
                    onClick={() => handleSelectDay(day)}
                  >
                    {day.getDate()}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
