import { CubeAction, CubeActionHistory } from 'src/common/types';
import { GameRoundState } from './game-round.state';
import { EventEmitter2 } from '@nestjs/event-emitter';

const TURN_TIME = 10;
const ROUND_INTERVAL = 15;

export class GameRoomState {
  roomId: string;
  players: string[] = [];
  currentRoundNumber: number;
  currentPlayerId: string | null; // 현재 차례인 플레이어 ID
  status: 'playing' | 'break'; // 라운드 진행 중인지, 쉬는 시간인지
  timerEndTime: number = 0;

  private currentRound: GameRoundState;
  private timerTimeout?: NodeJS.Timeout;

  constructor(
    roomId: string,
    roundNumber: number,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.roomId = roomId;
    this.startNewRound(roundNumber);
  }

  getNextRoundNumber: () => number;

  startNewRound(roundNumber: number) {
    this.currentRoundNumber = roundNumber;
    this.currentRound = new GameRoundState();
    if (this.currentPlayerId) this.setTurn(this.currentPlayerId);
    this.status = 'playing';

    this.eventEmitter.emit('game.startNewRound', {
      roomId: this.roomId,
    });
  }

  join(userId: string) {
    if (!this.players.includes(userId)) {
      this.players.push(userId);
    }
    if (this.players.length === 1) {
      this.setTurn(userId);
    }
  }

  leave(userId: string) {
    if (this.players.length === 1) {
      // 한 명 남았는데 나가는 경우
      this.currentPlayerId = null;
    } else if (this.currentPlayerId === userId) {
      // 현재 차례인 사람이 나가는 경우
      const nextPlayerId = this.getNextPlayer(userId);
      if (nextPlayerId) this.setTurn(nextPlayerId);
      else this.currentPlayerId = null;
    }
    this.players = this.players.filter((player) => player !== userId);
  }

  rotate(
    userId: string,
    action: CubeAction,
  ): { isSolved: boolean; history: CubeActionHistory } {
    if (this.currentPlayerId !== userId) {
      throw new Error(
        `rotateCube failed: user ${userId} attempted to rotate out of turn (currentPlayerId=${this.currentPlayerId})`,
      );
    }

    if (this.currentRound.status !== 'opened') {
      throw new Error(
        `rotateCube failed: round not in 'opened' status (currentStatus=${this.currentRound.status})`,
      );
    }

    if (this.status === 'break') {
      throw new Error(
        `rotateCube failed: room not in 'playing' status (currentStatus=${this.status})`,
      );
    }

    const { isSolved, history } = this.currentRound.rotateCube(userId, action);

    if (isSolved) {
      this.currentRound.closeRound();
      this.timerEndTime = Date.now() + ROUND_INTERVAL * 1000;
      this.currentPlayerId = this.getNextPlayer(this.currentPlayerId);

      if (this.timerTimeout) clearTimeout(this.timerTimeout);

      this.timerTimeout = setTimeout(() => {
        this.startNewRound(this.getNextRoundNumber());
        this.status = 'playing';
      }, ROUND_INTERVAL * 1000);
    } else {
      const nextPlayerId = this.getNextPlayer(userId);
      if (nextPlayerId) this.setTurn(nextPlayerId);
      else this.setTurn(this.currentPlayerId);
    }

    return { isSolved, history };
  }

  isFull() {
    return this.players.length >= 5;
  }

  private setTurn(userId: string) {
    this.currentPlayerId = userId;
    this.timerEndTime = Date.now() + TURN_TIME * 1000;

    this.eventEmitter.emit('game.turnUpdated', {
      roomId: this.roomId,
      currentPlayerId: this.currentPlayerId,
      timerEndTime: this.timerEndTime,
    });

    if (this.timerTimeout) clearTimeout(this.timerTimeout);
    this.timerTimeout = setTimeout(() => {
      if (!this.currentPlayerId) return;
      const nextPlayerId = this.getNextPlayer(this.currentPlayerId);
      if (nextPlayerId) this.setTurn(nextPlayerId);
      else this.setTurn(this.currentPlayerId);
    }, TURN_TIME * 1000);
  }

  getState() {
    return {
      players: this.players,
      currentRoundNumber: this.currentRoundNumber,
      roundState: this.currentRound.getState(),
      currentPlayerId: this.currentPlayerId,
      timerEndTime: this.timerEndTime,
      status: this.status,
    };
  }

  private getNextPlayer(playerId: string): string | null {
    const currentIndex = this.players.indexOf(playerId);
    if (currentIndex === -1) {
      console.error('플레이어가 playerQueue에 없습니다.');
      return null;
    }
    const nextIndex = (currentIndex + 1) % this.players.length;
    return this.players[nextIndex];
  }
}
