"use client";

import Image from "next/image";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { useAudio } from "@/providers/AudioContext";

export const EmotionButton = () => {
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
                ? "/assets/emotion_active.png"
                : "/assets/emotion_inactive.png"
            }
            title="감정표현 버튼"
            alt="감정표현"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="mx-auto flex w-80 flex-wrap bg-stone-400/80 md:w-[420px]"
      >
        {Object.entries(emotions).map(([emotion, src]) => (
          <Image
            className="hover:cursor-pointer"
            key={emotion}
            width={60}
            height={60}
            src={src}
            alt={emotion}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
};

const emotions = {
  happy: "/assets/emotion_happy.png",
  sad: "/assets/emotion_sad.png",
  annoying: "/assets/emotion_annoying.png",
  angry: "/assets/emotion_angry.png",
  tired: "/assets/emotion_tired.png",
  curious: "/assets/emotion_curious.png",
  surprised: "/assets/emotion_surprised.png",
};
