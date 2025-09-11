import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sessionUtil = {
  setValue: (key: string, value: unknown) => {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error("세션스토리지 저장 실패:", error);
    }
  },
  getValue: <T>(key: string): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error("세션스토리지 조회 실패:", error);
      return null;
    }
  },
};
