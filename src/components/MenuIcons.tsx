import { openLeaderboard } from "@/lib/toss-utils";
import Image from "next/image";
import { Overlay } from "./ui/overlay";
import { useState } from "react";
import { ShopContent } from "./ShopContent";
import { useAudio } from "@/providers/AudioContext";
import { useToast } from "@/providers/ToastContext";

export const MenuIcons = () => {
  const { playClickEffect } = useAudio();
  const { openToast } = useToast();

  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative h-8 w-8 cursor-pointer md:h-14 md:w-14"
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
        />
      </div>
      <div
        className="relative h-8 w-8 cursor-pointer md:h-14 md:w-14"
        onClick={() => {
          playClickEffect();
          openToast("리더보드로 이동하면 게임에서 나가게 돼요. 이동할까요?", {
            label: "확인",
            onClick: () => {
              try {
                openLeaderboard();
              } catch (error) {
                openToast((error as Error).message);
              }
            },
          });
        }}
      >
        <Image
          src={"/assets/trophy.png"}
          title="리더보드 버튼"
          alt="리더보드"
          fill
          style={{ objectFit: "contain" }}
          unoptimized
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
