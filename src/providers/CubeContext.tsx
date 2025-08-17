"use client";

import { Color, Face } from "@/enums";
import { CubeData } from "@/types";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import * as THREE from "three";

type CubeContextType = {
  cubesRef: React.RefObject<CubeData | null>;
  cubeColorsRef: React.RefObject<Record<Face, Color[][]> | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  cubeSize: number;
  setCubeSize: (size: number) => void;
};

const CubeContext = createContext<CubeContextType | null>(null);

export const CubeProvider = ({ children }: { children: ReactNode }) => {
  const cubesRef = useRef<CubeData | null>(null);
  const cubeColorsRef = useRef<Record<Face, Color[][]> | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [cubeSize, setCubeSize] = useState(3);

  return (
    <CubeContext.Provider
      value={{
        cubeSize,
        setCubeSize,
        rendererRef,
        sceneRef,
        cameraRef,
        cubesRef,
        cubeColorsRef,
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
