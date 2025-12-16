import { CubeActionHistory } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import duration from "dayjs/plugin/duration";
import { generateUUID } from "three/src/math/MathUtils.js";

dayjs.locale("ko");
dayjs.extend(duration);

export async function getUserId(): Promise<string | undefined> {
  const userId = localStorageUtil.getValue("user_id") as string;
  if (!userId) {
    const newUserId = await generateUUID();
    localStorageUtil.setValue("user_id", newUserId);
    return newUserId;
  }

  return userId;
}

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

export function getTurnsLeft(
  players: string[],
  currentPlayerId: string,
  myUserId: string,
) {
  const currentIndex = players.indexOf(currentPlayerId);
  const myIndex = players.indexOf(myUserId);

  if (currentIndex === -1 || myIndex === -1) {
    console.error(
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

  return {
    days: d.days(),
    hours: d.hours(),
    minutes: d.minutes(),
    seconds: d.seconds(),
  };
}

export function getPlayTimeLabel(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
) {
  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) return "0초";
  if (days === 0 && hours === 0 && minutes === 0) return `${seconds}초`;
  if (days === 0 && hours === 0) return `${minutes}분 ${seconds}초`;
  if (days === 0) return `${hours}시간 ${minutes}분 ${seconds}초`;
  return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
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

export function generateHaptic() {
  navigator.vibrate([20, 30, 20, 30, 20]);
}
