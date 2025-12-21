"use client";

import { XIcon } from "lucide-react";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Overlay = ({ open, onClose, children }: OverlayProps) => {
  if (!open) return null;

  return (
    <div
      className="game-container z-[999] flex items-center justify-center bg-black/40"
      onClick={() => onClose()}
    >
      <div
        className="overlay-paper relative h-[calc(100%-100px)] w-[calc(100%-40px)] max-w-[400px] @md:max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <XIcon
          className="absolute top-0 right-0 hover:cursor-pointer"
          onClick={() => onClose()}
        />
        {children}
      </div>
    </div>
  );
};
