"use client";

import Image from "next/image";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useGameSocket } from "@/providers/GameSocketContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDate, groupActionHistoriesByDate } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useAudio } from "@/providers/AudioContext";

export const ChattingButton = () => {
  const { playEffect } = useAudio();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="relative h-15 w-15 cursor-pointer md:h-20 md:w-20"
          onClick={() => {
            playEffect("/sounds/click.wav");
          }}
        >
          <Image
            src={
              open
                ? "/assets/history_active.png"
                : "/assets/history_inactive.png"
            }
            title="회전내역 버튼"
            alt="회전내역"
            fill
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="w-80 bg-[#262322]/80 md:w-[420px]"
      >
        <HistoryContent />
      </PopoverContent>
    </Popover>
  );
};

const HistoryContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameRoomState } = useGameSocket();

  const histories = gameRoomState?.roundState.actionHistories;

  const [isScrollEnd, setIsScrollEnd] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsScrollEnd(scrollTop + clientHeight >= scrollHeight - 1);
  };

  const groupedHistories = useMemo(
    () => (histories ? groupActionHistoriesByDate(histories) : []),
    [histories],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    checkScroll();
  }, [histories]);

  return (
    <div className="font-neodgm relative h-[360px] p-1 text-white md:h-[500px]">
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="custom-scrollbar h-full overflow-y-scroll"
      >
        {groupedHistories?.map(([date, histories]) => {
          return (
            <div key={date}>
              <div className="md:text-md my-3 text-center text-sm">
                -&nbsp;&nbsp;{date}&nbsp;&nbsp;-
              </div>
              {histories.map(({ timestamp, nickname, action }) => {
                const { face, clockwise } = action;

                return (
                  <div
                    key={timestamp}
                    className="flex gap-x-2 text-lg md:text-xl"
                  >
                    <span>$</span>
                    <span className="text-[#F3FF52]">
                      {formatDate(timestamp, "A hh:mm:ss")}
                    </span>
                    <span className="text-[#E150C9]">{nickname}</span>
                    <span>{">"}</span>
                    <span>{`${face}${clockwise ? "" : `'`}`}</span>
                    <span>{clockwise}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {!isScrollEnd && (
        <button
          className="font-neodgm absolute bottom-1 left-1 flex h-8 w-8 cursor-pointer opacity-80"
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollTop =
                containerRef.current.scrollHeight;
            }
          }}
        >
          <Image
            src="/assets/bt_blank.png"
            alt="최근으로 이동 버튼"
            fill
            className="object-cover"
            unoptimized
          />
          <ChevronDownIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" />
        </button>
      )}
    </div>
  );
};
