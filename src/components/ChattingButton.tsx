"use client";

import { MessageSquareMoreIcon } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useState } from "react";

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
  const { histories } = useGameSocket();

  return (
    <div className="h-[360px] overflow-y-scroll custom-scrollbar font-mono text-white">
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
    </div>
  );
};
