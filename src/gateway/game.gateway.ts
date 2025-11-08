import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { CubeAction } from 'src/common/types';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = client.handshake.auth.userId as string;
    if (userId) {
      client.data.userId = userId;
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = client.data.userId as string;
    const room = this.gameService.leaveRoom(userId);
    if (!room) return;

    client.leave(room.roomId);
    this.server.to(room.roomId).emit('playersUpdated', {
      players: room.players,
      ...room.getTurnInfo(),
    });
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, { nickname }: { nickname: string }) {
    const userId = client.data.userId as string;
    const room = this.gameService.joinRoom(userId, nickname);
    if (!room) return;

    client.join(room.roomId);

    // 같은 방에 나를 제외한 사람들에게 플레이어 업데이트 알림
    client.broadcast.to(room.roomId).emit('playersUpdated', {
      players: room.players,
      ...room.getTurnInfo(),
    });

    // 나에게 게임 라운드 진행상황 세팅 알림
    client.emit('setGameRound', room.getState());
  }

  @SubscribeMessage('rotateCube')
  handleRotateCube(client: Socket, action: CubeAction) {
    const userId = client.data.userId as string;
    const room = this.gameService.findRoomByUserId(userId);

    if (!room) throw new Error('No room found');
    const { isSolved, history } = room.rotate(userId, action);

    if (isSolved) {
      this.server.to(room.roomId).emit('cubeHistoryUpdated', history);
      this.server.to(room.roomId).emit('solved', room.getState());
    } else this.server.to(room.roomId).emit('cubeHistoryUpdated', history);
  }

  @OnEvent('game.turnUpdated')
  handleTurnUpdated(payload: {
    roomId: string;
    currentPlayerId: string;
    currentPlayerNickname: string;
    timerEndTime: number;
    remainingMs: number;
  }) {
    this.server.to(payload.roomId).emit('turnUpdated', {
      currentPlayerId: payload.currentPlayerId,
      currentPlayerNickname: payload.currentPlayerNickname,
      timerEndTime: payload.timerEndTime,
      remainingMs: payload.remainingMs,
    });
  }

  @OnEvent('game.startNewRound')
  handleStartNewRound(payload: { roomId: string }) {
    const room = this.gameService.findRoomByRoomId(payload.roomId);
    if (!room) return;
    this.server.to(payload.roomId).emit('setGameRound', room.getState());
  }
}
