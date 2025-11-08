"use client";

import { ConfettiCanvas } from "@/components/ConfettiCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { CubeView } from "@/components/CubeView";
import { CurrentPlayers } from "@/components/CurrentPlayers";
import { NicknameDialog } from "@/components/NicknameDialog";
import { useGameSocket } from "@/providers/GameSocketContext";

export default function Home() {
  const { gameRoomState, isSolved } = useGameSocket();

  return (
    <div className="font-bitbeat text-primary relative h-full w-full">
      <NicknameDialog />
      <CubeView />
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-between px-4 py-10">
        <div className="flex w-full flex-col items-center gap-4">
          {gameRoomState && (
            <div className="text-xl">{`제 ${gameRoomState.currentRoundNumber}번째 게임`}</div>
          )}
          <CurrentPlayers />
        </div>
        {isSolved && <ConfettiCanvas />}
        <ControlPanel />
      </div>
    </div>
  );
}
