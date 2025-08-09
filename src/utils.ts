import { Color, CUBE_COLORS, Face } from "./colors";
import { adjacentEdgesMap, EdgePosition } from "./edges";

function rotateMatrixClockwise(matrix: Color[][]): Color[][] {
  const N = matrix.length;
  const result: Color[][] = Array.from({ length: N }, () => Array(N));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j][N - 1 - i] = matrix[i][j];
    }
  }
  return result;
}

function rotateMatrixCounterClockwise(matrix: Color[][]): Color[][] {
  const N = matrix.length;
  const result: Color[][] = Array.from({ length: N }, () => Array(N));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[N - 1 - j][i] = matrix[i][j];
    }
  }
  return result;
}

function getEdgeColors(face: Face, edge: EdgePosition): Color[] {
  const matrix = CUBE_COLORS[face];
  const N = matrix.length;
  const colors: Color[] = [];

  switch (edge) {
    case "top":
      for (let i = 0; i < N; i++) colors.push(matrix[i][N - 1]);
      break;
    case "bottom":
      for (let i = 0; i < N; i++) colors.push(matrix[i][0]);
      break;
    case "left":
      for (let i = 0; i < N; i++) colors.push(matrix[0][i]);
      break;
    case "right":
      for (let i = 0; i < N; i++) colors.push(matrix[N - 1][i]);
      break;
  }

  return colors;
}

function setEdgeColors(face: Face, edge: EdgePosition, colors: Color[]) {
  const matrix = CUBE_COLORS[face];
  const N = matrix.length;
  switch (edge) {
    case "top":
      for (let i = 0; i < N; i++) matrix[i][N - 1] = colors[i];
      break;
    case "bottom":
      for (let i = 0; i < N; i++) matrix[i][0] = colors[i];
      break;
    case "left":
      for (let i = 0; i < N; i++) matrix[0][i] = colors[i];
      break;
    case "right":
      for (let i = 0; i < N; i++) matrix[N - 1][i] = colors[i];
      break;
  }
}

export function updateFaceColorsAfterRotation(face: Face, clockwise: boolean) {
  const currentColors = CUBE_COLORS[face];
  const isOpposite = face === Face.L || face === Face.U || face === Face.B;
  let rotatedColors: Color[][];

  if (clockwise) {
    rotatedColors = isOpposite
      ? rotateMatrixCounterClockwise(currentColors)
      : rotateMatrixClockwise(currentColors);
  } else {
    rotatedColors = isOpposite
      ? rotateMatrixClockwise(currentColors)
      : rotateMatrixCounterClockwise(currentColors);
  }
  CUBE_COLORS[face] = rotatedColors;

  const adjEdges = adjacentEdgesMap[face];
  const edges: Color[][] = adjEdges.map(
    ({ face, edge, reverseClockwise, reverseCounterClockwise }) => {
      let edgeColors = getEdgeColors(face, edge);
      const reverse = clockwise ? reverseClockwise : reverseCounterClockwise;
      if (reverse) edgeColors = edgeColors.slice().reverse();
      return edgeColors;
    }
  );
  for (let i = 0; i < 4; i++) {
    const fromIndex = (i + (clockwise ? 3 : 1)) % 4;
    const to = adjEdges[i];
    const colorsToSet = edges[fromIndex];
    setEdgeColors(to.face, to.edge, colorsToSet);
  }
}
