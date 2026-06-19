'use client';

import * as React from 'react';
import { Star, ThumbsUp, ChevronDown, Loader2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getReviews, createReview, type Review, type ReviewStats } from '@/lib/api/reviews';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  targetType: 'academy' | 'coach';
  targetId: string;
}

const sortOptions = [
  { value: '-createdAt', label: 'Most Recent' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-helpfulCount', label: 'Most Helpful' },
] as const;

export function ReviewsSection({ targetType, targetId }: ReviewsSectionProps) {
  const { isAuthenticated, isLoading: authLoading, profile } = useAuth();
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [stats, setStats] = React.useState<ReviewStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<string>('-createdAt');
  const [showForm, setShowForm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [formRating, setFormRating] = React.useState(0);
  const [formTitle, setFormTitle] = React.useState('');
  const [formText, setFormText] = React.useState('');
  const [formError, setFormError] = React.useState('');

  const loadReviews = React.useCallback(async () => {
    setLoading(true);
    const res = await getReviews(targetType, targetId, { sort: sortBy, limit: 50 });
    if (res.ok) {
      setReviews(res.data.reviews);
      setStats(res.data.stats);
    }
    setLoading(false);
  }, [targetType, targetId, sortBy]);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async () => {
    if (formRating === 0) {
      setFormError('Please select a rating');
      return;
    }
    setSubmitting(true);
    setFormError('');

    const res = await createReview({
      targetId,
      targetType,
      rating: formRating,
      title: formTitle.trim() || undefined,
      text: formText.trim() || undefined,
      parentName: profile.name,
    });

    if (res.ok) {
      toast.success('Review submitted');
      setShowForm(false);
      setFormRating(0);
      setFormTitle('');
      setFormText('');
      loadReviews();
    } else {
      setFormError(res.error.message);
    }
    setSubmitting(false);
  };

  const distribution = stats?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Reviews {stats ? `(${stats.totalReviews})` : ''}
          </CardTitle>
          {isAuthenticated && !showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              Write a Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Stats Summary */}
        {stats && stats.totalReviews > 0 && (
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* Average Rating */}
            <div className="flex flex-col items-center gap-1 sm:min-w-[100px]">
              <span className="text-3xl font-bold">{stats.averageRating}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(stats.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-xs">{stats.totalReviews} reviews</span>
            </div>

            {/* Distribution Bar */}
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-right">{star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${((distribution[star] ?? 0) / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-6 text-right">{distribution[star] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="mb-3 flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-border/60 bg-card/40 rounded-md border px-2 py-1.5 text-xs"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="border-border/60 mb-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold mb-3">Your Review</h3>
            {formError && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mb-3">
                {formError}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div>
                <Label className="mb-1.5">Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= formRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30 hover:text-muted-foreground/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-title">Title (optional)</Label>
                <Input
                  id="review-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="review-text">Your review</Label>
                <Textarea
                  id="review-text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Share your experience with this academy..."
                  rows={4}
                  maxLength={2000}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="border-border/40 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.parentName || review.userId?.name || 'Parent'}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                        {review.isVerified && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 ml-1">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {review.title && (
                  <p className="text-sm font-medium mt-2">{review.title}</p>
                )}
                {review.text && (
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{review.text}</p>
                )}
                {review.sport && (
                  <Badge variant="outline" className="text-[10px] mt-2 capitalize">{review.sport}</Badge>
                )}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <ThumbsUp className="h-3 w-3" />
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
