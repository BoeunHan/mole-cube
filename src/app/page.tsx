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
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-4 p-4">
        <div className="flex w-full justify-between border-4 p-2">
          <ChattingButton />
          <RotationButtonList />
        </div>
      </div>
    </div>
  );
}
