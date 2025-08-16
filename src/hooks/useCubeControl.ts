"use client";

import * as THREE from "three";
import { useCube } from "@/providers/CubeContext";
import { createCubeColors } from "@/constants/cube-colors";
import { CubeData } from "@/types";
import { Color, Face } from "@/enums";

const OFFSET = 1.1;

export const useCubeControl = (size: number) => {
  const { rendererRef, sceneRef, cameraRef, cubesRef, cubeColorsRef } =
    useCube();

  function initCubes() {
    if (!sceneRef.current) return;

    const cubes: CubeData = [];

    const half = Math.floor(size / 2);
    cubeColorsRef.current = createCubeColors(size);

    for (let x = 0; x < size; x++) {
      cubes[x] = [];
      for (let y = 0; y < size; y++) {
        cubes[x][y] = [];
        for (let z = 0; z < size; z++) {
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
  }

  function updateCubeColors() {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
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

    const max = size - 1;
    const colors = [];

    colors[0] = x === max ? cubeColorsRef.current[Face.R][y][z] : Color.NONE;
    colors[1] = x === 0 ? cubeColorsRef.current[Face.L][y][z] : Color.NONE;
    colors[2] = y === max ? cubeColorsRef.current[Face.U][x][z] : Color.NONE;
    colors[3] = y === 0 ? cubeColorsRef.current[Face.D][x][z] : Color.NONE;
    colors[4] = z === max ? cubeColorsRef.current[Face.F][x][y] : Color.NONE;
    colors[5] = z === 0 ? cubeColorsRef.current[Face.B][x][y] : Color.NONE;

    return colors;
  }

  return { initCubes };
};
