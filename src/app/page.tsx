"use client";

import { ChattingButton } from "@/components/ChattingButton";
import { ConfettiCanvas } from "@/components/ConfettiCanvas";
import { CubeView } from "@/components/CubeView";
import { CurrentPlayers } from "@/components/CurrentPlayers";
import { EmotionButton } from "@/components/EmotionButton";
import { NicknameDialog } from "@/components/NicknameDialog";
import { RotationButtonList } from "@/components/RotationButton";
import { Timer } from "@/components/Timer";
import { USERID_KEY } from "@/constants";
import { localStorageUtil } from "@/lib/utils";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useMemo } from "react";

const TURN_TIME = 10;
const ROUND_INTERVAL = 30;

export default function Home() {
  const { gameRoundState, isSolved } = useGameSocket();

  const userId = localStorageUtil.getValue(USERID_KEY) as string;
  const currentPlayerId = gameRoundState?.currentPlayerId;

  const isCurrentPlayer = useMemo(
    () => userId === currentPlayerId,
    [userId, currentPlayerId],
  );

  return (
    <div className="font-bitbeat text-primary relative h-full w-full">
      <NicknameDialog />
      <CubeView />
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-between px-4 py-10">
        <div className="flex w-full flex-col items-center gap-4">
          {gameRoundState && (
            <div className="text-xl">{`제 ${gameRoundState.currentRound}번째 게임`}</div>
          )}
          <CurrentPlayers />
        </div>
        {isSolved && <ConfettiCanvas />}
        <div className="pointer-events-auto flex w-full items-center justify-center gap-x-4 p-2">
          <div className="flex shrink-0 flex-col">
            <ChattingButton />
            <EmotionButton />
          </div>
          <div className="w-full max-w-60">
            {gameRoundState &&
              (gameRoundState.isOpen ? (
                isCurrentPlayer ? (
                  <div className="flex flex-col gap-y-3">
                    <RotationButtonList />
                    <Timer
                      totalMs={TURN_TIME * 1000}
                      endTime={gameRoundState.timerEndTime}
                    />
                  </div>
                ) : (
                  <div>기다리는 중...</div>
                )
              ) : (
                <>
                  <div>다음 게임 대기중</div>
                  <Timer
                    totalMs={ROUND_INTERVAL * 1000}
                    endTime={gameRoundState.timerEndTime}
                  />
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
