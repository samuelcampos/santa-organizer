"use client";

import { Suspense } from 'react';
import { HomePageContent } from '@/components/amigo-secreto/home-page-content';
import { Skeleton } from '@/components/ui/skeleton';

function HomePageLoading() {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePageContent />
    </Suspense>
  );
}
