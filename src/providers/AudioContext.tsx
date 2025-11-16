"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

type AudioContextType = {
  playBGM: (src: string) => void;
  pauseBGM: () => void;
  playEffect: (src: string, volume?: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const playBGM = (src: string) => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio();
      bgmRef.current.volume = 0.4;
      bgmRef.current.loop = true;
    }

    bgmRef.current.pause();
    bgmRef.current.src = src;
    bgmRef.current.play().catch(() => {});
  };

  const pauseBGM = () => {
    bgmRef.current?.pause();
  };

  const playEffect = (src: string, volume: number = 1) => {
    const effect = new Audio(src);
    effect.volume = volume;
    effect.play().catch(() => {});
  };

  return (
    <AudioContext.Provider value={{ playBGM, pauseBGM, playEffect }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
