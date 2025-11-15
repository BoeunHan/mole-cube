import { Injectable } from '@nestjs/common';
import { GameRoomState } from './game-room.state';
import { generateRandomAlphabet } from 'src/common/utils';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class GameService {
  private currentRoundNumber = 0;
  private rooms: Map<string, GameRoomState> = new Map();
  private userNicknames = new Map<string, string>();
  private userRooms = new Map<string, string>();
  private userCoins = new Map<string, number>();
  private userOwnedSkins = new Map<string, string[]>();
  private userSelectedSkins = new Map<string, string>();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  private findOrCreateRoom(): GameRoomState {
    for (const room of this.rooms.values()) {
      if (!room.isFull()) return room;
    }

    // 빈 방이 하나도 없을 때
    const roomId = this.generateRoomId();
    const room = new GameRoomState(
      roomId,
      ++this.currentRoundNumber,
      this.eventEmitter,
    );

    room.getNextRoundNumber = () => ++this.currentRoundNumber;
    room.getUserNickname = (userId: string) =>
      this.userNicknames.get(userId) ?? '';

    this.rooms.set(roomId, room);
    return room;
  }

  findRoomByUserId(userId: string): GameRoomState | undefined {
    const roomId = this.userRooms.get(userId);
    return this.findRoomByRoomId(roomId);
  }

  findRoomByRoomId(roomId?: string): GameRoomState | undefined {
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  joinRoom(userId: string, nickname: string): GameRoomState | undefined {
    if (this.userRooms[userId]) {
      console.error(`User ${userId} has already joined the game.`);
      return;
    }
    const room = this.findOrCreateRoom();
    room.join(userId);
    this.userRooms.set(userId, room.roomId);
    this.userNicknames.set(userId, nickname);
    return room;
  }

  leaveRoom(userId: string): GameRoomState | undefined {
    const roomId = this.userRooms.get(userId);
    if (!roomId) return;
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('No room');

    room.leave(userId);
    this.userRooms.delete(userId);
    this.userNicknames.delete(userId);
    return room;
  }

  getUserCoin(userId: string) {
    return this.userCoins.get(userId) ?? 0;
  }

  getUserOwnedSkins(userId: string) {
    return this.userOwnedSkins.get(userId) ?? [];
  }

  getUserSelectedSkin(userId: string) {
    return this.userSelectedSkins.get(userId);
  }

  buySkin(userId: string, skin: string, coin: number) {
    const prevCoins = this.userCoins.get(userId) ?? 0;
    if (prevCoins < coin) return;
    const prevSkins = this.userOwnedSkins.get(userId) ?? [];
    if (prevSkins.includes(skin)) return;

    const newCoins = prevCoins - coin;
    const newSkins = [...prevSkins, skin];
    this.userCoins.set(userId, newCoins);
    this.userOwnedSkins.set(userId, newSkins);

    return {
      coins: newCoins,
      skins: newSkins,
    };
  }

  selectSkin(userId: string, skin: string) {
    if (skin === 'default') {
      this.userSelectedSkins.delete(userId);
    } else {
      if (!(this.userOwnedSkins.get(userId) ?? []).includes(skin)) return;
      this.userSelectedSkins.set(userId, skin);
    }
  }

  private generateRoomId() {
    const timestamp = Date.now().toString(36);
    return `room-${timestamp}-${generateRandomAlphabet(3)}`;
  }

  @OnEvent('game.roomClosed')
  private handleRoomClosed({ roomId }: { roomId: string }) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    this.rooms.delete(roomId);
  }

  @OnEvent('game.addCoin')
  private handleAddCoins({ coins }: { coins: Record<string, number> }) {
    const updatedCoins = {};

    Object.entries(coins).forEach(([userId, coin]) => {
      const updatedCoin = (this.userCoins.get(userId) ?? 0) + coin;
      this.userCoins.set(userId, updatedCoin);
      updatedCoins[userId] = updatedCoin;
    });

    this.eventEmitter.emit('game.updateCoin', { coins: updatedCoins });
  }
}
