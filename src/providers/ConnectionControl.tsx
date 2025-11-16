"use client";

import { useEffect } from "react";
import { useGameSocket } from "./GameSocketContext";
import { useAudio } from "./AudioContext";

export const ConnectionControl = () => {
  const { emitLeaveGame } = useGameSocket();
  const { pauseBGM } = useAudio();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("leave game");
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

  return null;
};
