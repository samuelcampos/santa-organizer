"use client";

import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/hooks/use-i18n';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <Link href="/" className={cn('flex items-center gap-3 text-primary', className)}>
      <Gift className="h-8 w-8" />
      <div className="text-3xl font-bold font-headline text-primary">
        {t('app_name')}
      </div>
    </Link>
  );
}
