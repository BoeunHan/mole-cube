"use client";

import Image from "next/image";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { useAudio } from "@/providers/AudioContext";
import { useGameSocket } from "@/providers/GameSocketContext";
import { EMOTIONS } from "@/constants";

export const EmotionButton = () => {
  const { emitSendEmotion } = useGameSocket();
  const { playClickEffect } = useAudio();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="relative h-12 w-12 flex-shrink-0 cursor-pointer @md:h-16 @md:w-16"
          onClick={() => {
            playClickEffect();
          }}
        >
          <Image
            src={
              open
                ? "/assets/emotion_active.png"
                : "/assets/emotion_inactive.png"
            }
            title="감정표현 버튼"
            alt="감정표현"
            fill
            style={{ objectFit: "contain" }}
            unoptimized
            draggable={false}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="mx-auto flex max-w-[300px] flex-wrap bg-stone-400/80 @md:max-w-[400px]"
      >
        {Object.entries(EMOTIONS).map(([emotion, src]) => (
          <Image
            onClick={() => emitSendEmotion(emotion)}
            className="hover:cursor-pointer"
            key={emotion}
            width={60}
            height={60}
            src={src}
            alt={emotion}
            unoptimized
            draggable={false}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
};
