"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Cube = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. 씬(Scene) 만들기
    const scene = new THREE.Scene();

    // 2. 카메라(Camera) 만들기
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.z = 5;

    // 3. 렌더러(Renderer) 만들기
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xfafaf8);
    container.appendChild(renderer.domElement);

    // 4. 큐브(박스) 만들기
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffc4b7 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 5. 애니메이션 루프 만들기
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // 6. 클린업 함수 (컴포넌트 언마운트 시 정리)
    return () => {
      renderer.dispose();
      container?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};
