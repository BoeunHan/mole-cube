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
        className="w-80 bg-black/40"
        onPointerDownOutside={(e) => {
          e.preventDefault(); // 외부 클릭 무시
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
    <div>
      {histories.map(({ nickname, action }) => {
        const { timestamp, face, clockwise } = action;
        return (
          <div key={timestamp}>
            <div>{nickname}</div>
            <div>{timestamp}</div>
            <div>{face}</div>
            <div>{clockwise}</div>
          </div>
        );
      })}
    </div>
  );
};
