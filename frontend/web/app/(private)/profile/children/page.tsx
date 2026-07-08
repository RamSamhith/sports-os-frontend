'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChildCard } from '@/components/profile/child-card';
import { ChildFormDialog } from '@/components/profile/child-form-dialog';
import { ChildRemoveDialog } from '@/components/profile/child-remove-dialog';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { useChildren, type Child } from '@/lib/hooks/use-children';
import { useAuth } from '@/lib/hooks/use-auth';
import { useOnboarding } from '@/lib/hooks/use-onboarding';
import { Plus, UserRoundPlus } from 'lucide-react';

export default function ChildrenPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const { children, activeChildId, addChild, updateChild, removeChild } = useChildren();
  const { parentData } = useOnboarding();
  const [formOpen, setFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [removingChild, setRemovingChild] = useState<Child | null>(null);

  // Guard: redirect non-parent roles to personal page (no flash)
  const isUnauthorized = role && role !== 'parent';
  useEffect(() => {
    if (!isLoading && isUnauthorized) {
      router.replace('/profile/personal');
    }
  }, [isLoading, isUnauthorized, router]);

  if (isLoading || isUnauthorized) {
    return null;
  }

  function handleAdd(data: { name: string; age: number; sportInterests: string[]; skillLevel?: string }) {
    addChild(data);
  }

  function handleEdit(data: { name: string; age: number; sportInterests: string[]; skillLevel?: string }) {
    if (editingChild) {
      updateChild(editingChild.id, data);
      setEditingChild(null);
    }
  }

  function handleRemove() {
    if (removingChild) {
      removeChild(removingChild.id);
      setRemovingChild(null);
    }
  }

  const childDefaults = parentData
    ? {
        name: parentData.childName,
        age: parentData.childAge,
        sportInterests: parentData.sportInterests.length > 0 ? [parentData.sportInterests[0]] : [],
        skillLevel: parentData.skillLevel,
      }
    : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Children</h1>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Add child
        </Button>
      </div>

      {children.length === 0 ? (
        <EmptyState
          icon={<UserRoundPlus className="text-muted-foreground h-6 w-6" />}
          title="No children added yet"
          description="Add your child's profile to track their sports journey and find the right academies."
          action={
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" /> Add your first child
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              name={child.name}
              age={child.age}
              sportInterests={child.sportInterests}
              skillLevel={child.skillLevel}
              isActive={child.id === activeChildId}
              onEdit={() => {
                setEditingChild(child);
                setFormOpen(true);
              }}
              onRemove={() => setRemovingChild(child)}
            />
          ))}
        </div>
      )}

      <ChildFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingChild(null);
        }}
        onSubmit={editingChild ? handleEdit : handleAdd}
        child={editingChild}
        defaultData={!editingChild ? childDefaults : undefined}
      />

      <ChildRemoveDialog
        open={!!removingChild}
        onOpenChange={(open) => {
          if (!open) setRemovingChild(null);
        }}
        onConfirm={handleRemove}
        childName={removingChild?.name ?? ''}
      />
    </div>
  );
}
