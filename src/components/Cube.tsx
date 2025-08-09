"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CubeData } from "@/types";
import { Color, CUBE_COLORS, Face } from "@/colors";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

const cubes: CubeData = [];
const offset = 1.1;
const size = 3;

export const Cube = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 씬
    sceneRef.current = new THREE.Scene();

    // 조명
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 3, 20);
    // scene.add(light);
    sceneRef.current.add(new THREE.AmbientLight(0xffffff, 1));

    // 카메라
    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      2000
    );
    cameraRef.current.position.z = 12;
    cameraRef.current.add(light);
    sceneRef.current.add(cameraRef.current);

    // 렌더러
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setClearColor(0xfafaf8);
    container.appendChild(rendererRef.current.domElement);

    // 큐브(박스) 만들기
    const half = Math.floor(size / 2);
    for (let x = 0; x < size; x++) {
      cubes[x] = [];
      for (let y = 0; y < size; y++) {
        cubes[x][y] = [];
        for (let z = 0; z < size; z++) {
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const materials = getMaterialsByPosition(x, y, z, size);
          const cube = new THREE.Mesh(geometry, materials);

          cube.position.set(
            (x - half) * offset,
            (y - half) * offset,
            (z - half) * offset
          );

          sceneRef.current.add(cube);
          cubes[x][y][z] = cube;
        }
      }
    }

    // 라벨
    makeFaceLabel(
      "R",
      new THREE.Vector3((half + 0.7) * offset, 0, 0),
      sceneRef.current
    );
    makeFaceLabel(
      "L",
      new THREE.Vector3(-(half + 0.7) * offset, 0, 0),
      sceneRef.current
    );
    makeFaceLabel(
      "U",
      new THREE.Vector3(0, (half + 0.7) * offset, 0),
      sceneRef.current
    );
    makeFaceLabel(
      "D",
      new THREE.Vector3(0, -(half + 0.7) * offset, 0),
      sceneRef.current
    );
    makeFaceLabel(
      "F",
      new THREE.Vector3(0, 0, (half + 0.7) * offset),
      sceneRef.current
    );
    makeFaceLabel(
      "B",
      new THREE.Vector3(0, 0, -(half + 0.7) * offset),
      sceneRef.current
    );

    // 드래그
    const controls = new TrackballControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controls.rotateSpeed = 20;
    controls.noZoom = true;
    controls.noPan = true;

    const handleControlStart = () => {
      rendererRef.current?.setAnimationLoop(animate);
    };

    const handleControlEnd = () => {
      rendererRef.current?.setAnimationLoop(null);
    };

    controls.addEventListener("start", handleControlStart);
    controls.addEventListener("end", handleControlEnd);

    const animate = () => {
      controls.update();
      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);
    };

    rendererRef.current.render(sceneRef.current, cameraRef.current);

    // 리사이즈 핸들러 함수
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (cameraRef.current && sceneRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current?.setSize(width, height);
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
      }
    };

    window.addEventListener("resize", handleResize);

    // 클린업 함수 (컴포넌트 언마운트 시 정리)
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("start", handleControlStart);
      controls.removeEventListener("end", handleControlEnd);

      rendererRef.current?.dispose();
      if (container && rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        <button
          className="cursor-pointer"
          onClick={() => {
            if (rendererRef.current && sceneRef.current && cameraRef.current)
              rotateFace90(
                cubes,
                Face.R,
                rendererRef.current,
                sceneRef.current,
                cameraRef.current
              );
          }}
        >
          R 시계방향으로 회전
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            if (rendererRef.current && sceneRef.current && cameraRef.current)
              rotateFace90(
                cubes,
                Face.B,
                rendererRef.current,
                sceneRef.current,
                cameraRef.current
              );
          }}
        >
          B 시계방향으로 회전
        </button>
        <button
          className="cursor-pointer"
          onClick={() => {
            if (rendererRef.current && sceneRef.current && cameraRef.current)
              rotateFace90(
                cubes,
                Face.U,
                rendererRef.current,
                sceneRef.current,
                cameraRef.current
              );
          }}
        >
          U 시계방향으로 회전
        </button>
      </div>
    </>
  );
};

function getMaterialsByPosition(x: number, y: number, z: number, size: number) {
  const max = size - 1;

  const materials = [];

  materials[0] =
    x === max
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS[Face.R][y][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[1] =
    x === 0
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS[Face.L][y][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[2] =
    y === max
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS[Face.U][x][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[3] =
    y === 0
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS[Face.D][x][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[4] =
    z === max
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS[Face.F][x][y] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[5] =
    z === 0
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS[Face.B][x][y] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  return materials;
}

function makeFaceLabel(
  text: string,
  offset: THREE.Vector3,
  scene: THREE.Scene
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = 256;
  canvas.height = 256;

  context.font = "120px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.5, 1);
  sprite.position.copy(offset);

  scene.add(sprite);
  return sprite;
}

function rotateFace90(
  cubes: CubeData,
  face: Face,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  const { faceGroup, removeFromFaceGroup } = controlFaceGroup(
    cubes,
    face,
    scene
  );
  scene.add(faceGroup);
  const axis = getRotationAxis(face);
  const startRotation = faceGroup.rotation[axis];
  const direction = getRotationDirection(face);
  const targetRotation = startRotation + (direction * Math.PI) / 2; // 90도 회전
  const duration = 200; // ms
  const startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    faceGroup.rotation[axis] =
      startRotation + (targetRotation - startRotation) * t;

    renderer.render(scene, camera);

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      removeFromFaceGroup();
    }
  }

  animate();
}

function controlFaceGroup(cubes: CubeData, face: Face, scene: THREE.Scene) {
  const faceGroup = new THREE.Group();

  let condition: (x: number, y: number, z: number) => boolean;

  if (face === Face.R) condition = (x, _y, _z) => x === size - 1;
  else if (face === Face.L) condition = (x, _y, _z) => x === 0;
  else if (face === Face.U) condition = (_x, y, _z) => y === size - 1;
  else if (face === Face.D) condition = (_x, y, _z) => y === 0;
  else if (face === Face.F) condition = (_x, _y, z) => z === size - 1;
  else condition = (_x, _y, z) => z === 0;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        const cube = cubes[x][y][z];
        if (condition(x, y, z)) {
          faceGroup.add(cube);
        }
      }
    }
  }

  const removeFromFaceGroup = () => {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const cube = cubes[x][y][z];
          if (condition(x, y, z)) {
            faceGroup.remove(cube);
            scene.add(cube);
          }
        }
      }
    }
  };

  return { faceGroup, removeFromFaceGroup };
}

function getRotationAxis(face: Face): "x" | "y" | "z" {
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

function getRotationDirection(face: Face): 1 | -1 {
  switch (face) {
    case Face.U:
    case Face.R:
    case Face.F:
      return -1; // 시계방향
    case Face.D:
    case Face.L:
    case Face.B:
      return 1; // 반시계방향
  }
}
