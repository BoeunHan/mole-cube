import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";

export const CurrentPlayers = () => {
  const { players } = useGameSocket();
  return (
    <div className="flex h-24 w-full flex-wrap items-center justify-center overflow-y-auto">
      {Object.entries(players).map(([userId, nickname]) => (
        <Image
          key={userId}
          width={48}
          height={48}
          src="/assets/mole.png"
          alt="유저 이미지"
        />
      ))}
    </div>
  );
};
