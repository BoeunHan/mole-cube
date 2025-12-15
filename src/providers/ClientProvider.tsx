"use client";

import { GameSocketContextProvider } from "@/providers/GameSocketContext";
import { CubeProvider } from "@/providers/CubeContext";
import { AudioProvider } from "@/providers/AudioContext";
import { NicknameDialog } from "@/components/NicknameDialog";
import { ConnectionControl } from "@/providers/ConnectionControl";
import { ToastProvider } from "@/providers/ToastContext";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <AudioProvider>
        <CubeProvider>
          <GameSocketContextProvider>
            <ConnectionControl />
            <NicknameDialog />
            {children}
          </GameSocketContextProvider>
        </CubeProvider>
      </AudioProvider>
    </ToastProvider>
  );
};
