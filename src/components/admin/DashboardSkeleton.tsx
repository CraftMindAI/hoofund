/** Grey placeholder shown while an admin page checks the session and loads data. */
export function DashboardSkeleton({ label, cards = true }: { label: string; cards?: boolean }) {
  return (
    <div role="status" aria-label={label} className="animate-pulse">
      {cards && (
        <>
          <div className="h-4 w-40 rounded bg-sand" />
          <div className="mt-3 h-9 w-72 max-w-full rounded bg-sand" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-3xl bg-white ring-1 ring-sand" />
            ))}
          </div>
        </>
      )}
      <div className={`${cards ? "mt-8" : ""} h-80 rounded-3xl bg-white ring-1 ring-sand`} />
    </div>
  );
}
