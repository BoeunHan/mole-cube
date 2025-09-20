"use client";

import { NICKNAME_KEY, USERID_KEY } from "@/constants";
import { useCubeControl } from "@/hooks/useCubeControl";
import { localStorageUtil } from "@/lib/utils";
import { CubeAction } from "@/types";
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
  histories: any[];
  emitSetNickname: (nickname: string) => void;
  emitRotateCube: (action: CubeAction) => void;
};

const GameSocketContext = createContext<GameSocketContextType | null>(null);

export const GameSocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { rotateCube, initCubes } = useCubeControl();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Record<string, string>>({});
  const [histories, setHistories] = useState([]);

  const emitSocketWithUserId = (eventName: string, payload?: any) => {
    const userId = localStorageUtil.getValue(USERID_KEY);
    if (!socket || !userId) return null;

    socket.emit(eventName, { userId, ...payload });
  };

  const emitSetNickname = (nickname: string) => {
    emitSocketWithUserId("setNickname", { nickname });
    localStorageUtil.setValue(NICKNAME_KEY, nickname);
  };

  const emitRotateCube = (action: CubeAction) => {
    emitSocketWithUserId("rotateCube", action);
  };

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

    s.on("rotateCube:server", (action) => {
      console.log("회전 이벤트 구독");
      rotateCube(action.face, action.clockwise);
    });

    s.on("initCubeState", (colors) => {
      console.log("큐브 초기화 데이터: ", colors);
      initCubes(colors);
    });

    return () => {
      s.off("connect");
      s.off("playersUpdate");
      s.disconnect();
    };
  }, []);

  return (
    <GameSocketContext.Provider
      value={{
        socket,
        players,
        histories,
        emitSetNickname,
        emitRotateCube,
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
