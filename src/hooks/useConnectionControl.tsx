"use client";

import { useEffect } from "react";
import { useGameSocket } from "../providers/GameSocketContext";
import { useAudio } from "../providers/AudioContext";

export const useConnectionControl = () => {
  const { emitLeaveGame } = useGameSocket();
  const { pauseBGM } = useAudio();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        emitLeaveGame();
        pauseBGM();
      } else {
        window.location.reload();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};
