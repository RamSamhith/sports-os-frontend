import { Container } from '@/components/layout/container';
import { FullPageSkeleton } from '@/components/feedback/skeletons';

export default function Loading() {
  return (
    <Container>
      <FullPageSkeleton />
    </Container>
  );
}
