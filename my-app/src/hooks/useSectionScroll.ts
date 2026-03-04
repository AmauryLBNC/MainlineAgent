"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SECTION_EVENT, type SectionId } from "@/lib/section-navigation";

export type SectionScrollDirection = "down" | "up";
export type SectionAnimationStage = "idle" | "pre" | "run";

export type UseSectionScrollOptions = {
  sectionIds: readonly SectionId[];
  quizIndex: number;
  rotateIntervalMs?: number;
  transitionDurationMs?: number;
  wheelThreshold?: number;
  touchThreshold?: number;
};

export type UseSectionScrollResult = {
  active: number;
  incoming: number | null;
  direction: SectionScrollDirection;
  animStage: SectionAnimationStage;
  locked: boolean;
  rotationPaused: boolean;
  transition: string;
  getTransform: (index: number) => string;
  startTransition: (
    direction: SectionScrollDirection,
    targetIndex: number
  ) => void;
  handleQuizInteract: () => void;
  handleQuizExit: () => void;
  handleQuizComplete: () => void;
};

const DEFAULT_ROTATE_INTERVAL_MS = 10000;
const DEFAULT_TRANSITION_DURATION_MS = 950;
const DEFAULT_WHEEL_THRESHOLD = 120;
const DEFAULT_TOUCH_THRESHOLD = 90;

