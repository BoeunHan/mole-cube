import { Face } from "@/enums";

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
