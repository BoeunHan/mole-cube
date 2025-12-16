"use client";

import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";
import { RotateCwIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export const RotationHistory = () => {
  const { gameRoomState } = useGameSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  const histories = gameRoomState?.roundState.actionHistories;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [histories?.length]);

  return (
    <div ref={scrollRef} className="w-full justify-end overflow-x-auto">
      <div className="flex w-max min-w-full justify-end gap-x-[2px] select-none">
        {histories?.map(({ timestamp, action: { face, clockwise } }) => {
          return (
            <div
              key={timestamp}
              className="font-neodgm relative flex aspect-square w-8 flex-shrink-0 items-center justify-center opacity-80"
              title={clockwise ? "시계방향" : "반시계방향"}
            >
              <Image
                src="/assets/bt_blank.png"
                alt={`${face} ${clockwise ? "시계방향" : "반시계방향"}`}
                fill
                className="object-cover"
                unoptimized
                draggable={false}
              />

              <span className="z-10">{face}</span>
              {clockwise && (
                <RotateCwIcon
                  strokeWidth={1.3}
                  className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 text-stone-400"
                />
              )}
              {!clockwise && (
                <RotateCcwIcon
                  strokeWidth={1.3}
                  className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 text-stone-400"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
