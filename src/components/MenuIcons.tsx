import Image from "next/image";
import { Overlay } from "./ui/overlay";
import { useState } from "react";
import { ShopContent } from "./ShopContent";
import { useAudio } from "@/providers/AudioContext";

export const MenuIcons = () => {
  const { playClickEffect } = useAudio();

  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative h-8 w-8 cursor-pointer @md:h-14 @md:w-14"
        onClick={() => {
          playClickEffect();
          setIsShopOpen(true);
        }}
      >
        <Image
          src={"/assets/shop.png"}
          title="상점 버튼"
          alt="상점"
          fill
          style={{ objectFit: "contain" }}
          unoptimized
          draggable={false}
        />
      </div>
      <Overlay
        open={isShopOpen}
        onClose={() => {
          setIsShopOpen(false);
        }}
      >
        <ShopContent />
      </Overlay>
    </div>
  );
};
