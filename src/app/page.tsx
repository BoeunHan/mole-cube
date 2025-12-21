"use client";

import { CompletePanel } from "@/components/CompletePanel";
import { ControlPanel } from "@/components/ControlPanel";
import { CubeView } from "@/components/CubeView";
import { CurrentCoin } from "@/components/CurrentCoin";
import { CurrentPlayers } from "@/components/CurrentPlayers";
import { MenuIcons } from "@/components/MenuIcons";
import { NicknameDialog } from "@/components/NicknameDialog";
import { RoundInfo } from "@/components/RoundInfo";
import { useAudio } from "@/providers/AudioContext";
import { useGameSocket } from "@/providers/GameSocketContext";
import { ToastManager } from "mole-toast";
import { useEffect } from "react";

export default function Home() {
  const { gameRoomState } = useGameSocket();
  const { playGameBGM, playSolvedBGM } = useAudio();

  useEffect(() => {
    if (gameRoomState?.roundState.status === "solved") {
      playSolvedBGM();
    } else {
      playGameBGM();
    }
  }, [gameRoomState?.roundState.status]);

  const isBreak = gameRoomState?.status === "break";

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#6f6e6c]">
      <div className="font-bitbeat text-primary game-container @container flex items-center bg-[#D8D2CC]">
        <div className="font-neodgm z-60">
          <ToastManager />
        </div>
        <NicknameDialog />
        <div className="scroll-bg absolute inset-0 z-0"></div>
        {gameRoomState && (
          <>
            <div className="absolute top-14 left-7 z-20 flex flex-col gap-2">
              <CurrentCoin />
              <MenuIcons />
            </div>
          </>
        )}
        <div className={`${isBreak ? "invisible" : "block"}`}>
          <CubeView />
        </div>
        <div className="pointer-events-none relative z-10 flex h-full max-h-[760px] w-full flex-col items-center justify-between px-4 py-10 @md:max-h-[900px]">
          <div className="flex w-full flex-col items-center gap-y-2">
            <RoundInfo />
            <CurrentPlayers />
            {isBreak && <CompletePanel />}
          </div>
          {!isBreak && <ControlPanel />}
        </div>
      </div>
    </div>
  );
}
