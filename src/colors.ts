export enum Color {
  RED = "#ffc4b7",
  ORANGE = "#ffd1a6",
  YELLOW = "#ffe7c0",
  GREEN = "#d0f8b8",
  BLUE = "#93cef6",
  WHITE = "#fafaf8",
  NONE = "#aeaeae",
}

export enum Face {
  R = "R",
  L = "L",
  U = "U",
  D = "D",
  F = "F",
  B = "B",
}

export const CUBE_COLORS = {
  [Face.R]: [
    [Color.RED, Color.RED, Color.RED],
    [Color.RED, Color.RED, Color.RED],
    [Color.RED, Color.RED, Color.RED],
  ],
  [Face.L]: [
    [Color.BLUE, Color.BLUE, Color.BLUE],
    [Color.BLUE, Color.BLUE, Color.BLUE],
    [Color.BLUE, Color.BLUE, Color.BLUE],
  ],
  [Face.U]: [
    [Color.GREEN, Color.GREEN, Color.GREEN],
    [Color.GREEN, Color.GREEN, Color.GREEN],
    [Color.GREEN, Color.GREEN, Color.GREEN],
  ],
  [Face.D]: [
    [Color.YELLOW, Color.YELLOW, Color.YELLOW],
    [Color.YELLOW, Color.YELLOW, Color.YELLOW],
    [Color.YELLOW, Color.YELLOW, Color.YELLOW],
  ],
  [Face.F]: [
    [Color.ORANGE, Color.ORANGE, Color.ORANGE],
    [Color.ORANGE, Color.ORANGE, Color.ORANGE],
    [Color.ORANGE, Color.ORANGE, Color.ORANGE],
  ],
  [Face.B]: [
    [Color.WHITE, Color.WHITE, Color.WHITE],
    [Color.WHITE, Color.WHITE, Color.WHITE],
    [Color.WHITE, Color.WHITE, Color.WHITE],
  ],
};
