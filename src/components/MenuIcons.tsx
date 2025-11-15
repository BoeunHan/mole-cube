import { openLeaderboard } from "@/lib/toss-utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const MenuIcons = () => {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <div
        className="relative h-10 w-10 cursor-pointer md:h-14 md:w-14"
        onClick={() => {
          router.push("/shop");
        }}
      >
        <Image
          src={"/assets/shop.png"}
          title="상점 버튼"
          alt="상점"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div
        className="relative h-10 w-10 cursor-pointer md:h-14 md:w-14"
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
        />
      </div>
    </div>
  );
};
