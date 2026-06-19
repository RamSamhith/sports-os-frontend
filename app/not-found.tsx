import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Page not found</h1>
      <p className="text-muted-foreground mt-3 max-w-md text-balance">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/academies">Browse Academies</Link>
        </Button>
      </div>
    </Container>
  );
}
