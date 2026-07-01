import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  autoComplete?: string;
}

function PhoneInput({
  value = '',
  onChange,
  onBlur,
  error,
  id,
  disabled,
  required,
  className,
  autoComplete,
}: PhoneInputProps) {
  const [touched, setTouched] = React.useState(false);
  const inputId = id ?? 'phone-input';
  const errorId = `${inputId}-error`;

  const showError = touched && !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    onChange?.(digits);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    onBlur?.(e);
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="relative flex items-center">
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute left-3 z-10 select-none text-sm',
            'text-muted-foreground',
          )}
        >
          +91
        </span>
        <Input
          id={inputId}
          type="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={10}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          aria-required={required || undefined}
          className={cn('pl-11 tabular-nums', showError && 'border-destructive')}
        />
      </div>
      {showError && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { PhoneInput };
