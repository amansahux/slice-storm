import React, { useRef, useEffect, useCallback } from "react";

interface GameCanvasProps {
  onAddBladePoint: (x: number, y: number) => void;
  onBladeStart: (x: number, y: number) => void;
  onBladeEnd: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onAddBladePoint,
  onBladeStart,
  onBladeEnd,
  canvasRef,
}) => {
  const isPointerDownRef = useRef(false);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    onBladeStart(e.clientX, e.clientY);
    // Immediately add a nearby point so a single click creates a blade segment
    onAddBladePoint(e.clientX + 8, e.clientY + 8);
  }, [onBladeStart, onAddBladePoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    onAddBladePoint(e.clientX, e.clientY);
  }, [onAddBladePoint]);

  const handleMouseUp = useCallback(() => {
    isPointerDownRef.current = false;
    onBladeEnd();
  }, [onBladeEnd]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    const t = e.touches[0];
    if (t) {
      onBladeStart(t.clientX, t.clientY);
      // Immediately add a nearby point so a single tap creates a blade segment
      onAddBladePoint(t.clientX + 8, t.clientY + 8);
    }
  }, [onBladeStart, onAddBladePoint]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    const t = e.touches[0];
    if (t) onAddBladePoint(t.clientX, t.clientY);
  }, [onAddBladePoint]);

  const handleTouchEnd = useCallback(() => {
    isPointerDownRef.current = false;
    onBladeEnd();
  }, [onBladeEnd]);

  // Global window mouseup in case cursor leaves canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPointerDownRef.current) {
        isPointerDownRef.current = false;
        onBladeEnd();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [onBladeEnd]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none select-none"
    />
  );
};
