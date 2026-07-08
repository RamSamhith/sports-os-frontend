'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';

export const Drawer = Sheet;
export const DrawerTrigger = SheetTrigger;
export const DrawerContent = SheetContent;
export const DrawerHeader = SheetHeader;
export const DrawerTitle = SheetTitle;
export const DrawerDescription = SheetDescription;
export const DrawerClose = SheetClose;

export interface DrawerPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export function DrawerPanel({ className, ...props }: DrawerPanelProps) {
  return <div className={cn('flex flex-col gap-4 p-4', className)} {...props} />;
}
