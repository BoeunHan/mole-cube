"use client";

import { ChattingButton } from "@/components/ChattingButton";
import { CubeView } from "@/components/CubeView";
import { NicknameDialog } from "@/components/NicknameDialog";
import { RotationButtonList } from "@/components/RotationButton";

export default function Home() {
  return (
    <div className="relative h-full w-full">
      <NicknameDialog />
      <CubeView />
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-between px-4 py-10">
        <div>
          <div className="font-bitbeat text-primary text-xl">제 n번째 게임</div>
          <div>접속 사용자 목록</div>
        </div>
        <div className="pointer-events-auto flex w-full justify-between p-2">
          <ChattingButton />
          <RotationButtonList />
        </div>
      </div>
    </div>
  );
}
