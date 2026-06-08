'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit' | 'value'> {
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchBar({ onSearch, placeholder, className, defaultValue = '', ...props }: SearchBarProps) {
  const [value, setValue] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn('relative', className)}
    >
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? 'Search academies, coaches, sports…'}
        className="h-12 pl-9 text-base"
        {...props}
      />
    </form>
  );
}
