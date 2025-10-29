"use client";

import Image from "next/image";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useRef, useState } from "react";

export const ChattingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Image
          src={
            open ? "/assets/history_active.png" : "/assets/history_inactive.png"
          }
          title="회전내역 버튼"
          alt="회전내역"
          width={56}
          height={56}
          className="cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="w-80 bg-[#262322]/80"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <HistoryContent />
      </PopoverContent>
    </Popover>
  );
};

const HistoryContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameRoundState, playerNickname } = useGameSocket();

  const histories = gameRoundState?.actionHistories;

  const [isScrollEnd, setIsScrollEnd] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsScrollEnd(scrollTop + clientHeight >= scrollHeight - 1);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    checkScroll();
  }, [histories]);

  return (
    <div
      ref={containerRef}
      onScroll={checkScroll}
      className="custom-scrollbar relative h-[360px] overflow-y-scroll font-mono text-white"
    >
      {histories?.map(({ userId, timestamp, action }) => {
        const { face, clockwise } = action;

        const timeStr = new Date(timestamp).toLocaleTimeString("ko-KR", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        return (
          <div key={timestamp} className="font-neodgm flex gap-x-2 text-lg">
            <span>$</span>
            <span className="text-[#36d67e]">{timeStr}</span>
            <span className="text-[#fffc42]">{playerNickname[userId]}</span>
            <span>{">"}</span>
            <span>{`${face}${clockwise ? "" : `'`}`}</span>
            <span>{clockwise}</span>
          </div>
        );
      })}
      {!isScrollEnd && (
        <button
          className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded bg-white/80 px-3 py-1 font-sans text-sm text-black hover:cursor-pointer"
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollTop =
                containerRef.current.scrollHeight;
            }
          }}
        >
          최근으로 이동 ↓
        </button>
      )}
    </div>
  );
};
