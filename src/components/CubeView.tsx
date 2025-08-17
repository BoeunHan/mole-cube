"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { useCubeControl } from "@/hooks/useCubeControl";
import { useCube } from "@/providers/CubeContext";

export const CubeView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { sceneRef, cameraRef, rendererRef, setCubeSize } = useCube();

  const { initCubes } = useCubeControl();

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
    setCubeSize(3);
    initCubes();

    // 드래그
    const controls = new TrackballControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controls.rotateSpeed = 5;
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
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
  );
};
