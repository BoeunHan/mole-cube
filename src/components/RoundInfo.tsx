import { diffTime, getPlayTimeLabel } from "@/lib/utils";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useState } from "react";

export const RoundInfo = () => {
  const { gameRoomState } = useGameSocket();

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!gameRoomState) return null;

  const { openedAt, actionHistories, cubeStatus } = gameRoomState.roundState;
  const playTime = diffTime(new Date(openedAt), currentTime);
  const isBreak = gameRoomState?.status === "break";

  return (
    <div className="flex w-full max-w-80 flex-col items-center gap-y-2">
      <div className="text-xl @md:text-3xl">{`제 ${gameRoomState?.currentRoundNumber}번째 게임`}</div>
      {!isBreak && (
        <div className="font-neodgm flex w-full justify-around text-sm">
          <span>
            {playTime
              ? getPlayTimeLabel(
                  playTime.days,
                  playTime.hours,
                  playTime.minutes,
                  playTime.seconds,
                )
              : ""}
          </span>
          <span>{`${actionHistories.length}회/${cubeStatus.shuffleCnt}회`}</span>
        </div>
      )}
    </div>
  );
};
