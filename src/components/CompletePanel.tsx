import { ConfettiCanvas } from "@/components/ConfettiCanvas";

import Image from "next/image";
import { Timer } from "@/components/Timer";
import { useGameSocket } from "@/providers/GameSocketContext";
import { diffTime, getPlayTimeLabel } from "@/lib/utils";

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
    <div className="flex w-full max-w-96 flex-col items-center px-10">
      <ConfettiCanvas />
      <Image
        src={"/assets/confetti.png"}
        alt="축하 이미지"
        width={100}
        height={100}
        draggable={false}
      />
      <div>축하합니다!</div>
      <div className="font-neodgm mt-4 mb-10 flex w-full flex-col bg-[#EDE8DB] px-10 py-6">
        <div>섞은 횟수 : {cubeStatus.shuffleCnt}</div>
        <div>소요 횟수 : {actionHistories.length}</div>
        <div>
          소요 시간 :{" "}
          {playTime
            ? getPlayTimeLabel(
                playTime.hours,
                playTime.minutes,
                playTime.seconds,
              )
            : ""}
        </div>
        <div>참여 인원 : {participantCount}명</div>
      </div>
      <div className="mb-4">다음 게임 시작까지...</div>
      <Timer
        timerEndTime={gameRoomState.timerEndTime}
        initialMs={gameRoomState.remainingMs}
      />
    </div>
  );
};
