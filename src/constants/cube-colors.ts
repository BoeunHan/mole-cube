import { Color, Face } from "@/enums";

export const DEFAULT_CUBE_COLORS = {
  [Face.R]: Color.RED,
  [Face.L]: Color.BLUE,
  [Face.U]: Color.GREEN,
  [Face.D]: Color.YELLOW,
  [Face.F]: Color.ORANGE,
  [Face.B]: Color.WHITE,
};

export const createCubeColors = (size: number): Record<Face, Color[][]> => {
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
};

export const CUBE_COLORS = createCubeColors(3);
