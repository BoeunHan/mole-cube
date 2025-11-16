"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ToastData = {
  open: boolean;
  text: string;
  button?: {
    label: string;
    onClick: () => void;
  };
};

type ToastContextType = {
  data: ToastData;
  openToast: (
    text: string,
    button?: {
      label: string;
      onClick: () => void;
    },
  ) => void;
  closeToast: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ToastData>({ open: false, text: "" });

  const openToast = (
    text: string,
    button?: {
      label: string;
      onClick: () => void;
    },
  ) => {
    setData({ open: true, text, button });
  };

  const closeToast = () => {
    setData((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ data, openToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
