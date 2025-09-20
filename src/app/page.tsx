"use client";

import { ChattingButton } from "@/components/ChattingButton";
import { CubeView } from "@/components/CubeView";
import { NicknameDialog } from "@/components/NicknameDialog";
import { RotationButtonList } from "@/components/RotationButton";

export default function Home() {
  return (
    <div className="h-full border-red-300 box-border">
      <NicknameDialog />
      <CubeView />
      <div className="fixed bottom-12 left-12">
        <ChattingButton />
      </div>
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2">
        <RotationButtonList />
      </div>
    </div>
  );
}
