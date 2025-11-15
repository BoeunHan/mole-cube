"use client";

import { useCubeControl } from "@/hooks/useCubeControl";
import { getUserId } from "@/lib/utils";
import { CubeAction, CubeActionHistory, GameRoomState } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type GameSocketContextType = {
  userId: string;
  socket: Socket | null;
  gameRoomState?: GameRoomState;
  isSolved: boolean;
  emotions: Record<string, string>;
  coin: { delta: number; total: number };
  emitJoinGame: (nickname: string) => void;
  emitRotateCube: (action: CubeAction) => void;
  emitSendEmotion: (emotion: string) => void;
};

const GameSocketContext = createContext<GameSocketContextType | null>(null);

export const GameSocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { rotateCube, initCubes } = useCubeControl();

  const socketRef = useRef<Socket | null>(null);
  const [userId, setUserId] = useState("");
  const [gameRoomState, setGameRoomState] = useState<GameRoomState>();
  const [isSolved, setIsSolved] = useState(false);
  const [emotions, setEmotions] = useState<Record<string, string>>({});
  const [coin, setCoin] = useState<{ delta: number; total: number }>({
    delta: 0,
    total: 0,
  });

  const emitJoinGame = (nickname: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("joinGame", { nickname });
  };

  const emitRotateCube = (action: CubeAction) => {
    if (!socketRef.current) return;
    socketRef.current.emit("rotateCube", action);
  };

  const emitSendEmotion = (emotion: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("sendEmotion", emotion);
  };

  useEffect(() => {
    if (!userId) return;

    const s = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      auth: { userId },
    });
    socketRef.current = s;

    s.on(
      "playersUpdated",
      (payload: {
        players: string[];
        currentPlayerId: string | null;
        currentPlayerNickname: string;
        timerEndTime: number;
        timerTotalTime: number;
        serverNow: number;
      }) => {
        const timeDiff = payload.serverNow - Date.now();
        setGameRoomState((state) => {
          if (!state) return;
          return {
            ...state,
            players: payload.players,
            currentPlayerId: payload.currentPlayerId,
            currentPlayerNickname: payload.currentPlayerNickname,
            timerEndTime: payload.timerEndTime - timeDiff,
            timerTotalTime: payload.timerTotalTime,
          };
        });
      },
    );

    s.on("cubeHistoryUpdated", (history: CubeActionHistory) => {
      setGameRoomState((state) => {
        if (!state) return state;
        return {
          ...state,
          roundState: {
            ...state.roundState,
            actionHistories: [...state.roundState.actionHistories, history],
          },
        };
      });

      rotateCube(history.action.face, history.action.clockwise);
    });

    s.on(
      "turnUpdated",
      (payload: {
        currentPlayerId: string;
        currentPlayerNickname: string;
        timerTotalTime: number;
        timerEndTime: number;
        serverNow: number;
      }) => {
        const timeDiff = payload.serverNow - Date.now();
        setGameRoomState((state) => {
          if (!state) return;
          return {
            ...state,
            currentPlayerId: payload.currentPlayerId,
            currentPlayerNickname: payload.currentPlayerNickname,
            timerTotalTime: payload.timerTotalTime,
            timerEndTime: payload.timerEndTime - timeDiff,
          };
        });
      },
    );

    s.on(
      "setGameRound",
      ({
        serverNow,
        coin,
        ...roomState
      }: GameRoomState & { coin: number; serverNow: number }) => {
        const timeDiff = serverNow - Date.now();
        setGameRoomState({
          ...roomState,
          timerEndTime: roomState.timerEndTime - timeDiff,
        });
        setCoin((prev) => {
          if (prev.total === coin) return prev;
          return { total: coin, delta: 0 };
        });
        initCubes(roomState.roundState.cubeStatus.faceColors);
        if (roomState.roundState.status !== "solved") setIsSolved(false);
      },
    );

    s.on(
      "solved",
      ({ serverNow, ...roomState }: GameRoomState & { serverNow: number }) => {
        const timeDiff = serverNow - Date.now();
        setTimeout(() => {
          setGameRoomState({
            ...roomState,
            timerEndTime: roomState.timerEndTime - timeDiff,
          });
          setIsSolved(true);
        }, 300);
      },
    );

    s.on(
      "showEmotion",
      ({ userId, emotion }: { userId: string; emotion: string }) => {
        setEmotions((prev) => {
          if (prev[userId]) return prev;

          setTimeout(() => {
            setEmotions((prev) => {
              const newState = { ...prev };
              delete newState[userId];
              return newState;
            });
          }, 3000);

          return { ...prev, [userId]: emotion };
        });
      },
    );

    s.on("updateCoin", (coin: number) => {
      setCoin((prev) => {
        const delta = coin - prev.total;
        if (delta === 0) return prev;
        if (delta >= 0) {
          // TODO: 토스점수 업데이트
        }
        return {
          total: coin,
          delta,
        };
      });
    });

    return () => {
      s.off("playersUpdated");
      s.off("turnUpdated");
      s.off("cubeHistoryUpdated");
      s.off("setGameRound");
      s.off("solved");
      s.off("showEmotion");
      s.off("updateCoin");
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
        socket: socketRef.current,
        gameRoomState,
        isSolved,
        emotions,
        coin,
        emitJoinGame,
        emitRotateCube,
        emitSendEmotion,
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
