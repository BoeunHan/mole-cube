"use client";

import { MessageSquareMoreIcon } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useRef, useState } from "react";

export const ChattingButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <button
          className="rounded-full shadow-lg p-4 bg-white cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        >
          <MessageSquareMoreIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="bg-[#262322]/80 w-80"
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
  const { histories } = useGameSocket();

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
      className="relative h-[360px] overflow-y-scroll custom-scrollbar font-mono text-white"
    >
      {histories.map(({ nickname, action }) => {
        const { timestamp, face, clockwise } = action;

        const timeStr = new Date(timestamp).toLocaleTimeString("ko-KR", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        return (
          <div key={timestamp} className="flex gap-x-2 text-lg">
            <span>$</span>
            <span className="text-[#36d67e]">{timeStr}</span>
            <span className="text-[#fffc42]">{nickname}</span>
            <span>{">"}</span>
            <span>{`${face}${clockwise ? `'` : ""}`}</span>
            <span>{clockwise}</span>
          </div>
        );
      })}
      {!isScrollEnd && (
        <button
          className="font-sans hover:cursor-pointer fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 text-black px-3 py-1 rounded text-sm"
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
