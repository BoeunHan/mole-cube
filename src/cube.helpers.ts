import { Color, Face } from "@/enums";
import { DEFAULT_CUBE_COLORS } from "./cube-colors";

export function createCubeColors(size: number): Record<Face, Color[][]> {
  const createCubeFace = (face: Face) =>
    Array.from({ length: size }, () =>
      new Array(size).fill(DEFAULT_CUBE_COLORS[face])
    );

  return {
    [Face.R]: createCubeFace(Face.R),
    [Face.L]: createCubeFace(Face.L),
    [Face.U]: createCubeFace(Face.U),
    [Face.D]: createCubeFace(Face.D),
    [Face.F]: createCubeFace(Face.F),
    [Face.B]: createCubeFace(Face.B),
  };
}

export function getRotationDirection(face: Face, clockwise: boolean): 1 | -1 {
  switch (face) {
    case Face.U:
    case Face.R:
    case Face.F:
      return clockwise ? -1 : 1;
    case Face.D:
    case Face.L:
    case Face.B:
      return clockwise ? 1 : -1;
  }
}

export function getRotationAxis(face: Face): "x" | "y" | "z" {
  switch (face) {
    case Face.R:
    case Face.L:
      return "x";
    case Face.U:
    case Face.D:
      return "y";
    case Face.F:
    case Face.B:
      return "z";
  }
}

export function rotateMatrixClockwise(matrix: Color[][]): Color[][] {
  const N = matrix.length;
  const result: Color[][] = Array.from({ length: N }, () => Array(N));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j][N - 1 - i] = matrix[i][j];
    }
  }
  return result;
}

export function rotateMatrixCounterClockwise(matrix: Color[][]): Color[][] {
  const N = matrix.length;
  const result: Color[][] = Array.from({ length: N }, () => Array(N));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[N - 1 - j][i] = matrix[i][j];
    }
  }
  return result;
}
