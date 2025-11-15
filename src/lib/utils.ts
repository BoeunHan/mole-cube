import { CubeActionHistory } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import duration from "dayjs/plugin/duration";
import { generateUUID } from "three/src/math/MathUtils.js";
// import { getUserKeyForGame } from "@apps-in-toss/web-framework";

dayjs.locale("ko");
dayjs.extend(duration);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localStorageUtil = {
  setValue: (key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error("로컬스토리지 저장 실패:", error);
    }
  },
  getValue: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error("로컬스토리지 조회 실패:", error);
      return null;
    }
  },
};

export async function getUserId(): Promise<string | undefined> {
  // const result = await getUserKeyForGame();

  // if (!result) {
  //   console.warn("지원하지 않는 앱 버전이에요.");
  //   return;
  // }

  // if (result === "INVALID_CATEGORY") {
  //   console.error("게임 카테고리가 아닌 미니앱이에요.");
  //   return;
  // }

  // if (result === "ERROR") {
  //   console.error("사용자 키 조회 중 오류가 발생했어요.");
  //   return;
  // }

  // if (result.type === "HASH") {
  //   console.log("사용자 키:", result.hash);
  //   return result.hash;
  // }

  const userId = localStorageUtil.getValue("user_id") as string;
  if (!userId) {
    const newUserId = await generateUUID();
    localStorageUtil.setValue("user_id", newUserId);
    return newUserId;
  }

  return userId;
}

export function getTurnsLeft(
  players: string[],
  currentPlayerId: string,
  myUserId: string,
) {
  const currentIndex = players.indexOf(currentPlayerId);
  const myIndex = players.indexOf(myUserId);

  if (currentIndex === -1 || myIndex === -1) {
    throw new Error(
      "players 리스트 안에 currentPlayerId 혹은 myUserId가 없습니다.",
    );
  }

  if (myIndex >= currentIndex) {
    return myIndex - currentIndex;
  } else {
    return players.length - currentIndex + myIndex;
  }
}

export function diffTime(start: Date, end: Date) {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  if (!startDate.isBefore(endDate)) return null;

  const diffMs = endDate.diff(startDate);
  const d = dayjs.duration(diffMs);

  return { hours: d.hours(), minutes: d.minutes(), seconds: d.seconds() };
}

export function getPlayTimeLabel(
  hours: number,
  minutes: number,
  seconds: number,
) {
  if (hours === 0 && minutes === 0 && seconds === 0) return "0초";
  if (hours === 0 && minutes === 0) return `${seconds}초`;
  if (hours === 0) return `${minutes}분 ${seconds}초`;
  return `${hours}시간 ${minutes}분 ${seconds}초`;
}

export function groupActionHistoriesByDate(
  actionHistories: CubeActionHistory[],
): [string, CubeActionHistory[]][] {
  const grouped: Record<string, CubeActionHistory[]> = {};

  actionHistories.forEach((history) => {
    const day = dayjs(history.timestamp).format("YYYY년 M월 D일");
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(history);
  });

  return Object.entries(grouped).sort(
    ([dateA], [dateB]) => dayjs(dateA).valueOf() - dayjs(dateB).valueOf(),
  );
}

export function formatDate(date: Date | number, format: string): string {
  return dayjs(date).format(format);
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
