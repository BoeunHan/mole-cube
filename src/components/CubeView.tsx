"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { useCube } from "@/providers/CubeContext";
import { isMobile } from "@/lib/utils";

export const CubeView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { sceneRef, cameraRef, rendererRef, controlsRef } = useCube();

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
    sceneRef.current.add(new THREE.AmbientLight(0xffffff, 1));

    // 카메라
    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      width / height,
      0.1,
      2000,
    );
    cameraRef.current.add(light);
    sceneRef.current.add(cameraRef.current);

    // 렌더러
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(width, height);
    container.appendChild(rendererRef.current.domElement);

    // 드래그
    controlsRef.current = new TrackballControls(
      cameraRef.current,
      rendererRef.current.domElement,
    );

    controlsRef.current.rotateSpeed = isMobile() ? 2 : 14;
    controlsRef.current.noZoom = true;
    controlsRef.current.noPan = true;
    controlsRef.current.staticMoving = true;

    const handleControlStart = () => {
      rendererRef.current?.setAnimationLoop(animate);
    };

    const handleControlEnd = () => {
      rendererRef.current?.setAnimationLoop(null);
    };

    controlsRef.current.addEventListener("start", handleControlStart);
    controlsRef.current.addEventListener("end", handleControlEnd);

    const animate = () => {
      controlsRef.current?.update();
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
      controlsRef.current?.removeEventListener("start", handleControlStart);
      controlsRef.current?.removeEventListener("end", handleControlEnd);

      rendererRef.current?.dispose();
      if (container && rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-10"></div>;
};
