"use client";

import * as THREE from "three";
import { useCube } from "@/providers/CubeContext";
import { CubeData } from "@/types";
import { Color, Face } from "@/enums";
import { getRotationAxis, getRotationDirection } from "@/cube.helpers";
import { CubeStatus } from "@/cube-status";
const OFFSET = 1.1;

export const useCubeControl = () => {
  const { rendererRef, sceneRef, cameraRef, cubesRef, cubeStatusRef } =
    useCube();

  function initCubes(cubeColors: Record<Face, Color[][]>) {
    if (!sceneRef.current) return;

    cubeStatusRef.current = new CubeStatus(cubeColors);
    const size = cubeStatusRef.current!.getSize();
    const half = Math.floor(size / 2);
    const cubes: CubeData = [];

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
    makeFaceLabels();
  }

  function rerender() {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }

  function makeFaceLabels() {
    if (!sceneRef.current || !cubeStatusRef.current) return;

    const size = cubeStatusRef.current.getSize();
    const half = Math.floor(size / 2);

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

    rerender();
  }

  function updateCubeColors() {
    if (!cubesRef.current || !cubeStatusRef.current) return;

    const size = cubeStatusRef.current.getSize();

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
    rerender();
  }

  function getColorsByPosition(x: number, y: number, z: number) {
    if (!cubeStatusRef.current) return;
    const size = cubeStatusRef.current.getSize()!;

    const faceColors = cubeStatusRef.current.faceColors;

    const max = size - 1;
    const colors = [];

    colors[0] = x === max ? faceColors[Face.R][y][z] : Color.NONE;
    colors[1] = x === 0 ? faceColors[Face.L][y][z] : Color.NONE;
    colors[2] = y === max ? faceColors[Face.U][x][z] : Color.NONE;
    colors[3] = y === 0 ? faceColors[Face.D][x][z] : Color.NONE;
    colors[4] = z === max ? faceColors[Face.F][x][y] : Color.NONE;
    colors[5] = z === 0 ? faceColors[Face.B][x][y] : Color.NONE;

    return colors;
  }

  function rotateCube(face: Face, clockwise: boolean) {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const control = controlFaceGroup(face);
    if (!control) return;

    const { faceGroup, addToFaceGroup, removeFromFaceGroup } = control;
    addToFaceGroup();

    const axis = getRotationAxis(face);
    const direction = getRotationDirection(face, clockwise);
    const startRotation = faceGroup.rotation[axis];
    const targetRotation = startRotation + (direction * Math.PI) / 2; // 90도 회전
    const duration = 200; // ms
    const startTime = performance.now();

    function animate() {
      if (
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current ||
        !cubeStatusRef.current
      )
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
        cubeStatusRef.current.rotateCubeFace(face, clockwise);
        updateCubeColors();
      }
    }

    animate();
  }

  function controlFaceGroup(face: Face) {
    if (!cubeStatusRef.current) return;
    const size = cubeStatusRef.current.getSize();

    const faceGroup = new THREE.Group();

    let isIncluded: (x: number, y: number, z: number) => boolean;

    if (face === Face.R) isIncluded = (x, _y, _z) => x === size - 1;
    else if (face === Face.L) isIncluded = (x, _y, _z) => x === 0;
    else if (face === Face.U) isIncluded = (_x, y, _z) => y === size - 1;
    else if (face === Face.D) isIncluded = (_x, y, _z) => y === 0;
    else if (face === Face.F) isIncluded = (_x, _y, z) => z === size - 1;
    else isIncluded = (_x, _y, z) => z === 0;

    const addToFaceGroup = () => {
      if (!sceneRef.current || !cubesRef.current) return;

      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          for (let z = 0; z < size; z++) {
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
      if (!sceneRef.current || !cubesRef.current || !cubeStatusRef.current)
        return;

      const size = cubeStatusRef.current.getSize();
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          for (let z = 0; z < size; z++) {
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

  return { initCubes, rotateCube };
};
