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
    <div className="font-bitbeat text-primary relative flex h-full w-full items-center bg-[#D8D2CC]">
      <NicknameDialog />
      <div className={`${isSolved ? "invisible" : "block"}`}>
        <CubeView />
      </div>
      <div className="pointer-events-none relative z-10 flex h-full max-h-[760px] w-full flex-col items-center justify-between px-4 py-10 md:max-h-[900px]">
        <div className="flex w-full flex-col items-center gap-y-2 md:gap-y-4">
          {gameRoomState && (
            <div className="text-xl md:text-3xl">{`제 ${gameRoomState.currentRoundNumber}번째 게임`}</div>
          )}
          <CurrentPlayers />
          {isSolved && <CompletePanel />}
        </div>
        {!isSolved && <ControlPanel />}
      </div>
    </div>
  );
}
