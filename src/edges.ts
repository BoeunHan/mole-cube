import { Face } from "./colors";

export type EdgePosition = "top" | "bottom" | "left" | "right";

export interface AdjacentEdgeInfo {
  face: Face;
  edge: EdgePosition;
  reverseClockwise: boolean;
  reverseCounterClockwise: boolean;
}

export const adjacentEdgesMap: Record<Face, AdjacentEdgeInfo[]> = {
  [Face.R]: [
    {
      face: Face.U,
      edge: "right",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.B,
      edge: "right",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.D,
      edge: "right",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.F,
      edge: "right",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
  ],
  [Face.L]: [
    {
      face: Face.U,
      edge: "left",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.F,
      edge: "left",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.D,
      edge: "left",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.B,
      edge: "left",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
  ],
  [Face.U]: [
    {
      face: Face.B,
      edge: "top",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.R,
      edge: "right",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.F,
      edge: "top",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.L,
      edge: "right",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
  ],
  [Face.D]: [
    {
      face: Face.F,
      edge: "bottom",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.R,
      edge: "left",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.B,
      edge: "bottom",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.L,
      edge: "left",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
  ],
  [Face.F]: [
    {
      face: Face.U,
      edge: "top",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.R,
      edge: "top",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.D,
      edge: "top",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.L,
      edge: "top",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
  ],
  [Face.B]: [
    {
      face: Face.U,
      edge: "bottom",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.L,
      edge: "bottom",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
    {
      face: Face.D,
      edge: "bottom",
      reverseClockwise: false,
      reverseCounterClockwise: true,
    },
    {
      face: Face.R,
      edge: "bottom",
      reverseClockwise: true,
      reverseCounterClockwise: false,
    },
  ],
};
