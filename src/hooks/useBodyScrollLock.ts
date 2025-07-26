import { useEffect, useRef } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * @param isLocked - Whether to lock the scroll
 */
export function useBodyScrollLock(isLocked: boolean) {
  const originalOverflow = useRef<string>('');
  const lockCount = useRef<number>(0);
  const isInitialized = useRef<boolean>(false);
  const hasLock = useRef<boolean>(false);

  useEffect(() => {
    // Initialize on first mount
    if (!isInitialized.current) {
      originalOverflow.current = document.body.style.overflow || '';
      isInitialized.current = true;
    }

    if (isLocked) {
      // Increment lock count
      lockCount.current += 1;
      hasLock.current = true;
      
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Decrement lock count
      lockCount.current = Math.max(0, lockCount.current - 1);
      
      // Only restore when all locks are released
      if (lockCount.current === 0) {
        hasLock.current = false;
        document.body.style.overflow = originalOverflow.current;
      }
    }

    // Cleanup: ensure scroll is restored when component unmounts
    return () => {
      if (hasLock.current) {
        lockCount.current = Math.max(0, lockCount.current - 1);
        
        if (lockCount.current === 0) {
          hasLock.current = false;
          document.body.style.overflow = originalOverflow.current;
        }
      }
    };
  }, [isLocked]);

  // Additional effect to handle component unmount
  useEffect(() => {
    return () => {
      // Force restore scroll on unmount if this component had a lock
      if (hasLock.current) {
        lockCount.current = Math.max(0, lockCount.current - 1);
        
        if (lockCount.current === 0) {
          hasLock.current = false;
          document.body.style.overflow = originalOverflow.current;
        }
      }
    };
  }, []);

  // Fallback effect to ensure scroll is restored when isLocked becomes false
  useEffect(() => {
    if (!isLocked && hasLock.current) {
      // Use a timeout to ensure this runs after other effects
      const timeoutId = setTimeout(() => {
        if (lockCount.current === 0) {
          hasLock.current = false;
          document.body.style.overflow = originalOverflow.current;
        }
      }, 10); // Slightly longer timeout for better reliability

      return () => clearTimeout(timeoutId);
    }
  }, [isLocked]);

  // Final fallback - ensure scroll is restored after a longer delay
  useEffect(() => {
    if (!isLocked) {
      const finalTimeoutId = setTimeout(() => {
        if (lockCount.current === 0 && document.body.style.overflow === 'hidden') {
          document.body.style.overflow = originalOverflow.current;
        }
      }, 100);

      return () => clearTimeout(finalTimeoutId);
    }
  }, [isLocked]);
}

