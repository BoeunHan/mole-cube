import { useEffect, useRef, useState } from "react";

interface SpriteProps {
  src: string;
  frames: number;
  fps: number;
  size: number;
  handleAnimationEnd: () => void;
}

export function Sprite({
  src,
  frames,
  fps,
  size,
  handleAnimationEnd,
}: SpriteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  const [frame, setFrame] = useState(0);
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCols(Math.floor(img.naturalWidth / size));
    };
  }, [src, size]);

  useEffect(() => {
    if (frame === frames) handleAnimationEnd();
  }, [frame, frames]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (prev + 1 < frames) {
        } else {
          clearInterval(interval);
        }
        return prev + 1;
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setParentWidth(rect.width);
        setParentHeight(rect.height);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const row = Math.floor(frame / cols);
  const col = frame % cols;

  const scaleX = parentWidth / size;
  const scaleY = parentHeight / size;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${src})`,
          backgroundPosition: `-${col * size}px -${row * size}px`,
          backgroundRepeat: "no-repeat",
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      ></div>
    </div>
  );
}
