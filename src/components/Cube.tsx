"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CubeData } from "@/types";

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

    // 큐브(박스) 만들기
    const half = Math.floor(size / 2);
    for (let x = 0; x < size; x++) {
      cubes[x] = [];
      for (let y = 0; y < size; y++) {
        cubes[x][y] = [];
        for (let z = 0; z < size; z++) {
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshLambertMaterial({ color: 0xffc4b7 });
          const cube = new THREE.Mesh(geometry, material);

          cube.position.set(
            (x - half) * offset,
            (y - half) * offset,
            (z - half) * offset
          );

          scene.add(cube);
          cubes[x][y][z] = cube;
        }
      }
    }

    // 조명 추가하기
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(0, 0, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    renderer.render(scene, camera);

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
      renderer.dispose();
      container?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};
