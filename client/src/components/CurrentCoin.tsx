import { useGameSocket } from "@/providers/GameSocketContext";
import Image from "next/image";

export const CurrentCoin = () => {
  const { coin } = useGameSocket();

  return (
    <div className="flex items-center">
      <div className="relative h-8 w-8 @md:h-12 @md:w-12">
        <Image
          src="/assets/coin.png"
          alt="코인 이미지"
          fill
          style={{ objectFit: "contain" }}
          draggable={false}
          unoptimized
        />
      </div>
      <div className="relative flex flex-col text-sm @md:text-lg">
        {coin.total}
        {coin.delta !== 0 && (
          <span
            key={`${coin.total}-${coin.delta}`}
            className={"coin-float absolute top-full"}
          >
            {coin.delta > 0 ? `+${coin.delta}` : coin.delta}
          </span>
        )}
      </div>
    </div>
  );
};
