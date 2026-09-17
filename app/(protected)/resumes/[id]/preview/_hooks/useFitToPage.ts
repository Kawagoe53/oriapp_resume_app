"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export function useFitToPage(content: unknown) {
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState({ content, ready: false, scale: 1 });

  const fit = useCallback(() => {
    const page = pageRef.current;
    const element = contentRef.current;
    if (!page || !element) return;

    // Measure the unscaled document; transforms must not affect the next fit.
    element.style.transform = "none";
    element.style.width = "100%";
    element.removeAttribute("data-compact");
    const available = page.clientHeight - 2; // Allow for print rounding.
    if (element.scrollHeight > available) element.dataset.compact = "true";
    let scale = 1;
    if (element.scrollHeight > available) {
      let low = Math.min(1, available / Math.max(1, element.scrollHeight));
      let high = 1;
      // Widen before scaling so the final document still uses the full page
      // width. Reflowing text avoids an unnecessarily narrow, tiny column.
      for (let attempt = 0; attempt < 20; attempt++) {
        const candidate = (low + high) / 2;
        element.style.width = `${100 / candidate}%`;
        if (element.scrollHeight * candidate <= available) low = candidate;
        else high = candidate;
      }
      scale = low;
    }
    element.style.width = `${100 / scale}%`;
    element.style.transform = `scale(${scale})`;
    setResult(previous => previous.content === content && previous.ready && previous.scale === scale
      ? previous : { content, ready: true, scale });
  }, [content]);

  useLayoutEffect(() => {
    let cancelled = false;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (!cancelled) fit(); });
    };
    const observer = new ResizeObserver(schedule);
    // Font metrics must be final before enabling the print button.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      fit();
      if (pageRef.current) observer.observe(pageRef.current);
      if (contentRef.current) observer.observe(contentRef.current);
    });
    document.fonts.addEventListener("loadingdone", schedule);
    window.addEventListener("beforeprint", fit);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
      window.removeEventListener("beforeprint", fit);
    };
  }, [fit]);

  return { pageRef, contentRef, fit, ready: result.content === content && result.ready, scale: result.scale };
}
