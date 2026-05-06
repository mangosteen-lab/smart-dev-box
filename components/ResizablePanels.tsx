'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * A vertical drag handle between two flex children.
 *
 * Usage — replace a static flex column with:
 *   <ResizablePanels
 *     top={<TopPane />}
 *     bottom={<BottomPane />}
 *     initialTopFlex={1.3}
 *     minTopPx={100}
 *     minBottomPx={80}
 *   />
 *
 * The outer container must have a defined height (e.g. flex-1 with a parent
 * that has overflow:hidden) for the pixel calculations to work.
 */
export function ResizablePanels({
  top,
  bottom,
  initialTopFlex = 1,
  minTopPx = 80,
  minBottomPx = 60,
  className,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
  /** Initial size ratio of the top panel relative to 1 for the bottom. */
  initialTopFlex?: number;
  minTopPx?: number;
  minBottomPx?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startTopH = useRef(0);

  // Convert initial flex ratio to a percentage for the top panel
  const initPct = (initialTopFlex / (initialTopFlex + 1)) * 100;
  const [topPct, setTopPct] = useState(initPct);

  const onMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const containerH = containerRef.current.getBoundingClientRect().height;
    const delta = clientY - startY.current;
    const newTopH = Math.min(
      containerH - minBottomPx - 6, // 6px = handle height
      Math.max(minTopPx, startTopH.current + delta)
    );
    setTopPct((newTopH / containerH) * 100);
  }, [minTopPx, minBottomPx]);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const onHandleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startTopH.current = topRef.current?.getBoundingClientRect().height ?? 0;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}
    >
      {/* Top panel */}
      <div
        ref={topRef}
        style={{ height: `${topPct}%`, minHeight: minTopPx, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {top}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={onHandleMouseDown}
        onTouchStart={onHandleMouseDown}
        title="Drag to resize"
        style={{
          height: '10px',
          flexShrink: 0,
          cursor: 'row-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          touchAction: 'none',
        }}
      >
        {/* Visual grip dots */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: 'var(--border2, var(--border))',
            transition: 'background 0.15s, width 0.15s',
          }}
          className="resize-handle-grip"
        />
      </div>

      {/* Bottom panel */}
      <div
        ref={bottomRef}
        style={{ flex: 1, minHeight: minBottomPx, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        {bottom}
      </div>
    </div>
  );
}
