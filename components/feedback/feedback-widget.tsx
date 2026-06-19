'use client';

import * as React from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { trackFeedback } from '@/lib/analytics/events';

type FeedbackType = 'bug' | 'suggestion' | 'academy_request' | 'other';

const feedbackTypes: { value: FeedbackType; label: string }[] = [
  { value: 'bug', label: 'Report a bug' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'academy_request', label: 'Request an academy' },
  { value: 'other', label: 'Other' },
];

export function FeedbackWidget() {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<FeedbackType>('suggestion');
  const [message, setMessage] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = () => {
    if (!message.trim()) return;
    trackFeedback(type, message.trim());
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setMessage('');
      setType('suggestion');
    }, 2000);
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full shadow-lg md:bottom-6"
        size="icon"
        aria-label="Send feedback"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </Button>

      {/* Feedback panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card border-border/60 fixed bottom-36 right-4 z-50 w-80 rounded-2xl border p-4 shadow-xl md:bottom-20 md:right-6"
          >
            {submitted ? (
              <div className="py-6 text-center">
                <p className="text-sm font-medium">Thanks for your feedback!</p>
                <p className="text-muted-foreground mt-1 text-xs">We appreciate you helping us improve.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium">Send feedback</p>
                  <p className="text-muted-foreground text-xs">Help us improve SportsOS</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {feedbackTypes.map((ft) => (
                    <button
                      key={ft.value}
                      onClick={() => setType(ft.value)}
                      className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                        type === ft.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={3}
                  className="bg-background border-border/60 w-full resize-none rounded-lg border p-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  maxLength={500}
                />

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">{message.length}/500</span>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    className="h-9 gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
