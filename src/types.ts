import { Mesh } from "three";
import { Color, Face } from "./enums";

export type CubeData = Mesh[][][];

export interface CubeAction {
  face: Face;
  clockwise: boolean;
}

export interface CubeActionHistory {
  userId: string;
  nickname: string;
  timestamp: number;
  action: CubeAction;
}

export interface GameRoundState {
  currentRound: number;
  openedAt: Date | null;
  closedAt: Date | null;
  actionHistories: CubeActionHistory[];
  faceColors: Record<Face, Color[][]>;
}
