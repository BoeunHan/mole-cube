"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

type AudioContextType = {
  playGameBGM: () => void;
  playSolvedBGM: () => void;
  pauseBGM: () => void;
  playClickEffect: () => void;
  playEnterEffect: () => void;
  playRotateEffect: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const playGameBGM = () => {
    if (!bgmRef.current) bgmRef.current = new Audio();
    else bgmRef.current.pause();

    if (bgmRef.current.src !== "/sounds/background.mp3") {
      bgmRef.current.src = "/sounds/background.mp3";
    }

    bgmRef.current.volume = 0.2;
    bgmRef.current.loop = true;
    bgmRef.current.play().catch(() => {});
  };

  const playSolvedBGM = () => {
    if (!bgmRef.current) bgmRef.current = new Audio();
    else bgmRef.current.pause();

    if (bgmRef.current.src !== "/sounds/solved.mp3") {
      bgmRef.current.src = "/sounds/solved.mp3";
    }

    bgmRef.current.volume = 0.4;
    bgmRef.current.playbackRate = 0.85;
    bgmRef.current.loop = false;
    bgmRef.current.play().catch(() => {});
  };

  const pauseBGM = () => {
    bgmRef.current?.pause();
  };

  const playClickEffect = () => {
    const effect = new Audio("/sounds/click.wav");
    effect.volume = 1;
    effect.play().catch(() => {});
  };

  const playEnterEffect = () => {
    const effect = new Audio("/sounds/digging.mp3");
    effect.volume = 0.7;
    effect.play().catch(() => {});
  };

  const playRotateEffect = () => {
    const effect = new Audio("/sounds/rotate.mp3");
    effect.volume = 0.2;
    effect.play().catch(() => {});
  };

  return (
    <AudioContext.Provider
      value={{
        playGameBGM,
        playSolvedBGM,
        pauseBGM,
        playClickEffect,
        playEnterEffect,
        playRotateEffect,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
