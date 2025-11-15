import Image from "next/image";
import { SKINS } from "@/constants";
import { useGameSocket } from "@/providers/GameSocketContext";

export const ShopContent = () => {
  const { emitBuySkin, emitSelectSkin, userId, playerSkins, ownedSkins } =
    useGameSocket();

  const mySelectedSkin = playerSkins[userId] ?? "default";

  return (
    <div className="flex h-full flex-col items-center gap-y-2">
      <div className="text-xl">상점</div>
      <div className="grid h-full w-full auto-rows-min grid-cols-2 divide-x divide-y divide-[#C6BDB5] overflow-y-scroll">
        {Object.entries(SKINS).map(([key, { src, label, coin }]) => (
          <div key={key} className="flex flex-col items-center p-2">
            <div className="relative aspect-square w-full">
              <Image
                src={src}
                alt={`${label} 스킨`}
                fill
                style={{ objectFit: "contain" }}
                unoptimized
              />
              {!ownedSkins.includes(key) && (
                <div className="absolute top-0 right-0 flex items-center">
                  <Image
                    src="/assets/coin.png"
                    alt="코인 이미지"
                    width={20}
                    height={20}
                  />
                  <span className="text-xs">{coin}</span>
                </div>
              )}
            </div>
            <span>{label}</span>
            {key === mySelectedSkin && (
              <span className="my-auto w-full text-center text-[#658DBB]">
                선택됨
              </span>
            )}
            {key !== "default" && !ownedSkins.includes(key) && (
              <div
                className="relative aspect-[2/1] w-[calc(100%-40px)] hover:cursor-pointer"
                onClick={() => emitBuySkin(key, coin)}
              >
                <Image
                  src="/assets/bt_red.png"
                  alt={`${label} 구매 버튼`}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
                <span className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-white">
                  구매하기
                </span>
              </div>
            )}
            {(key === "default" || ownedSkins.includes(key)) &&
              key !== mySelectedSkin && (
                <div
                  className="relative aspect-[2/1] w-[calc(100%-40px)] hover:cursor-pointer"
                  onClick={() => emitSelectSkin(key)}
                >
                  <Image
                    src="/assets/bt_blue.png"
                    alt={`${label} 선택 버튼`}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                  <span className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-sm text-white md:text-base">
                    선택하기
                  </span>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};
