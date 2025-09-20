import { Mesh } from "three";
import { Face } from "./enums";

export type CubeData = Mesh[][][];

export interface CubeAction {
  face: Face;
  clockwise: boolean;
  timestamp: number;
}

export interface CubeActionHistory {
  nickname: string;
  action: CubeAction;
}
