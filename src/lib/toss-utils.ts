import { generateUUID } from "three/src/math/MathUtils.js";
import {
  submitGameCenterLeaderBoardScore,
  isMinVersionSupported,
  openGameCenterLeaderboard,
  // getUserKeyForGame
} from "@apps-in-toss/web-framework";
import { localStorageUtil } from "./utils";

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

export async function submitScore(score: number) {
  try {
    const result = await submitGameCenterLeaderBoardScore({
      score: `${score}`,
    });

    if (!result) {
      console.warn("지원하지 않는 앱 버전이에요.");
      return;
    }

    if (result.statusCode === "SUCCESS") {
      console.log("점수 제출 성공!");
    } else {
      console.error("점수 제출 실패:", result.statusCode);
    }
  } catch (error) {
    console.error("점수 제출 중 오류가 발생했어요.", error);
  }
}

export function openLeaderboard() {
  const isSupported = isMinVersionSupported({
    android: "5.221.0",
    ios: "5.221.0",
  });

  if (!isSupported) {
    console.warn("지원하지 않는 앱 버전이에요.");
    return;
  }

  openGameCenterLeaderboard();
}
