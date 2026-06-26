import { ShortlistView } from '@/components/shortlist/shortlist-view';

export default function SavedPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Saved Academies</h1>
      <ShortlistView entityType="academy" />
    </div>
  );
}
