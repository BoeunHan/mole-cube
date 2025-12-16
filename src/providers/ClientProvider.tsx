"use client";

import { GameSocketContextProvider } from "@/providers/GameSocketContext";
import { CubeProvider } from "@/providers/CubeContext";
import { AudioProvider } from "@/providers/AudioContext";
import { NicknameDialog } from "@/components/NicknameDialog";
import { ConnectionControl } from "@/providers/ConnectionControl";
import { ToastManager, ToastProvider } from "mole-toast";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <AudioProvider>
        <CubeProvider>
          <GameSocketContextProvider>
            <ConnectionControl />
            <NicknameDialog />
            <div className="font-neodgm">
              <ToastManager />
            </div>
            {children}
          </GameSocketContextProvider>
        </CubeProvider>
      </AudioProvider>
    </ToastProvider>
  );
};
