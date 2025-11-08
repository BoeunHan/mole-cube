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
  emitJoinGame: (nickname: string) => void;
  emitRotateCube: (action: CubeAction) => void;
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

  const emitJoinGame = (nickname: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("joinGame", { nickname });
  };

  const emitRotateCube = (action: CubeAction) => {
    if (!socketRef.current) return;
    socketRef.current.emit("rotateCube", action);
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
      }) => {
        setGameRoomState((state) => {
          if (!state) return;
          return {
            ...state,
            players: payload.players,
            currentPlayerId: payload.currentPlayerId,
            currentPlayerNickname: payload.currentPlayerNickname,
            timerEndTime: payload.timerEndTime,
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
        timerEndTime: number;
      }) => {
        setGameRoomState((state) => {
          if (!state) return;
          return {
            ...state,
            currentPlayerId: payload.currentPlayerId,
            currentPlayerNickname: payload.currentPlayerNickname,
            timerEndTime: payload.timerEndTime,
          };
        });
      },
    );

    s.on("setGameRound", (roomState: GameRoomState) => {
      setGameRoomState(roomState);
      initCubes(roomState.roundState.cubeStatus.faceColors);
      if (roomState.roundState.status !== "solved") setIsSolved(false);
    });

    s.on("solved", (roomState: GameRoomState) => {
      setTimeout(() => {
        setGameRoomState(roomState);
        setIsSolved(true);
      }, 300);
    });

    return () => {
      s.off("playersUpdated");
      s.off("turnUpdated");
      s.off("cubeHistoryUpdated");
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
        socket: socketRef.current,
        gameRoomState,
        isSolved,
        emitJoinGame,
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
