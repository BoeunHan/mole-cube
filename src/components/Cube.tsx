"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CubeData } from "@/types";
import { Color, CUBE_COLORS } from "@/colors";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";

const cubes: CubeData = [];
const offset = 1.1;
const size = 3;

export const Cube = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 씬
    const scene = new THREE.Scene();

    // 조명
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 3, 20);
    // scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // 카메라
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.z = 12;
    camera.add(light);
    scene.add(camera);

    // 렌더러
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xfafaf8);
    container.appendChild(renderer.domElement);

    // 큐브 그룹 생성 (전체 큐브를 하나로 그룹핑)
    const group = new THREE.Group();
    scene.add(group);

    group.rotation.x = Math.PI / 10;
    group.rotation.y = -Math.PI / 10;

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

          group.add(cube);
          cubes[x][y][z] = cube;
        }
      }
    }

    // 드래그
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 2;
    controls.noZoom = true;
    controls.noPan = true;

    makeFaceLabel("R", new THREE.Vector3((half + 0.7) * offset, 0, 0), group);
    makeFaceLabel("L", new THREE.Vector3(-(half + 0.7) * offset, 0, 0), group);
    makeFaceLabel("U", new THREE.Vector3(0, (half + 0.7) * offset, 0), group);
    makeFaceLabel("D", new THREE.Vector3(0, -(half + 0.7) * offset, 0), group);
    makeFaceLabel("F", new THREE.Vector3(0, 0, (half + 0.7) * offset), group);
    makeFaceLabel("B", new THREE.Vector3(0, 0, -(half + 0.7) * offset), group);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // 리사이즈 핸들러 함수
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", handleResize);

    // 클린업 함수 (컴포넌트 언마운트 시 정리)
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

function getMaterialsByPosition(x: number, y: number, z: number, size: number) {
  const max = size - 1;

  const materials = [];

  materials[0] =
    x === max
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS.R[y][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[1] =
    x === 0
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS.L[y][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[2] =
    y === max
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS.U[x][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[3] =
    y === 0
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS.D[x][z] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[4] =
    z === max
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS.F[x][y] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  materials[5] =
    z === 0
      ? new THREE.MeshLambertMaterial({ color: CUBE_COLORS.B[x][y] })
      : new THREE.MeshLambertMaterial({ color: Color.NONE });

  return materials;
}

function makeFaceLabel(
  text: string,
  offset: THREE.Vector3,
  parent: THREE.Object3D
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

  parent.add(sprite);
  return sprite;
}
