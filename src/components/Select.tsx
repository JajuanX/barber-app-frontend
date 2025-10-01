import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Select.scss';

export type SelectOption = { value: string; label: string };

type Props = {
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export const Select: React.FC<Props> = ({ name, value, onChange, options, placeholder = 'Select…', disabled, className }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = useMemo(() => options.find((o) => o.value === value), [options, value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const toggle = () => { if (!disabled) setOpen(!open); };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const pick = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`select ${open ? 'select--open' : ''} ${disabled ? 'select--disabled' : ''} ${className || ''}`.trim()}>
      <button
        type="button"
        className="select__control"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={name ? `${name}-menu` : undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={`select__value ${!current ? 'select__value--placeholder' : ''}`}>{current ? current.label : placeholder}</span>
        <span className="select__arrow">▾</span>
      </button>
      {open && (
        <ul role="listbox" id={name ? `${name}-menu` : undefined} className="select__menu">
          {options.map((opt) => (
            <li
              role="option"
              aria-selected={opt.value === value}
              key={opt.value}
              className={`select__option ${opt.value === value ? 'select__option--selected' : ''}`}
              onClick={() => pick(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;

