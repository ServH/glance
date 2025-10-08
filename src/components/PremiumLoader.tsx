import { motion } from 'framer-motion';
import '../styles/premium-loader.css';

interface PremiumLoaderProps {
  message?: string;
}

/**
 * Premium loading state with orbital animation
 * Beautiful spinner for loading states
 */
export function PremiumLoader({ message = 'Loading...' }: PremiumLoaderProps) {
  return (
    <div className="premium-loader-container">
      <div className="premium-loader">
        {/* Outer ring */}
        <motion.div
          className="loader-ring loader-ring-outer"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Middle ring */}
        <motion.div
          className="loader-ring loader-ring-middle"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="loader-ring loader-ring-inner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Center dot */}
        <motion.div
          className="loader-dot"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Loading message */}
      <motion.p
        className="loader-message"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>
    </div>
  );
}
