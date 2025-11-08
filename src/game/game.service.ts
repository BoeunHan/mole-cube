import { Injectable } from '@nestjs/common';
import { GameRoomState } from './game-room.state';
import { generateRandomAlphabet } from 'src/common/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GameService {
  private currentRoundNumber = 0;
  private rooms: Map<string, GameRoomState> = new Map();
  private userNicknames = new Map<string, string>();
  private userRooms = new Map<string, string>();

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

  joinRoom(userId: string, nickname: string): GameRoomState {
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

  generateRoomId() {
    const timestamp = Date.now().toString(36);
    return `room-${timestamp}-${generateRandomAlphabet(3)}`;
  }
}
