"use client";

import Image from "next/image";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";

export const EmotionButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Image
          src={
            open ? "/assets/emotion_active.png" : "/assets/emotion_inactive.png"
          }
          title="감정표현 버튼"
          alt="감정표현"
          width={64}
          height={64}
          className="cursor-pointer"
          onClick={() => setOpen((prev) => !prev)}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div>감정 선택창</div>
      </PopoverContent>
    </Popover>
  );
};
