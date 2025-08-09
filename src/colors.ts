export enum Color {
  RED = 0xffc4b7,
  ORANGE = 0xffd1a6,
  YELLOW = 0xffe7c0,
  GREEN = 0xd0f8b8,
  BLUE = 0x93cef6,
  WHITE = 0xfafaf8,
  NONE = 0xaeaeae,
}

export const CUBE_COLORS = {
  R: [
    [Color.RED, Color.RED, Color.RED],
    [Color.RED, Color.RED, Color.RED],
    [Color.RED, Color.RED, Color.RED],
  ],
  L: [
    [Color.BLUE, Color.BLUE, Color.BLUE],
    [Color.BLUE, Color.BLUE, Color.BLUE],
    [Color.BLUE, Color.BLUE, Color.BLUE],
  ],
  U: [
    [Color.GREEN, Color.GREEN, Color.GREEN],
    [Color.GREEN, Color.GREEN, Color.GREEN],
    [Color.GREEN, Color.GREEN, Color.GREEN],
  ],
  D: [
    [Color.YELLOW, Color.YELLOW, Color.YELLOW],
    [Color.YELLOW, Color.YELLOW, Color.YELLOW],
    [Color.YELLOW, Color.YELLOW, Color.YELLOW],
  ],
  F: [
    [Color.ORANGE, Color.ORANGE, Color.ORANGE],
    [Color.ORANGE, Color.ORANGE, Color.ORANGE],
    [Color.ORANGE, Color.ORANGE, Color.ORANGE],
  ],
  B: [
    [Color.WHITE, Color.WHITE, Color.WHITE],
    [Color.WHITE, Color.WHITE, Color.WHITE],
    [Color.WHITE, Color.WHITE, Color.WHITE],
  ],
};
