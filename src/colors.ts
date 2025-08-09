export enum Color {
  RED = 0xffc4b7,
  ORANGE = 0xffd1a6,
  YELLOW = 0xffe7c0,
  GREEN = 0xd0f8b8,
  BLUE = 0x93cef6,
  WHITE = 0xfafaf8,
  NONE = 0xaeaeae,
}

export enum Face {
  R,
  L,
  U,
  D,
  F,
  B,
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
