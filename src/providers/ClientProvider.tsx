"use client";

import { GameSocketContextProvider } from "@/providers/GameSocketContext";
import { CubeProvider } from "@/providers/CubeContext";
import { AudioProvider } from "@/providers/AudioContext";
import { ToastProvider } from "mole-toast";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <AudioProvider>
        <CubeProvider>
          <GameSocketContextProvider>{children}</GameSocketContextProvider>
        </CubeProvider>
      </AudioProvider>
    </ToastProvider>
  );
};
