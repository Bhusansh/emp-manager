'use client';

import { useState, useRef, useEffect } from 'react';

interface ComboBoxProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}

export default function ComboBox({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  placeholder = '',
}: ComboBoxProps) {
  const isCustom = value !== '' && !options.includes(value);
  const [mode, setMode] = useState<'select' | 'custom'>(isCustom && value ? 'custom' : 'select');
  const [customValue, setCustomValue] = useState(isCustom ? value : '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'custom' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  // Sync when value changes externally
  useEffect(() => {
    if (value && options.includes(value)) {
      setMode('select');
    } else if (value && !options.includes(value)) {
      setMode('custom');
      setCustomValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === '__CUSTOM__') {
      setMode('custom');
      setCustomValue('');
      onChange('');
    } else {
      setMode('select');
      onChange(val);
    }
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase();
    setCustomValue(val);
    onChange(val);
  }

  function handleBackToSelect() {
    setMode('select');
    setCustomValue('');
    onChange('');
  }

  return (
    <div className="combobox-wrapper">
      {mode === 'select' ? (
        <select
          className="input-field"
          id={id}
          value={options.includes(value) ? value : ''}
          onChange={handleSelectChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__CUSTOM__">OTHER (CUSTOM)</option>
        </select>
      ) : (
        <div className="combobox-custom">
          <input
            ref={inputRef}
            className="input-field"
            id={id}
            type="text"
            value={customValue}
            onChange={handleCustomChange}
            placeholder={placeholder || `Enter custom ${label.toLowerCase()}`}
            required={required}
          />
          <button
            type="button"
            className="combobox-back-btn"
            onClick={handleBackToSelect}
            title="Back to list"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
