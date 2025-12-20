"use client";

import Image from "next/image";
import { Timer } from "@/components/Timer";
import { useGameSocket } from "@/providers/GameSocketContext";
import { diffTime, getPlayTimeLabel } from "@/lib/utils";
import { ConfettiCanvas } from "./ConfettiCanvas";

export const CompletePanel = () => {
  const { gameRoomState } = useGameSocket();

  if (!gameRoomState?.roundState) return null;

  const { cubeStatus, actionHistories, openedAt, closedAt } =
    gameRoomState.roundState;

  const playTime = closedAt
    ? diffTime(new Date(openedAt), new Date(closedAt))
    : null;

  const participantCount = new Set(actionHistories.map((h) => h.userId)).size;

  return (
    <div className="flex w-full max-w-96 flex-col items-center px-10 md:max-w-[420px]">
      <ConfettiCanvas />
      <div className="relative h-32 w-32 md:h-40 md:w-40">
        <Image
          src={"/assets/confetti.png"}
          alt="축하 이미지"
          fill
          style={{ objectFit: "contain" }}
          draggable={false}
          unoptimized
        />
      </div>
      <div className="md:text-2xl">축하합니다!</div>
      <div className="font-neodgm mt-4 mb-10 flex w-full flex-col bg-[#EDE8DB] px-10 py-6 md:mb-16 md:text-xl">
        <div>섞은 횟수 : {cubeStatus.shuffleCnt}</div>
        <div>소요 횟수 : {actionHistories.length}</div>
        <div>
          소요 시간 :{" "}
          {playTime
            ? getPlayTimeLabel(
                playTime.days,
                playTime.hours,
                playTime.minutes,
                playTime.seconds,
              )
            : ""}
        </div>
        <div>참여 인원 : {participantCount}명</div>
      </div>
      <div className="mb-4 md:text-2xl">다음 게임 시작까지...</div>
      <Timer
        totalMs={gameRoomState.timerTotalTime}
        endTime={gameRoomState.timerEndTime}
      />
    </div>
  );
};
