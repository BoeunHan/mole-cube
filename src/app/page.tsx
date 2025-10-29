"use client";

import { ChattingButton } from "@/components/ChattingButton";
import { CubeView } from "@/components/CubeView";
import { CurrentPlayers } from "@/components/CurrentPlayers";
import { EmotionButton } from "@/components/EmotionButton";
import { NicknameDialog } from "@/components/NicknameDialog";
import { RotationButtonList } from "@/components/RotationButton";

export default function Home() {
  return (
    <div className="relative h-full w-full">
      <NicknameDialog />
      <CubeView />
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-between px-4 py-10">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="font-bitbeat text-primary text-xl">제 n번째 게임</div>
          <CurrentPlayers />
        </div>
        <div className="pointer-events-auto flex w-full items-center justify-center gap-x-4 p-2">
          <div className="flex shrink-0 flex-col">
            <ChattingButton />
            <EmotionButton />
          </div>
          <RotationButtonList />
        </div>
      </div>
    </div>
  );
}
