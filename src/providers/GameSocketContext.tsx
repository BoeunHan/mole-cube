"use client";

import { NICKNAME_KEY, USERID_KEY } from "@/constants";
import { useCubeControl } from "@/hooks/useCubeControl";
import { localStorageUtil } from "@/lib/utils";
import { CubeAction, CubeActionHistory, GameRoundState } from "@/types";
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
  playerNickname: Record<string, string>;
  gameRoundState?: GameRoundState;
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
  const [gameRoundState, setGameRoundState] = useState<GameRoundState>();
  const [playerNickname, setPlayerNickname] = useState<Record<string, string>>(
    {},
  );

  const emitSetNickname = (nickname: string) => {
    const userId = localStorageUtil.getValue(USERID_KEY);
    if (!socket || !userId) return;

    socket.emit("setNickname", { userId, nickname });
    localStorageUtil.setValue(NICKNAME_KEY, nickname);
  };

  const emitRotateCube = (action: CubeAction) => {
    if (!socket) return;
    socket.emit("rotateCube", action);
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

    s.on(
      "playersUpdate",
      ({
        players,
        playerNickname,
      }: {
        players: string[];
        playerNickname: Record<string, string>;
      }) => {
        console.log("업데이트된 플레이어 목록: ", players);
        setGameRoundState((state) => {
          if (!state) return;
          return {
            ...state,
            playerQueue: players,
          };
        });
        setPlayerNickname(playerNickname);
      },
    );

    s.on("cubeHistoryUpdate", (history: CubeActionHistory) => {
      console.log("회전 내역 업데이트: ", history);
      setGameRoundState((state) => {
        if (!state) return;
        return {
          ...state,
          actionHistories: [...state.actionHistories, history],
        };
      });
      rotateCube(history.action.face, history.action.clockwise);
    });

    s.on("initGameRound", (gameRound: GameRoundState) => {
      setGameRoundState(gameRound);
      initCubes(gameRound.faceColors);
    });

    return () => {
      s.off("connect");
      s.off("playersUpdate");
      s.off("cubeHistoryUpdate");
      s.off("initGameRound");
      s.disconnect();
    };
  }, []);

  return (
    <GameSocketContext.Provider
      value={{
        socket,
        playerNickname,
        gameRoundState,
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
      "useGameSocket must be used inside GameSocketContextProvider",
    );
  return ctx;
};
