"use client";

import Image from "next/image";
import { useGameSocket } from "@/providers/GameSocketContext";
import { RotateCwIcon, RotateCcwIcon } from "lucide-react";
import { memo, useRef } from "react";

export const RotationHistory = () => {
  const { gameRoomState } = useGameSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  const histories = gameRoomState?.roundState.actionHistories;

  const scrollToLast = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  };

  return (
    <div className="w-full">
      {histories && histories.length > 0 && (
        <div className="flex w-full justify-between text-[10px]">
          <span>히스토리</span>
          <button className="cursor-pointer" onClick={scrollToLast}>
            최신으로 이동→
          </button>
        </div>
      )}
      <div ref={scrollRef} className="w-full justify-end overflow-x-auto">
        <div className="flex w-max min-w-full justify-end gap-x-[2px] rounded-sm bg-white/30 p-1 select-none">
          {histories?.map(({ timestamp, action: { face, clockwise } }, idx) => {
            const isLast = idx === histories.length - 1;
            return (
              <HistoryItem
                key={timestamp}
                face={face}
                clockwise={clockwise}
                isLast={isLast}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HistoryItem = memo(
  ({
    face,
    clockwise,
    isLast,
  }: {
    face: string;
    clockwise: boolean;
    isLast: boolean;
  }) => (
    <div
      className={`font-neodgm relative flex aspect-square w-8 flex-shrink-0 items-center justify-center opacity-80 ${isLast ? "ring-2 ring-[#eb4949]" : ""}`}
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
      {clockwise ? (
        <RotateCwIcon
          strokeWidth={1.3}
          className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 text-stone-400"
        />
      ) : (
        <RotateCcwIcon
          strokeWidth={1.3}
          className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 text-stone-400"
        />
      )}
    </div>
  ),
);

HistoryItem.displayName = "HistoryItem";
