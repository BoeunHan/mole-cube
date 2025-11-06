import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getUserKeyForGame } from "@apps-in-toss/web-framework";

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
  const result = await getUserKeyForGame();

  if (!result) {
    console.warn("지원하지 않는 앱 버전이에요.");
    return;
  }

  if (result === "INVALID_CATEGORY") {
    console.error("게임 카테고리가 아닌 미니앱이에요.");
    return;
  }

  if (result === "ERROR") {
    console.error("사용자 키 조회 중 오류가 발생했어요.");
    return;
  }

  if (result.type === "HASH") {
    console.log("사용자 키:", result.hash);
    return result.hash;
  }
}
