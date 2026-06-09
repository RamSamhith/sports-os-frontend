'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sportTaxonomy } from '@/lib/constants/sport-taxonomy';
import type { Child } from '@/lib/hooks/use-children';

interface ChildFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; age: number; sport: string; skillLevel?: string }) => void;
  child?: Child | null;
}

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Competitive'];

export function ChildFormDialog({ open, onOpenChange, onSubmit, child }: ChildFormDialogProps) {
  const isEdit = !!child;
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sport, setSport] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string; sport?: string }>({});

  useEffect(() => {
    if (open) {
      if (child) {
        setName(child.name);
        setAge(String(child.age));
        setSport(child.sport);
        setSkillLevel(child.skillLevel ?? '');
      } else {
        setName('');
        setAge('');
        setSport('');
        setSkillLevel('');
      }
      setErrors({});
    }
  }, [open, child]);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Name is required';
    const parsedAge = Number(age);
    if (!age || isNaN(parsedAge) || parsedAge < 3 || parsedAge > 25 || !Number.isInteger(parsedAge)) {
      e.age = 'Age must be 3–25';
    }
    if (!sport) e.sport = 'Select a sport';
    return e;
    }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    onSubmit({
      name: name.trim(),
      age: Number(age),
      sport,
      skillLevel: skillLevel || undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit child' : 'Add child'}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update your child\u2019s details." : "Add a child to track their sports journey."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="child-name">Name</Label>
            <Input
              id="child-name"
              placeholder="Child's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'child-name-error' : undefined}
              autoFocus
            />
            {errors.name && (
              <p id="child-name-error" role="alert" className="text-destructive text-xs">
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="child-age">Age</Label>
            <Input
              id="child-age"
              type="number"
              min={3}
              max={25}
              placeholder="3–25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? 'child-age-error' : undefined}
            />
            {errors.age && (
              <p id="child-age-error" role="alert" className="text-destructive text-xs">
                {errors.age}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="child-sport">Primary sport</Label>
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger
                id="child-sport"
                aria-invalid={!!errors.sport}
                aria-describedby={errors.sport ? 'child-sport-error' : undefined}
              >
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                {sportTaxonomy.map((s) => (
                  <SelectItem key={s.slug} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sport && (
              <p id="child-sport-error" role="alert" className="text-destructive text-xs">
                {errors.sport}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="child-skill">Skill level (optional)</Label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger id="child-skill">
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save changes' : 'Add child'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
