export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-primary text-primary-foreground focus-visible:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--z-tooltip)] focus:rounded-md focus:px-3 focus:py-1.5 focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
