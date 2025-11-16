import { openLeaderboard } from "@/lib/toss-utils";
import Image from "next/image";
import { Overlay } from "./ui/overlay";
import { useState } from "react";
import { ShopContent } from "./ShopContent";

export const MenuIcons = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <div
        className="relative h-8 w-8 cursor-pointer md:h-14 md:w-14"
        onClick={() => {
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
          openLeaderboard();
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
