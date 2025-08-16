"use client";

import { CubeData } from "@/types";
import { createContext, ReactNode, useContext, useRef } from "react";
import * as THREE from "three";

type CubeContextType = {
  cubes: CubeData;
  size: number;
  half: number;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.Camera | null>;
  cubesRef: React.RefObject<CubeData>;
};

const CubeContext = createContext<CubeContextType | null>(null);

export const CubeProvider = ({
  children,
  size,
}: {
  children: ReactNode;
  size: number;
}) => {
  const cubes: CubeData = [];

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const cubesRef = useRef<CubeData>([]);

  return (
    <CubeContext.Provider
      value={{
        cubes,
        size,
        half: Math.floor(size / 2),
        rendererRef,
        sceneRef,
        cameraRef,
        cubesRef,
      }}
    >
      {children}
    </CubeContext.Provider>
  );
};

export const useCube = () => {
  const ctx = useContext(CubeContext);
  if (!ctx) throw new Error("useCube must be used inside CubeProvider");
  return ctx;
};
