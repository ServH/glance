import { motion } from 'framer-motion';

interface WidgetSkeletonProps {
  rows?: number;
}

/**
 * Loading skeleton for widgets
 * Premium shimmer effect with Framer Motion
 */
export function WidgetSkeleton({ rows = 5 }: WidgetSkeletonProps) {
  return (
    <div className="widget-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <motion.div
            className="skeleton-line skeleton-sender"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
          <motion.div
            className="skeleton-line skeleton-subject"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1 + 0.2,
            }}
          />
          <motion.div
            className="skeleton-line skeleton-snippet"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1 + 0.4,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
