"use client";

import * as THREE from "three";
import { useCube } from "@/providers/CubeContext";
import { CubeData } from "@/types";
import { Color, Face } from "@/enums";
import { adjacentEdgesMap, EdgePosition } from "@/edges";
import {
  createCubeColors,
  getRotationAxis,
  getRotationDirection,
  rotateMatrixClockwise,
  rotateMatrixCounterClockwise,
} from "@/cube.helpers";

const OFFSET = 1.1;

export const useCubeControl = () => {
  const {
    rendererRef,
    sceneRef,
    cameraRef,
    cubesRef,
    cubeColorsRef,
    cubeSize,
  } = useCube();

  const half = Math.floor(cubeSize / 2);

  function initCubes() {
    if (!sceneRef.current) return;

    const cubes: CubeData = [];

    cubeColorsRef.current = createCubeColors(cubeSize);

    for (let x = 0; x < cubeSize; x++) {
      cubes[x] = [];
      for (let y = 0; y < cubeSize; y++) {
        cubes[x][y] = [];
        for (let z = 0; z < cubeSize; z++) {
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const materials = Array.from(
            { length: 6 },
            () => new THREE.MeshBasicMaterial({ color: Color.NONE })
          );
          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(
            (x - half) * OFFSET,
            (y - half) * OFFSET,
            (z - half) * OFFSET
          );

          sceneRef.current.add(cube);
          cubes[x][y][z] = cube;
        }
      }
    }

    cubesRef.current = cubes;

    updateCubeColors();
    makeFaceLabels();
  }

  function makeFaceLabels() {
    if (!sceneRef.current) return;

    const labelData = [
      { face: Face.R, x: (half + 0.7) * OFFSET, y: 0, z: 0 },
      { face: Face.L, x: -(half + 0.7) * OFFSET, y: 0, z: 0 },
      { face: Face.U, x: 0, y: (half + 0.7) * OFFSET, z: 0 },
      { face: Face.D, x: 0, y: -(half + 0.7) * OFFSET, z: 0 },
      { face: Face.F, x: 0, y: 0, z: (half + 0.7) * OFFSET },
      { face: Face.B, x: 0, y: 0, z: -(half + 0.7) * OFFSET },
    ];

    for (const { face, x, y, z } of labelData) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 256;
      canvas.height = 256;

      context.font = "120px Arial";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(face, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(0.5, 0.5, 1);
      sprite.position.copy(new THREE.Vector3(x, y, z));

      sceneRef.current.add(sprite);
    }
  }

  function updateCubeColors() {
    if (!cubesRef.current) return;

    for (let x = 0; x < cubeSize; x++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let z = 0; z < cubeSize; z++) {
          const cube = cubesRef.current[x][y][z];
          const colors = getColorsByPosition(x, y, z);
          if (!colors) return;

          const materials = cube.material as THREE.MeshBasicMaterial[];
          for (let i = 0; i < 6; i++) {
            materials[i].color.set(colors[i]);
            materials[i].needsUpdate = true;
          }
        }
      }
    }
  }

  function getColorsByPosition(x: number, y: number, z: number) {
    if (!cubeColorsRef.current) return;

    const max = cubeSize - 1;
    const colors = [];

    colors[0] = x === max ? cubeColorsRef.current[Face.R][y][z] : Color.NONE;
    colors[1] = x === 0 ? cubeColorsRef.current[Face.L][y][z] : Color.NONE;
    colors[2] = y === max ? cubeColorsRef.current[Face.U][x][z] : Color.NONE;
    colors[3] = y === 0 ? cubeColorsRef.current[Face.D][x][z] : Color.NONE;
    colors[4] = z === max ? cubeColorsRef.current[Face.F][x][y] : Color.NONE;
    colors[5] = z === 0 ? cubeColorsRef.current[Face.B][x][y] : Color.NONE;

    return colors;
  }

  function rotateFace(face: Face, clockwise: boolean) {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const { faceGroup, addToFaceGroup, removeFromFaceGroup } =
      controlFaceGroup(face);

    addToFaceGroup();

    const axis = getRotationAxis(face);
    const direction = getRotationDirection(face, clockwise);
    const startRotation = faceGroup.rotation[axis];
    const targetRotation = startRotation + (direction * Math.PI) / 2; // 90도 회전
    const duration = 200; // ms
    const startTime = performance.now();

    function animate() {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current)
        return;

      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      faceGroup.rotation[axis] =
        startRotation + (targetRotation - startRotation) * t;

      rendererRef.current.render(sceneRef.current, cameraRef.current);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        removeFromFaceGroup();
        setCubeColorsAfterRotation(face, clockwise);
        updateCubeColors();
      }
    }

    animate();
  }

  function setCubeColorsAfterRotation(pivotFace: Face, clockwise: boolean) {
    if (!cubeColorsRef.current) return;

    const currentColors = cubeColorsRef.current[pivotFace];
    const isOpposite =
      pivotFace === Face.L || pivotFace === Face.U || pivotFace === Face.B;
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
    cubeColorsRef.current[pivotFace] = rotatedColors;

    const adjEdges = adjacentEdgesMap[pivotFace];
    const edges: Color[][] = adjEdges.map(({ face, edge, reverse }) => {
      let edgeColors = getEdgeColors(face, edge);
      const edgeReverse = clockwise ? reverse : !reverse;
      if (edgeReverse) edgeColors = edgeColors.slice().reverse();
      return edgeColors;
    });
    for (let i = 0; i < 4; i++) {
      const fromIndex = (i + (clockwise ? 3 : 1)) % 4;
      const to = adjEdges[i];
      const colorsToSet = edges[fromIndex];
      setEdgeColors(to.face, to.edge, colorsToSet);
    }
  }

  function controlFaceGroup(face: Face) {
    const faceGroup = new THREE.Group();

    let isIncluded: (x: number, y: number, z: number) => boolean;

    if (face === Face.R) isIncluded = (x, _y, _z) => x === cubeSize - 1;
    else if (face === Face.L) isIncluded = (x, _y, _z) => x === 0;
    else if (face === Face.U) isIncluded = (_x, y, _z) => y === cubeSize - 1;
    else if (face === Face.D) isIncluded = (_x, y, _z) => y === 0;
    else if (face === Face.F) isIncluded = (_x, _y, z) => z === cubeSize - 1;
    else isIncluded = (_x, _y, z) => z === 0;

    const addToFaceGroup = () => {
      if (!sceneRef.current || !cubesRef.current) return;

      for (let x = 0; x < cubeSize; x++) {
        for (let y = 0; y < cubeSize; y++) {
          for (let z = 0; z < cubeSize; z++) {
            const cube = cubesRef.current[x][y][z];
            if (isIncluded(x, y, z)) {
              faceGroup.add(cube);
            }
          }
        }
      }

      sceneRef.current.add(faceGroup);
    };

    const removeFromFaceGroup = () => {
      if (!sceneRef.current || !cubesRef.current) return;

      for (let x = 0; x < cubeSize; x++) {
        for (let y = 0; y < cubeSize; y++) {
          for (let z = 0; z < cubeSize; z++) {
            const cube = cubesRef.current[x][y][z];
            if (isIncluded(x, y, z)) {
              faceGroup.remove(cube);
              sceneRef.current.add(cube);
            }
          }
        }
      }
    };

    return { faceGroup, addToFaceGroup, removeFromFaceGroup };
  }

  function getEdgeColors(face: Face, edge: EdgePosition) {
    const matrix = cubeColorsRef.current![face];
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
    if (!cubeColorsRef.current) return;

    const matrix = cubeColorsRef.current[face];
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

  return { initCubes, rotateFace };
};
