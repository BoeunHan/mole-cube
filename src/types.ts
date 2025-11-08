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
  status: string;
  openedAt: Date;
  closedAt: Date | null;
  actionHistories: CubeActionHistory[];
  cubeStatus: {
    faceColors: Record<Face, Color[][]>;
    shuffleCnt: number;
  };
}

export interface GameRoomState {
  players: string[];
  currentRoundNumber: number;
  roundState: GameRoundState;
  currentPlayerId: string | null;
  currentPlayerNickname: string;
  timerEndTime: number;
  status: string;
}
