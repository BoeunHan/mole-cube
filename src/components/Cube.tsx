"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CubeData } from "@/types";
import { COLORS } from "@/colors";

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

    // 씬(Scene) 만들기
    const scene = new THREE.Scene();

    // 카메라(Camera) 만들기
    const camera = new THREE.PerspectiveCamera(110, width / height, 0.1, 2000);
    camera.position.z = 5;

    // 렌더러(Renderer) 만들기
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xfafaf8);
    container.appendChild(renderer.domElement);

    // 큐브 그룹 생성 (전체 큐브를 하나로 그룹핑)
    const group = new THREE.Group();
    scene.add(group);

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

    // 조명 추가하기
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const animate = () => {
      renderer.render(scene, camera);
    };

    renderer.render(scene, camera);

    // 드래그
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
      renderer.setAnimationLoop(animate);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      // 회전 속도 조절 계수
      const rotationSpeed = 0.005;

      group.rotation.y += deltaMove.x * rotationSpeed;
      group.rotation.x += deltaMove.y * rotationSpeed;

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      renderer.setAnimationLoop(null);
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseUp);

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
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseUp);
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
      ? new THREE.MeshLambertMaterial({ color: COLORS.R })
      : new THREE.MeshLambertMaterial({ color: COLORS.NONE });

  materials[1] =
    x === 0
      ? new THREE.MeshLambertMaterial({ color: COLORS.L })
      : new THREE.MeshLambertMaterial({ color: COLORS.NONE });

  materials[2] =
    y === max
      ? new THREE.MeshLambertMaterial({ color: COLORS.U })
      : new THREE.MeshLambertMaterial({ color: COLORS.NONE });

  materials[3] =
    y === 0
      ? new THREE.MeshLambertMaterial({ color: COLORS.D })
      : new THREE.MeshLambertMaterial({ color: COLORS.NONE });

  materials[4] =
    z === max
      ? new THREE.MeshLambertMaterial({ color: COLORS.F })
      : new THREE.MeshLambertMaterial({ color: COLORS.NONE });

  materials[5] =
    z === 0
      ? new THREE.MeshLambertMaterial({ color: COLORS.B })
      : new THREE.MeshLambertMaterial({ color: COLORS.NONE });

  return materials;
}
