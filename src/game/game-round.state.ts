import { CubeAction, CubeActionHistory } from 'src/common/types';
import { CubeStatus } from 'src/common/cube-status';
import EventEmitter from 'events';

export class GameRoundState extends EventEmitter {
  currentRound = 0;
  isOpen = false;
  currentPlayerId?: string; // 현재 차례인 플레이어 ID
  playerQueue: string[] = []; // 플레이어 순서
  timerEndTime: number = 0;
  openedAt: Date | null = null;
  closedAt: Date | null = null;
  actionHistories: CubeActionHistory[] = [];
  cubeStatus = new CubeStatus();

  private TURN_TIME = 10;
  private ROUND_INTERVAL = 15;
  private timerTimeout?: NodeJS.Timeout;

  join(playerId: string) {
    if (!this.playerQueue.includes(playerId)) {
      this.playerQueue.push(playerId);
    }

    if (this.playerQueue.length === 1) {
      this.currentPlayerId = playerId;
      if (this.isOpen) {
        this.scheduleTurnTimeout();
      }
    }
  }

  leave(playerId: string) {
    if (this.playerQueue.length === 1) {
      // 한 명 남았는데 나가는 경우
      this.currentPlayerId = undefined;
    } else if (this.currentPlayerId === playerId) {
      // 현재 차례인 사람이 나가는 경우
      if (this.isOpen) {
        // 게임 진행 중일 때는 다음 사람으로 진행
        this.setNextTurn(playerId);
      } else {
        // 게임 대기중일 때는 다음 사람으로 설정만
        this.currentPlayerId = this.getNextPlayer(this.currentPlayerId);
      }
    }

    this.playerQueue = this.playerQueue.filter((player) => player !== playerId);
  }

  private setNextTurn(playerId: string) {
    this.currentPlayerId = this.getNextPlayer(playerId);
    this.scheduleTurnTimeout();
  }

  private getNextPlayer(playerId: string) {
    const queue = this.playerQueue;
    const currentIndex = queue.indexOf(playerId);
    if (currentIndex === -1) {
      console.error('플레이어가 playerQueue에 없습니다.');
      return;
    }
    const nextIndex = (currentIndex + 1) % queue.length;
    return queue[nextIndex];
  }

  private scheduleTurnTimeout() {
    const currentPlayerId = this.currentPlayerId;
    if (!currentPlayerId) return;

    this.timerEndTime = Date.now() + this.TURN_TIME * 1000;
    this.emitTurnUpdated();

    if (this.timerTimeout) clearTimeout(this.timerTimeout);
    this.timerTimeout = setTimeout(() => {
      this.setNextTurn(currentPlayerId);
    }, this.TURN_TIME * 1000);
  }

  startNextRound() {
    this.currentRound++;
    this.isOpen = true;
    this.openedAt = new Date();
    this.closedAt = null;
    this.timerEndTime = Date.now() + this.TURN_TIME * 1000;
    this.cubeStatus = new CubeStatus('easy');
    this.actionHistories = [];

    this.emitRoundStateUpdated();
  }

  rotateCube(userId: string, action: CubeAction) {
    this.cubeStatus.rotateCubeFace(action.face, action.clockwise);

    const timestamp = Date.now();
    const history = { userId, timestamp, action };
    this.actionHistories.push(history);

    if (this.cubeStatus.isCubeSolved()) {
      this.closeRound();
    } else {
      this.setNextTurn(userId);
    }
    return history;
  }

  private closeRound() {
    this.isOpen = false;
    this.closedAt = new Date();
    if (this.timerTimeout) clearTimeout(this.timerTimeout);
    if (this.currentPlayerId) {
      this.currentPlayerId = this.getNextPlayer(this.currentPlayerId);
    }
    this.timerEndTime = Date.now() + this.ROUND_INTERVAL * 1000;

    this.timerTimeout = setTimeout(() => {
      this.startNextRound();
    }, this.ROUND_INTERVAL * 1000);

    this.emit('solved');
  }

  private emitTurnUpdated() {
    this.emit('turnUpdated', {
      currentPlayerId: this.currentPlayerId,
      timerEndTime: this.timerEndTime,
    });
  }

  private emitRoundStateUpdated() {
    this.emit('roundStateUpdated');
  }

  getDisplayInfo() {
    return {
      currentRound: this.currentRound,
      playerQueue: this.playerQueue,
      currentPlayerId: this.currentPlayerId,
      isOpen: this.isOpen,
      openedAt: this.openedAt,
      closedAt: this.closedAt,
      timerEndTime: this.timerEndTime,
      actionHistories: this.actionHistories,
      faceColors: this.cubeStatus.faceColors,
    };
  }
}
