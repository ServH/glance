interface WidgetSkeletonProps {
  rows?: number;
}

/**
 * Loading skeleton for widgets
 * Shows animated placeholder rows
 */
export function WidgetSkeleton({ rows = 5 }: WidgetSkeletonProps) {
  return (
    <div className="widget-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-line skeleton-sender" />
          <div className="skeleton-line skeleton-subject" />
          <div className="skeleton-line skeleton-snippet" />
        </div>
      ))}
    </div>
  );
}
