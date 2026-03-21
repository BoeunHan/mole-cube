import { useEffect, useRef, useState } from "react";

interface TimerProps {
  timerEndTime: number;
  initialMs: number;
}

export const Timer = ({ timerEndTime, initialMs }: TimerProps) => {
  const [remainingMs, setRemainingMs] = useState(initialMs);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const next = initialMs - elapsed;
      setRemainingMs(next > 0 ? next : 0);

      if (next > 0) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [timerEndTime]);

  const ratio = Math.max(remainingMs / initialMs, 0);

  return (
    <div className="flex w-full items-center gap-x-2 md:text-2xl">
      <span className="font-bitbeat w-14 text-center text-[#CE6464] md:w-20">
        {Math.ceil(remainingMs / 1000)}초
      </span>
      <div className="h-4 w-full overflow-hidden rounded-full bg-[#BFBFBF]">
        <div
          className="h-full rounded-l-full bg-[#CE6464] transition-none"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
};
