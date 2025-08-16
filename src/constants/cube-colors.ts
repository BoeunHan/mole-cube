import { Color, Face } from "@/enums";

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
