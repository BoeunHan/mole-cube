"use client";

import { CompletePanel } from "@/components/CompletePanel";
import { ControlPanel } from "@/components/ControlPanel";
import { CubeView } from "@/components/CubeView";
import { CurrentPlayers } from "@/components/CurrentPlayers";
import { NicknameDialog } from "@/components/NicknameDialog";
import { useGameSocket } from "@/providers/GameSocketContext";

export default function Home() {
  const { gameRoomState, isSolved } = useGameSocket();

  return (
    <div className="font-bitbeat text-primary relative h-full w-full bg-[#D8D2CC]">
      <NicknameDialog />
      <div className={`${isSolved ? "invisible" : "block"}`}>
        <CubeView />
      </div>
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-between px-4 py-10">
        <div className="flex w-full flex-col items-center">
          {gameRoomState && (
            <div className="text-xl">{`제 ${gameRoomState.currentRoundNumber}번째 게임`}</div>
          )}
          <CurrentPlayers />
          {isSolved && <CompletePanel />}
        </div>
        {!isSolved && <ControlPanel />}
      </div>
    </div>
  );
}