export function useSectionScroll({
  sectionIds,
  quizIndex,
  rotateIntervalMs = DEFAULT_ROTATE_INTERVAL_MS,
  transitionDurationMs = DEFAULT_TRANSITION_DURATION_MS,
  wheelThreshold = DEFAULT_WHEEL_THRESHOLD,
  touchThreshold = DEFAULT_TOUCH_THRESHOLD,
}: UseSectionScrollOptions): UseSectionScrollResult {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [direction, setDirection] = useState<SectionScrollDirection>("down");
  const [animStage, setAnimStage] = useState<SectionAnimationStage>("idle");
  const [locked, setLocked] = useState(false);
  const [rotationPaused, setRotationPaused] = useState(false);

  const pausedByQuizRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchAccumRef = useRef(0);
  const lastActivityRef = useRef(0);
  const idleTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeRef = useRef(active);
  const lockedRef = useRef(locked);
  const rotationPausedRef = useRef(rotationPaused);

  const totalSections = sectionIds.length;
  const safeQuizIndex =
    quizIndex >= 0 && quizIndex < totalSections ? quizIndex : -1;

  const sectionIndexById = useMemo(() => {
    return sectionIds.reduce<Record<SectionId, number>>((acc, sectionId, index) => {
      acc[sectionId] = index;
      return acc;
    }, {} as Record<SectionId, number>);
  }, [sectionIds]);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const getWrappedIndex = useCallback(
    (index: number) => {
      if (totalSections === 0) {
        return 0;
      }

      return (index + totalSections) % totalSections;
    },
    [totalSections]
  );

  /**
   * The transition runs in two phases so the incoming panel can be positioned
   * before the animated move starts, which avoids a visual jump on mount.
   */
  const startTransition = useCallback(
    (nextDirection: SectionScrollDirection, targetIndex: number) => {
      if (totalSections <= 1) {
        return;
      }

      const normalizedTargetIndex = getWrappedIndex(targetIndex);

      if (
        lockedRef.current ||
        normalizedTargetIndex === activeRef.current
      ) {
        return;
      }

      if (
        activeRef.current === safeQuizIndex &&
        normalizedTargetIndex !== safeQuizIndex &&
        pausedByQuizRef.current
      ) {
        pausedByQuizRef.current = false;
        rotationPausedRef.current = false;
        setRotationPaused(false);
      }

      clearTransitionTimer();
      lockedRef.current = true;
      setLocked(true);
      setDirection(nextDirection);
      setIncoming(normalizedTargetIndex);
      setAnimStage("pre");

      animationFrameRef.current = window.requestAnimationFrame(() => {
        setAnimStage("run");

        transitionTimerRef.current = window.setTimeout(() => {
          activeRef.current = normalizedTargetIndex;
          setActive(normalizedTargetIndex);
          setIncoming(null);
          setAnimStage("idle");
          lockedRef.current = false;
          setLocked(false);
          transitionTimerRef.current = null;
        }, transitionDurationMs);
      });
    },
    [
      clearTransitionTimer,
      getWrappedIndex,
      safeQuizIndex,
      totalSections,
      transitionDurationMs,
    ]
  );

  useEffect(() => {
    activeRef.current = active;
    lockedRef.current = locked;
    rotationPausedRef.current = rotationPaused;
  }, [active, locked, rotationPaused]);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  /**
   * Auto-rotation is always scheduled from the last detected activity so users
   * never lose context because of an old timer that kept running in the background.
   */
  const scheduleAutoRotate = useCallback(() => {
    clearIdleTimer();

    if (rotationPausedRef.current || totalSections <= 1) {
      return;
    }

    const tick = () => {
      if (rotationPausedRef.current) {
        idleTimerRef.current = null;
        return;
      }

      const now = Date.now();
      if (
        !lockedRef.current &&
        now - lastActivityRef.current >= rotateIntervalMs
      ) {
        lastActivityRef.current = now;
        startTransition("down", activeRef.current + 1);
      }

      idleTimerRef.current = window.setTimeout(tick, rotateIntervalMs);
    };

    const elapsed = Date.now() - lastActivityRef.current;
    const remaining = Math.max(0, rotateIntervalMs - elapsed);
    idleTimerRef.current = window.setTimeout(tick, remaining);
  }, [clearIdleTimer, rotateIntervalMs, startTransition, totalSections]);

  /**
   * Pointer, wheel and touch activity all reset the idle clock so the carousel
   * behaves like a guided narrative, not like a slideshow fighting the user.
   */
  const registerActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    scheduleAutoRotate();
  }, [scheduleAutoRotate]);

  /**
   * Entering the quiz pauses auto-rotation because interaction density is high
   * and moving the page while answering would be disruptive.
   */
  const handleQuizInteract = useCallback(() => {
    if (rotationPausedRef.current) {
      return;
    }

    rotationPausedRef.current = true;
    pausedByQuizRef.current = true;
    registerActivity();
    setRotationPaused(true);
  }, [registerActivity]);

  const handleQuizExit = useCallback(() => {
    if (safeQuizIndex === -1) {
      return;
    }

    rotationPausedRef.current = false;
    lastActivityRef.current = Date.now();
    pausedByQuizRef.current = false;
    setRotationPaused(false);
    startTransition("down", safeQuizIndex + 1);
    registerActivity();
  }, [registerActivity, safeQuizIndex, startTransition]);

  const handleQuizComplete = useCallback(() => {
    if (!rotationPausedRef.current) {
      return;
    }

    rotationPausedRef.current = false;
    lastActivityRef.current = Date.now();
    pausedByQuizRef.current = false;
    setRotationPaused(false);
    registerActivity();
  }, [registerActivity]);

  useEffect(() => {
    const handleSectionChange = (event: Event) => {
      const { detail } = event as CustomEvent<SectionId>;
      const targetIndex = sectionIndexById[detail];

      if (targetIndex === undefined) {
        return;
      }

      if (lockedRef.current || targetIndex === activeRef.current) {
        return;
      }

      registerActivity();
      startTransition(targetIndex > activeRef.current ? "down" : "up", targetIndex);
    };

    window.addEventListener(SECTION_EVENT, handleSectionChange as EventListener);

    return () => {
      window.removeEventListener(
        SECTION_EVENT,
        handleSectionChange as EventListener
      );
    };
  }, [registerActivity, sectionIndexById, startTransition]);

  useEffect(() => {
    scheduleAutoRotate();

    const handlePointerMove = () => {
      registerActivity();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      clearIdleTimer();
    };
  }, [clearIdleTimer, registerActivity, scheduleAutoRotate]);

  useEffect(() => {
    /**
     * Trackpads emit many small wheel deltas; waiting for 120 prevents accidental
     * section changes while keeping a deliberate flick responsive.
     */
    const handleWheel = (event: WheelEvent) => {
      registerActivity();

      if (lockedRef.current) {
        wheelAccumRef.current = 0;
        event.preventDefault();
        return;
      }

      wheelAccumRef.current += event.deltaY;

      if (Math.abs(wheelAccumRef.current) < wheelThreshold) {
        return;
      }

      const nextDirection: SectionScrollDirection =
        wheelAccumRef.current > 0 ? "down" : "up";
      wheelAccumRef.current = 0;
      startTransition(
        nextDirection,
        nextDirection === "down" ? activeRef.current + 1 : activeRef.current - 1
      );
      event.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [registerActivity, startTransition, wheelThreshold]);

  useEffect(() => {
    /**
     * Mobile swipes need a lower threshold than wheel input because the gesture
     * is shorter, but still high enough to ignore diagonal scrolling noise.
     */
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      touchStartYRef.current = touch?.clientY ?? 0;
      touchStartXRef.current = touch?.clientX ?? 0;
      registerActivity();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (lockedRef.current) {
        touchAccumRef.current = 0;
        return;
      }

      const touch = event.touches[0];
      const currentY = touch?.clientY ?? 0;
      const currentX = touch?.clientX ?? 0;
      const deltaY = touchStartYRef.current - currentY;
      const deltaX = touchStartXRef.current - currentX;

      if (Math.abs(deltaY) < Math.abs(deltaX)) {
        return;
      }

      touchAccumRef.current = deltaY;

      if (Math.abs(touchAccumRef.current) < touchThreshold) {
        return;
      }

      const nextDirection: SectionScrollDirection =
        touchAccumRef.current > 0 ? "down" : "up";
      touchAccumRef.current = 0;
      startTransition(
        nextDirection,
        nextDirection === "down" ? activeRef.current + 1 : activeRef.current - 1
      );
      event.preventDefault();
    };

    const handleTouchEnd = () => {
      touchAccumRef.current = 0;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [registerActivity, startTransition, touchThreshold]);

  useEffect(() => {
    return () => {
      clearIdleTimer();
      clearTransitionTimer();
    };
  }, [clearIdleTimer, clearTransitionTimer]);

  const getTransform = useCallback(
    (index: number) => {
      if (animStage === "idle") {
        return index === active ? "translateY(0%)" : "translateY(100%)";
      }

      if (animStage === "pre") {
        if (index === active) {
          return "translateY(0%)";
        }

        if (index === incoming) {
          return direction === "down"
            ? "translateY(100%)"
            : "translateY(-100%)";
        }

        return "translateY(100%)";
      }

      if (index === active) {
        return direction === "down"
          ? "translateY(-100%)"
          : "translateY(100%)";
      }

      if (index === incoming) {
        return "translateY(0%)";
      }

      return "translateY(100%)";
    },
    [active, animStage, direction, incoming]
  );

  const transition =
    animStage === "run"
      ? `transform ${transitionDurationMs}ms cubic-bezier(0.22, 0.7, 0.26, 1)`
      : "none";

  return {
    active,
    incoming,
    direction,
    animStage,
    locked,
    rotationPaused,
    transition,
    getTransform,
    startTransition,
    handleQuizInteract,
    handleQuizExit,
    handleQuizComplete,
  };
}
