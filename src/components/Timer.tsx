import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useRef, useState } from "react";

const TURN_TIME = 10;

export const Timer = () => {
  const { gameRoundState } = useGameSocket();

  const remainingMs = useCountdown(gameRoundState?.turnEndTime);
  const ratio = Math.max(remainingMs / (TURN_TIME * 1000), 0);

  return (
    <div className="flex items-center gap-x-2">
      <span className="font-bitbeat w-12 text-center text-[#CE6464]">
        {Math.ceil(remainingMs / 1000)}초
      </span>
      <div className="h-4 w-full rounded-full bg-[#BFBFBF]">
        <div
          className="h-full rounded-full bg-[#CE6464] transition-none"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
};

export const useCountdown = (endTime?: number) => {
  const [remainingMs, setRemainingMs] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      if (!endTime) return;

      const r = endTime - Date.now();
      setRemainingMs(r > 0 ? r : 0);
      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [endTime]);

  return remainingMs;
};
