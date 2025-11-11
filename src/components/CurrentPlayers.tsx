import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect } from "react";
import { useAudio } from "@/providers/AudioContext";

export const CurrentPlayers = () => {
  const { gameRoomState } = useGameSocket();
  const { playEffect } = useAudio();

  const players = gameRoomState?.players;
  const currentPlayerId = gameRoomState?.currentPlayerId;

  useEffect(() => {
    playEffect("/sounds/digging.mp3", 0.7);
  }, [players]);

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
