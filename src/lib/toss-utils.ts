import { generateUUID } from "three/src/math/MathUtils.js";
import {
  submitGameCenterLeaderBoardScore,
  isMinVersionSupported,
  openGameCenterLeaderboard,
  getUserKeyForGame,
} from "@apps-in-toss/web-framework";
import { localStorageUtil } from "./utils";

export async function getUserId(): Promise<string | undefined> {
  const result = await getUserKeyForGame();

  if (!result) {
    throw new Error("지원하지 않는 앱 버전이에요.");
  }

  if (result === "INVALID_CATEGORY") {
    throw new Error("게임 카테고리가 아닌 미니앱이에요.");
  }

  if (result === "ERROR") {
    throw new Error("사용자 키 조회 중 오류가 발생했어요.");
  }

  if (result.type === "HASH") {
    return result.hash;
  }

  // const userId = localStorageUtil.getValue("user_id") as string;
  // if (!userId) {
  //   const newUserId = await generateUUID();
  //   localStorageUtil.setValue("user_id", newUserId);
  //   return newUserId;
  // }

  // return userId;
}

export async function submitScore(score: number) {
  const result = await submitGameCenterLeaderBoardScore({
    score: `${score}`,
  });

  if (!result) {
    console.warn("점수 제출을 지원하지 않는 앱 버전이에요.");
    return;
  }

  if (result.statusCode === "SUCCESS") {
    console.log("점수 제출 성공!");
  } else {
    console.error("점수 제출 실패:", result.statusCode);
  }
}

export function openLeaderboard() {
  const isSupported = isMinVersionSupported({
    android: "5.221.0",
    ios: "5.221.0",
  });

  if (!isSupported) {
    throw new Error("지원하지 않는 앱 버전이에요.");
  }

  openGameCenterLeaderboard();
}
