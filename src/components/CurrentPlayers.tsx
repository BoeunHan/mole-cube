import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/providers/AudioContext";
import { Sprite } from "./ui/sprite";
import { EMOTIONS } from "@/constants";

type PlayerState = {
  id: string;
  status: "entering" | "playing" | "exiting";
};

export const CurrentPlayers = () => {
  const prevPlayersRef = useRef<string[]>([]);
  const { userId, gameRoomState, emotions } = useGameSocket();
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
        <div key={id} className="relative h-17 w-17 md:h-20 md:w-20">
          {status === "entering" ? (
            <Sprite
              src="/assets/mole_in.png"
              frames={6}
              fps={12}
              size={128}
              handleAnimationEnd={() => handleAnimationEnd(id, "enter")}
            />
          ) : status === "exiting" ? (
            <Sprite
              src="/assets/mole_out.png"
              frames={6}
              fps={16}
              size={128}
              handleAnimationEnd={() => handleAnimationEnd(id, "exit")}
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src="/assets/mole.png"
                alt="유저 이미지"
                fill
                style={{ objectFit: "contain" }}
                unoptimized
              />
              {emotions[id] && (
                <Image
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+6px)]"
                  src={EMOTIONS[emotions[id] as keyof typeof EMOTIONS]}
                  alt={emotions[id]}
                  width={52}
                  height={52}
                  unoptimized
                />
              )}
              {id === userId && (
                <Image
                  className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-2"
                  src="/assets/me_tag.png"
                  alt="나"
                  width={40}
                  height={20}
                />
              )}
              {id === currentPlayerId && (
                <Image
                  className="turn-arrow-float absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3"
                  src="/assets/turn_arrow.png"
                  alt="현재 차례"
                  width={28}
                  height={28}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
