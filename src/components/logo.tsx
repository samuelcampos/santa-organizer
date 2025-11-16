import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-primary', className)}>
      <Gift className="h-8 w-8" />
      <h1 className="text-3xl font-bold font-headline text-primary">
        Amigo Secreto Organizer
      </h1>
    </div>
  );
}
