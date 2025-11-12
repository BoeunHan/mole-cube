import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/providers/AudioContext";
import { Sprite } from "./ui/sprite";

type PlayerState = {
  id: string;
  status: "entering" | "playing" | "exiting";
};

export const CurrentPlayers = () => {
  const prevPlayersRef = useRef<string[]>([]);
  const { gameRoomState } = useGameSocket();
  const { playEffect } = useAudio();

  const players = gameRoomState?.players;
  const currentPlayerId = gameRoomState?.currentPlayerId;

  const [displayPlayers, setDisplayPlayers] = useState<PlayerState[]>([]);

  useEffect(() => {
    if (!players) return;
    const prev = prevPlayersRef.current;
    const entering = players.filter((p) => !prev.includes(p));
    const exiting = prev.filter((p) => !players.includes(p));

    setDisplayPlayers((prev) => [
      ...prev.map((p) =>
        exiting.includes(p.id) ? { ...p, status: "exiting" as const } : p,
      ),
      ...entering.map((id) => ({ id, status: "entering" as const })),
    ]);

    prevPlayersRef.current = players;

    if (entering.length) playEffect("/sounds/digging.mp3", 0.7);
  }, [players]);

  const handleAnimationEnd = (id: string, type: "enter" | "exit") => {
    setDisplayPlayers(
      (prev) =>
        prev
          .map((p) => {
            if (p.id !== id) return p;
            if (type === "enter") return { ...p, status: "playing" };
            return null;
          })
          .filter(Boolean) as PlayerState[],
    );
  };

  return (
    <div className="mt-4 flex h-20 w-full items-center justify-center">
      {displayPlayers?.map(({ id, status }) => (
        <div key={id} className="relative h-15 w-15 md:h-20 md:w-20">
          {status === "entering" ? (
            <Sprite
              src="/assets/mole_in.png"
              frames={10}
              fps={20}
              size={128}
              handleAnimationEnd={() => handleAnimationEnd(id, "enter")}
            />
          ) : status === "exiting" ? (
            <Sprite
              src="/assets/mole_out.png"
              frames={10}
              fps={30}
              size={128}
              handleAnimationEnd={() => handleAnimationEnd(id, "exit")}
            />
          ) : (
            <Image
              src="/assets/mole.png"
              alt="유저 이미지"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
