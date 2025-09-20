import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidV4 } from "uuid";

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

export function createUUID() {
  return uuidV4();
}
