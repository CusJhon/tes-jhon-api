'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]', className)} {...props} />
  )
}

export function ApiCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  )
}