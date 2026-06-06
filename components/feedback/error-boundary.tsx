'use client';

import * as React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional label shown in the fallback header — helps when nested boundaries exist. */
  label?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Local error boundary. Wraps a chunk of the UI so a single render-time
 * crash doesn't take down the whole page (navbar, footer, theming).
 * Uses `componentDidCatch` so it works in React 18 and 19 alike.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface to the console so it can be picked up by the monitoring layer.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', this.props.label ?? 'root', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        className={cn(
          'border-destructive/30 bg-destructive/5 mx-auto my-8 flex w-full max-w-md flex-col items-center gap-3 rounded-xl border p-8 text-center',
        )}
      >
        <div className="bg-destructive/10 grid h-12 w-12 place-items-center rounded-full">
          <AlertTriangle className="text-destructive h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold tracking-tight">
            {this.props.label ? `${this.props.label} failed to load` : 'Something went wrong'}
          </h3>
          <p className="text-muted-foreground text-sm text-pretty">
            {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={this.reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Try again
        </Button>
      </div>
    );
  }
}
