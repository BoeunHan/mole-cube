import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";

export const CurrentPlayers = () => {
  const { gameRoundState } = useGameSocket();

  const playerQueue = gameRoundState?.playerQueue;
  const currentPlayerId = gameRoundState?.currentPlayerId;
  return (
    <div className="flex h-24 w-full flex-wrap items-center justify-center overflow-y-auto">
      {playerQueue?.map((userId) => (
        <Image
          key={userId}
          width={48}
          height={48}
          src={
            currentPlayerId === userId
              ? "/assets/mole_turn.png"
              : "/assets/mole.png"
          }
          alt="유저 이미지"
        />
      ))}
    </div>
  );
};
