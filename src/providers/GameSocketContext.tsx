"use client";

import { NICKNAME_KEY } from "@/constants";
import { useCubeControl } from "@/hooks/useCubeControl";
import { getUserId, localStorageUtil } from "@/lib/utils";
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
  userId: string;
  socket: Socket | null;
  playerNickname: Record<string, string>;
  gameRoundState?: GameRoundState;
  isSolved: boolean;
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

  const [userId, setUserId] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameRoundState, setGameRoundState] = useState<GameRoundState>();
  const [isSolved, setIsSolved] = useState(false);
  const [playerNickname, setPlayerNickname] = useState<Record<string, string>>(
    {},
  );

  const emitSetNickname = (nickname: string) => {
    if (!socket || !userId) return;

    socket.emit("setNickname", { userId, nickname });
    localStorageUtil.setValue(NICKNAME_KEY, nickname);
  };

  const emitRotateCube = (action: CubeAction) => {
    if (!socket) return;
    socket.emit("rotateCube", action);
  };

  useEffect(() => {
    if (!userId) return;

    const s = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      auth: { userId },
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
      setGameRoundState((state) => {
        if (!state) return;
        return {
          ...state,
          actionHistories: [...state.actionHistories, history],
        };
      });
      rotateCube(history.action.face, history.action.clockwise);
    });

    s.on(
      "turnUpdated",
      ({
        currentPlayerId,
        timerEndTime,
      }: {
        currentPlayerId: string;
        timerEndTime: number;
      }) => {
        setGameRoundState((state) => {
          if (!state) return;
          return {
            ...state,
            currentPlayerId,
            timerEndTime,
          };
        });
      },
    );

    s.on("setGameRound", (roundState: GameRoundState) => {
      setGameRoundState(roundState);
      initCubes(roundState.faceColors);
      setIsSolved(false);
    });

    s.on("solved", (roundState: GameRoundState) => {
      setGameRoundState(roundState);
      setIsSolved(true);
    });

    return () => {
      s.off("connect");
      s.off("playersUpdate");
      s.off("cubeHistoryUpdate");
      s.off("setGameRound");
      s.off("solved");
      s.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      if (userId) setUserId(userId);
    };
    fetchUserId();
  }, []);

  return (
    <GameSocketContext.Provider
      value={{
        userId,
        socket,
        playerNickname,
        gameRoundState,
        isSolved,
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
