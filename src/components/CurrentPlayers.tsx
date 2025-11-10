import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";

export const CurrentPlayers = () => {
  const { gameRoomState } = useGameSocket();

  const players = gameRoomState?.players;
  const currentPlayerId = gameRoomState?.currentPlayerId;
  return (
    <div className="mt-4 flex h-20 w-full items-center justify-center">
      {players?.map((userId) => (
        <div key={userId} className="relative h-15 w-15 md:h-20 md:w-20">
          <Image
            src={
              currentPlayerId === userId
                ? "/assets/mole_turn.png"
                : "/assets/mole.png"
            }
            alt="유저 이미지"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  );
};
