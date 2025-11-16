"use client";

import { CompletePanel } from "@/components/CompletePanel";
import { ControlPanel } from "@/components/ControlPanel";
import { CubeView } from "@/components/CubeView";
import { CurrentCoin } from "@/components/CurrentCoin";
import { CurrentPlayers } from "@/components/CurrentPlayers";
import { MenuIcons } from "@/components/MenuIcons";
import { useAudio } from "@/providers/AudioContext";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { gameRoomState } = useGameSocket();
  const { playGameBGM, playSolvedBGM } = useAudio();

  const isBreak = useMemo(
    () => gameRoomState?.status === "break",
    [gameRoomState?.status],
  );

  useEffect(() => {
    if (gameRoomState?.roundState.status === "solved") {
      playSolvedBGM();
    } else {
      playGameBGM();
    }
  }, [gameRoomState?.roundState.status]);

  return (
    <div className="font-bitbeat text-primary relative flex h-full w-full items-center bg-[#D8D2CC]">
      <div className="scroll-bg absolute inset-0 z-0"></div>
      {gameRoomState && (
        <div className="fixed top-7 z-20 flex w-full items-center justify-between px-7">
          <CurrentCoin />
          <MenuIcons />
        </div>
      )}
      <div className={`${isBreak ? "invisible" : "block"}`}>
        <CubeView />
      </div>
      <div className="pointer-events-none relative z-10 flex h-full max-h-[760px] w-full flex-col items-center justify-between px-4 py-10 md:max-h-[900px]">
        <div className="flex w-full flex-col items-center gap-y-2 md:gap-y-4">
          {gameRoomState && (
            <>
              <div className="text-xl md:text-3xl">{`제 ${gameRoomState.currentRoundNumber}번째 게임`}</div>
            </>
          )}
          <CurrentPlayers />
          {isBreak && <CompletePanel />}
        </div>
        {!isBreak && <ControlPanel />}
      </div>
    </div>
  );
}
