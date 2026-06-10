'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  className,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const [focused, setFocused] = React.useState(autoFocus);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const digits = value.split('');

  React.useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange(raw);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value && inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
    }
  }

  function handleClick() {
    inputRef.current?.focus();
  }

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      onClick={handleClick}
      role="group"
      aria-label="One-time code"
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name="otp"
        maxLength={length}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        autoComplete="one-time-code"
        aria-label={`Enter ${length}-digit code`}
        className="sr-only"
      />
      {Array.from({ length }, (_, i) => {
        const char = digits[i] ?? '';
        const isActive = i === value.length && focused;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              'flex h-12 w-10 items-center justify-center rounded-lg border text-lg font-semibold transition-colors',
              isActive
                ? 'border-primary ring-primary/30 ring-2'
                : char
                  ? 'border-foreground/30 bg-foreground/5'
                  : 'border-input',
              disabled && 'opacity-50',
            )}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
