'use client';

import { useEffect, useRef, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';

const STORAGE_KEY = 'sdb-onboarding-done';
const SAMPLE_INPUT = '{"name": "SmartDevBox"}';
const SAMPLE_INPUT_RIGHT = '{"name": "SmartDevBox", "new": true}';

const STEPS = [
  {
    id: 'input',
    title: 'Step 1 of 6 — Paste input',
    body: 'We\'ve pre-filled the input area with a JSON snippet. This is where you paste anything you want to transform.',
    cta: 'Got it →',
    targetAttr: 'data-onboard-input',
    tooltipSide: 'bottom' as const,
  },
  {
    id: 'tool',
    title: 'Step 2 of 6 — Run a tool',
    body: 'SmartDevBox detected your input as JSON. Click the green ▶ JSON Format button to instantly format it.',
    cta: null,
    targetAttr: 'data-onboard-detection',
    tooltipSide: 'bottom' as const,
  },
  {
    id: 'output',
    title: 'Step 3 of 6 — See the output',
    body: 'Your formatted result appears here. You can copy, save, or split-compare the output.',
    cta: 'Try Split View →',
    targetAttr: 'data-onboard-output',
    tooltipSide: 'top' as const,
  },
  {
    id: 'split',
    title: 'Step 4 of 6 — Open Split View',
    body: 'Click the Split view button to open two side-by-side editors. We\'ve pre-filled the right pane with a slightly different JSON so you can compare them.',
    cta: null,
    targetAttr: 'data-onboard-split',
    tooltipSide: 'bottom' as const,
  },
  {
    id: 'split-run',
    title: 'Step 5 of 6 — Format the right pane',
    body: 'The right pane has a new JSON snippet. Click the JSON Format button in the right pane to format it.',
    cta: null,
    targetAttr: 'data-onboard-split-run',
    tooltipSide: 'bottom' as const,
  },
  {
    id: 'split-diff',
    title: 'Step 6 of 6 — Compare Diff',
    body: 'Click Compare Diff to highlight every difference between the two panes side by side.',
    cta: null,
    targetAttr: 'data-onboard-split-diff',
    tooltipSide: 'top' as const,
  },
];

// Steps whose CTA is hidden — the user must click the real UI element to advance.
const ACTION_GATED_STEPS = new Set([1, 3, 4, 5]); // 0-indexed: step 2, 4, 5, 6

interface Rect { top: number; left: number; width: number; height: number }

const PAD = 10;

function getRect(attr: string): Rect | null {
  const el = document.querySelector(`[${attr}]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

export function OnboardingGuide() {
  const { setInput, setDetectionResults, setOnboardingSplitInput, setOnboardingStep, onboardingStep } = useDevboxStore();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const raf = useRef<number>(0);

  // Show only on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => {
        setInput(SAMPLE_INPUT);
        setDetectionResults(runDetection(SAMPLE_INPUT));
        setOnboardingStep(0);
        setVisible(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [setInput, setDetectionResults, setOnboardingSplitInput, setOnboardingStep]);

  // When an action-gated step fires advanceOnboardingStep() from another component,
  // pick it up here and advance the local step counter.
  useEffect(() => {
    if (!visible) return;
    if (ACTION_GATED_STEPS.has(step) && onboardingStep === step + 1) {
      advanceStep(step + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingStep]);

  // Track target rect on every frame so spotlight follows scroll/resize
  useEffect(() => {
    if (!visible) return;
    const update = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      setRect(getRect(STEPS[step].targetAttr));
      raf.current = requestAnimationFrame(update);
    };
    raf.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf.current);
  }, [visible, step]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOnboardingSplitInput(null);
    setOnboardingStep(-1);
    setVisible(false);
  };

  const advanceStep = (next: number) => {
    // Step 4 (index 3) — seed the right pane before the split view opens
    if (next === 3) {
      setOnboardingSplitInput(SAMPLE_INPUT_RIGHT);
    }
    if (next >= STEPS.length) {
      dismiss();
    } else {
      setStep(next);
      setOnboardingStep(next);
    }
  };

  const handleCta = () => advanceStep(step + 1);

  if (!visible) return null;

  const s = STEPS[step];

  // Build clip path that cuts a hole around the target element
  let clipStyle: React.CSSProperties = {};
  if (rect) {
    const { top, left, width, height } = rect;
    const r = top, b = top + height, l = left, ri = left + width;
    // clip-path polygon with a rectangular hole
    clipStyle = {
      clipPath: `polygon(
        0% 0%, 100% 0%, 100% 100%, 0% 100%,
        0% ${r}px,
        ${l}px ${r}px,
        ${l}px ${b}px,
        ${ri}px ${b}px,
        ${ri}px ${r}px,
        0% ${r}px
      )`,
    };
  }

  // Tooltip positioning
  const tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 10001, maxWidth: 320 };
  let tooltipPos: Partial<React.CSSProperties> = {};
  if (rect) {
    const { top, left, width, height } = rect;
    const side = s.tooltipSide;
    if (side === 'bottom') {
      tooltipPos = { top: top + height + 14, left: left + width / 2, transform: 'translateX(-50%)' };
    } else if (side === 'top') {
      tooltipPos = { bottom: vp.h - top + 14, left: left + width / 2, transform: 'translateX(-50%)' };
    } else if (side === 'right') {
      tooltipPos = { top: top + height / 2, left: left + width + 14, transform: 'translateY(-50%)' };
    } else {
      tooltipPos = { top: top + height / 2, right: vp.w - left + 14, transform: 'translateY(-50%)' };
    }
  } else {
    tooltipPos = { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  }
  const tooltip = { ...tooltipStyle, ...tooltipPos };

  // Spotlight border highlight
  const spotlightStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: 8,
        border: '2px solid var(--green)',
        boxShadow: '0 0 18px var(--primary-glow), inset 0 0 12px rgba(74,222,128,0.05)',
        pointerEvents: 'none',
        zIndex: 10000,
        transition: 'top .25s, left .25s, width .25s, height .25s',
      }
    : {};

  return (
    <>
      {/* Backdrop with hole */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.72)',
          ...clipStyle,
          transition: 'clip-path .25s',
        }}
      />

      {/* Spotlight ring */}
      {rect && <div style={spotlightStyle} />}

      {/* Tooltip card */}
      <div style={tooltip}>
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--green-dim)',
            borderRadius: 8,
            padding: '14px 16px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
            fontFamily: 'var(--font)',
          }}
        >
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === step ? 'var(--green)' : 'var(--border2)',
                  transition: 'width .2s, background .2s',
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--green-dim)', marginBottom: 4, fontWeight: 700, letterSpacing: '0.06em' }}>
            {s.title.toUpperCase()}
          </div>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text2)', lineHeight: 1.55, marginBottom: 14 }}>
            {s.body}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={dismiss}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text4)',
                fontSize: 'var(--fs-xs)',
                fontFamily: 'var(--font)',
                cursor: 'pointer',
                padding: '2px 0',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text2)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text4)')}
            >
              Skip guide
            </button>
            {s.cta ? (
              <button
                onClick={handleCta}
                style={{
                  background: 'var(--green-bg)',
                  border: '1px solid var(--green-dim)',
                  color: 'var(--green)',
                  fontSize: 'var(--fs-xs)',
                  fontFamily: 'var(--font)',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--green)'; el.style.boxShadow = '0 0 8px var(--primary-glow)'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--green-dim)'; el.style.boxShadow = 'none'; }}
              >
                {s.cta}
              </button>
            ) : (
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text4)', fontStyle: 'italic' }}>
                waiting for your click…
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
