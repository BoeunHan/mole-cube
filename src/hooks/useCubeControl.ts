"use client";

import * as THREE from "three";
import { useCube } from "@/providers/CubeContext";
import { CubeData } from "@/types";
import { Color, Face } from "@/enums";
import { getRotationAxis, getRotationDirection } from "@/cube.helpers";
import { CubeStatus } from "@/cube-status";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useAudio } from "@/providers/AudioContext";
const OFFSET = 1.05;

export const useCubeControl = () => {
  const { playRotateEffect } = useAudio();
  const {
    rendererRef,
    sceneRef,
    cameraRef,
    cubesRef,
    cubeStatusRef,
    controlsRef,
  } = useCube();

  function initCubes(cubeColors: Record<Face, Color[][]>) {
    controlsRef.current?.reset();
    cameraRef.current?.position.set(-6, 6, 12);
    cameraRef.current?.lookAt(new THREE.Vector3(0, 0, 0));

    removeOldCubes();
    removeOldLabels();
    cubeStatusRef.current = new CubeStatus(cubeColors);
    createNewCubes();
    updateCubeColors();
    createFaceLabels();

    rerender();
  }

  function rerender() {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }

  function removeOldCubes() {
    if (!sceneRef.current) return;
    if (cubesRef.current) {
      const oldCubes = cubesRef.current;
      const size = oldCubes.length;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          for (let z = 0; z < size; z++) {
            const cube = oldCubes[x][y][z];
            sceneRef.current.remove(cube);
            // 메모리 해제
            if (cube.geometry) cube.geometry.dispose();
            if (cube.material) {
              if (Array.isArray(cube.material)) {
                cube.material.forEach((m) => m.dispose());
              } else {
                cube.material.dispose();
              }
            }
          }
        }
      }
    }
  }

  function removeOldLabels() {
    if (!sceneRef.current) return;
    sceneRef.current.children
      .filter((obj) => obj.type === "Sprite" && obj.name === "FaceLabel")
      .forEach((sprite) => {
        if (!sceneRef.current) return;
        sceneRef.current.remove(sprite);
        const material = (sprite as THREE.Sprite)
          .material as THREE.SpriteMaterial;
        if (material.map) material.map.dispose();
        material.dispose();
      });
  }

  function createNewCubes() {
    if (!sceneRef.current || !cubeStatusRef.current) return;

    const size = cubeStatusRef.current.getSize();
    const half = Math.floor(size / 2);
    const cubes: CubeData = [];

    for (let x = 0; x < size; x++) {
      cubes[x] = [];
      for (let y = 0; y < size; y++) {
        cubes[x][y] = [];
        for (let z = 0; z < size; z++) {
          const geometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.2);
          const materials = Array.from(
            { length: 6 },
            () => new THREE.MeshBasicMaterial({ color: Color.NONE }),
          );
          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(
            (x - half) * OFFSET,
            (y - half) * OFFSET,
            (z - half) * OFFSET,
          );
          sceneRef.current.add(cube);
          cubes[x][y][z] = cube;
        }
      }
    }

    cubesRef.current = cubes;
  }

  async function createFaceLabels() {
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

    const canvasSize = 216;
    const dpr = window.devicePixelRatio || 1;

    for (const { face, x, y, z } of labelData) {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize * dpr;
      canvas.height = canvasSize * dpr;
      const context = canvas.getContext("2d")!;
      context.scale(dpr, dpr);

      context.font = "bold 90px 'Courier New'";
      context.fillStyle = "#111111";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(face, canvasSize / 2, canvasSize / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      const sprite = new THREE.Sprite(material);
      sprite.name = "FaceLabel";

      sprite.scale.set(1, 1, 1);

      sprite.position.set(x, y, z);

      sceneRef.current.add(sprite);
    }
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
    playRotateEffect();
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
              sceneRef.current.remove(cube);
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
      sceneRef.current.remove(faceGroup);
    };

    return { faceGroup, addToFaceGroup, removeFromFaceGroup };
  }

  return { initCubes, rotateCube };
};
