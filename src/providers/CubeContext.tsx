"use client";

import { CubeStatus } from "@/cube-status";
import { CubeData } from "@/types";
import { createContext, ReactNode, useContext, useRef } from "react";
import * as THREE from "three";

type CubeContextType = {
  cubesRef: React.RefObject<CubeData | null>;
  cubeStatusRef: React.RefObject<CubeStatus | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
};

const CubeContext = createContext<CubeContextType | null>(null);

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const cubesRef = useRef<CubeData | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeStatusRef = useRef<CubeStatus | null>(null);

  return (
    <CubeContext.Provider
      value={{
        rendererRef,
        sceneRef,
        cameraRef,
        cubesRef,
        cubeStatusRef,
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
