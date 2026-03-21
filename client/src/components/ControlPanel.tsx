"use client";

import { RotationButtonList } from "@/components/RotationButton";
import { Timer } from "@/components/Timer";
import { getTurnsLeft } from "@/lib/utils";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useMemo } from "react";
import { EmotionButton } from "./EmotionButton";
import { RotationHistory } from "./RotationHistory";

export const ControlPanel = () => {
  const { userId, gameRoomState } = useGameSocket();

  const currentPlayerId = gameRoomState?.currentPlayerId;

  const isCurrentPlayer = useMemo(
    () => userId && currentPlayerId && userId === currentPlayerId,
    [userId, currentPlayerId],
  );

  if (!gameRoomState) return null;

  return (
    <div className="pointer-events-auto flex w-full max-w-80 flex-col justify-center gap-y-2 p-2 @md:max-w-96">
      <RotationHistory />
      <div className="flex h-30 w-full gap-1">
        <EmotionButton />
        <div className="h-full w-full @md:max-w-80">
          {isCurrentPlayer ? (
            <div className="flex flex-col gap-y-3">
              <RotationButtonList />
              <Timer
                totalMs={gameRoomState.timerTotalTime}
                endTime={gameRoomState.timerEndTime}
              />
            </div>
          ) : (
            currentPlayerId && (
              <div className="flex h-full w-full flex-col items-center gap-y-2 @md:text-xl">
                <div className="text-center">
                  {gameRoomState.nicknames[currentPlayerId]} 님을{" "}
                  <span className="whitespace-nowrap">기다리는 중...</span>
                </div>
                <div>
                  내 차례까지{" "}
                  {getTurnsLeft(gameRoomState.players, currentPlayerId, userId)}
                  턴
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
