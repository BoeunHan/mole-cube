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

    client.leave(getRoomKey(room.roomId));
    client.leave(getUserKey(userId));

    this.server.to(room.roomId).emit('playersUpdated', {
      players: room.players,
      serverNow: Date.now(),
      ...room.getTurnInfo(),
    });
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, nickname: string) {
    const userId = client.data.userId as string;
    const room = this.gameService.joinRoom(userId, nickname);
    if (!room) return;

    client.join([getRoomKey(room.roomId), getUserKey(userId)]);

    // 같은 방에 나를 제외한 사람들에게 플레이어 업데이트 알림
    client.broadcast.to(getRoomKey(room.roomId)).emit('playersUpdated', {
      players: room.players,
      serverNow: Date.now(),
      ...room.getTurnInfo(),
    });

    // 나에게 게임 라운드 진행상황 세팅 알림
    client.emit('setGameRound', {
      serverNow: Date.now(),
      coin: this.gameService.getUserCoin(userId),
      skins: this.gameService.getUserSkins(userId),
      ...room.getState(),
    });
  }

  @SubscribeMessage('rotateCube')
  handleRotateCube(client: Socket, action: CubeAction) {
    const userId = client.data.userId as string;
    const room = this.gameService.findRoomByUserId(userId);

    if (!room) throw new Error('No room found');
    const { isSolved, history } = room.rotate(userId, action);

    const roomKey = getRoomKey(room.roomId);

    if (isSolved) {
      this.server.to(roomKey).emit('cubeHistoryUpdated', history);
      this.server.to(roomKey).emit('solved', {
        serverNow: Date.now(),
        ...room.getState(),
      });
    } else this.server.to(roomKey).emit('cubeHistoryUpdated', history);
  }

  @SubscribeMessage('sendEmotion')
  sendEmotion(client: Socket, emotion: string) {
    const userId = client.data.userId as string;
    const room = this.gameService.findRoomByUserId(userId);

    if (!room) throw new Error('No room found');

    this.server.to(getRoomKey(room.roomId)).emit('showEmotion', {
      userId: userId,
      emotion,
    });
  }

  @SubscribeMessage('buySkin')
  buySkin(client: Socket, data: { skin: string; coin: number }) {
    const userId = client.data.userId as string;

    const result = this.gameService.buySkin(userId, data.skin, data.coin);
    client.emit('buySkinResult', result);
  }

  @OnEvent('game.turnUpdated')
  handleTurnUpdated(payload: {
    roomId: string;
    currentPlayerId: string;
    currentPlayerNickname: string;
    timerTotalTime: number;
    timerEndTime: number;
  }) {
    this.server.to(getRoomKey(payload.roomId)).emit('turnUpdated', {
      ...payload,
      serverNow: Date.now(),
    });
  }

  @OnEvent('game.startNewRound')
  handleStartNewRound(payload: { roomId: string }) {
    const room = this.gameService.findRoomByRoomId(payload.roomId);
    if (!room) return;

    room.players.forEach((userId) => {
      this.server.to(getUserKey(userId)).emit('setGameRound', {
        serverNow: Date.now(),
        coin: this.gameService.getUserCoin(userId),
        ...room.getState(),
      });
    });
  }

  @OnEvent('game.updateCoin')
  handleUpdateCoins(payload: { coins: Record<string, number> }) {
    Object.entries(payload.coins).forEach(([userId, coin]) => {
      this.server.to(getUserKey(userId)).emit('updateCoin', coin);
    });
  }
}

function getRoomKey(roomId: string) {
  return `room:${roomId}`;
}

function getUserKey(userId: string) {
  return `user:${userId}`;
}
