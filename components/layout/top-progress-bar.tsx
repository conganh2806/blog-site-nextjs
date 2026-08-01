"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const MINIMUM_VISIBLE_TIME = 220;
const COMPLETE_HIDE_DELAY = 260;

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [isActive, setIsActive] = useState(true);
  const [progress, setProgress] = useState(12);
  const activeRef = useRef(true);
  const progressRef = useRef(12);
  const startedAtRef = useRef(0);
  const hasMountedRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const trickleTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    if (trickleTimerRef.current !== null) window.clearInterval(trickleTimerRef.current);
    hideTimerRef.current = null;
    completionTimerRef.current = null;
    trickleTimerRef.current = null;
  }, []);

  const begin = useCallback((initialProgress = 12) => {
    clearTimers();
    activeRef.current = true;
    progressRef.current = initialProgress;
    startedAtRef.current = Date.now();
    setIsActive(true);
    setProgress(initialProgress);

    trickleTimerRef.current = window.setInterval(() => {
      const nextProgress = Math.min(92, progressRef.current + Math.max(0.7, (94 - progressRef.current) * 0.08));
      progressRef.current = nextProgress;
      setProgress(nextProgress);
    }, 180);
  }, [clearTimers]);

  const complete = useCallback(() => {
    if (!activeRef.current) begin(72);
    if (trickleTimerRef.current !== null) window.clearInterval(trickleTimerRef.current);
    if (startedAtRef.current === 0) startedAtRef.current = Date.now();

    const elapsed = Date.now() - startedAtRef.current;
    const remainingDelay = Math.max(0, MINIMUM_VISIBLE_TIME - elapsed);

    completionTimerRef.current = window.setTimeout(() => {
      progressRef.current = 100;
      setProgress(100);

      hideTimerRef.current = window.setTimeout(() => {
        activeRef.current = false;
        setIsActive(false);
        setProgress(0);
      }, COMPLETE_HIDE_DELAY);
    }, remainingDelay);
  }, [begin]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const changesRoute = destination.origin === current.origin
        && `${destination.pathname}${destination.search}` !== `${current.pathname}${current.search}`;

      if (changesRoute) begin();
    };

    document.addEventListener("click", handleDocumentClick, true);

    if (document.readyState === "complete") {
      window.setTimeout(complete, 0);
    } else {
      window.addEventListener("load", complete, { once: true });
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("load", complete);
      clearTimers();
    };
  }, [begin, clearTimers, complete]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const completionTimer = window.setTimeout(complete, 0);
    return () => window.clearTimeout(completionTimer);
  }, [complete, routeKey]);

  return (
    <div
      className={`pace top-progress ${isActive ? "pace-active" : "pace-inactive"}`}
      role="progressbar"
      aria-label="Page loading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="pace-progress"
        style={{ transform: `translate3d(${progress}%, 0, 0)` }}
      />
    </div>
  );
}
