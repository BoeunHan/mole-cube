"use client";

import { NICKNAME_KEY, USERID_KEY } from "@/constants";
import { localStorageUtil } from "@/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type GameSocketContextType = {
  socket: Socket | null;
  players: Record<string, string>;
  setNickname: (nickname: string) => void;
};

const GameSocketContext = createContext<GameSocketContextType | null>(null);

export const GameSocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Record<string, string>>({});

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
    });
    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected: ", s.id);
      // TODO: 연결 완료 toast
    });

    s.on("playersUpdate", (players) => {
      console.log("업데이트된 플레이어 목록: ", players);
      setPlayers(players);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const setNickname = (nickname: string) => {
    if (!socket) return;
    const userId = localStorageUtil.getValue(USERID_KEY);
    socket.emit("setNickname", { userId, nickname });

    localStorageUtil.setValue(NICKNAME_KEY, nickname);
  };

  return (
    <GameSocketContext.Provider
      value={{
        socket,
        players,
        setNickname,
      }}
    >
      {children}
    </GameSocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const ctx = useContext(GameSocketContext);
  if (!ctx)
    throw new Error(
      "useGameSocket must be used inside GameSocketContextProvider"
    );
  return ctx;
};
