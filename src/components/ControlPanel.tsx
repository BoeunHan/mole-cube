"use client";

import { ChattingButton } from "@/components/ChattingButton";
import { RotationButtonList } from "@/components/RotationButton";
import { Timer } from "@/components/Timer";
import { getTurnsLeft } from "@/lib/utils";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useMemo } from "react";
import { EmotionButton } from "./EmotionButton";

export const ControlPanel = () => {
  const { userId, gameRoomState } = useGameSocket();

  const currentPlayerId = gameRoomState?.currentPlayerId;

  const isCurrentPlayer = useMemo(
    () => userId && currentPlayerId && userId === currentPlayerId,
    [userId, currentPlayerId],
  );

  if (!gameRoomState) return null;

  return (
    <div className="pointer-events-auto flex h-32 w-full items-center justify-center gap-x-4 p-2">
      <div className="flex shrink-0 flex-col justify-center self-stretch">
        <ChattingButton />
        <EmotionButton />
      </div>
      <div className="h-full w-full max-w-60 md:max-w-80">
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
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 md:text-2xl">
              <div>
                {gameRoomState.currentPlayerNickname} 님을 기다리는 중...
              </div>
              <div>
                내 차례까지{" "}
                {getTurnsLeft(gameRoomState.players, currentPlayerId, userId)}턴
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
