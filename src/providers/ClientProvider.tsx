"use client";

import { GameSocketContextProvider } from "@/providers/GameSocketContext";
import { CubeProvider } from "@/providers/CubeContext";
import { AudioProvider } from "@/providers/AudioContext";
import { ToastProvider } from "mole-toast";
import { ConnectionControl } from "./ConnectionControl";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <AudioProvider>
        <CubeProvider>
          <GameSocketContextProvider>
            <ConnectionControl />
            {children}
          </GameSocketContextProvider>
        </CubeProvider>
      </AudioProvider>
    </ToastProvider>
  );
};
