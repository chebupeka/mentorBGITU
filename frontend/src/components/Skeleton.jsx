// Базовый «мерцающий» блок-заглушка.
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />
}

// Скелетон карточки ментора (повторяет реальную карточку).
export function MentorCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-3/4" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>
      <Skeleton className="mt-5 h-10 w-full rounded-lg" />
    </div>
  )
}

// Скелетон статистической карточки профиля.
export function StatCardSkeleton() {
  return (
    <div className="card flex items-center gap-4 p-6">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-10" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}
