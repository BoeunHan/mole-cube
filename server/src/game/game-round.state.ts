import { CubeAction, CubeActionHistory } from 'src/common/types';
import { CubeStatus } from 'src/common/cube-status';

export class GameRoundState {
  status: string;
  private openedAt: Date;
  private closedAt: Date | null = null;
  private actionHistories: CubeActionHistory[] = [];
  private cubeStatus: CubeStatus;

  constructor() {
    this.status = 'opened';
    this.cubeStatus = new CubeStatus('easy');
    this.openedAt = new Date();
  }

  rotateCube(
    userId: string,
    nickname: string,
    action: CubeAction,
  ): { isSolved: boolean; history: CubeActionHistory } {
    this.cubeStatus.rotateCubeFace(action.face, action.clockwise);

    const timestamp = Date.now();
    const history = { userId, nickname, timestamp, action };
    this.actionHistories.push(history);

    return {
      isSolved: this.cubeStatus.isSolved(),
      history,
    };
  }

  closeRound() {
    this.status = 'solved';
    this.closedAt = new Date();
  }

  getState() {
    return {
      status: this.status,
      openedAt: this.openedAt,
      closedAt: this.closedAt,
      actionHistories: this.actionHistories,
      cubeStatus: this.cubeStatus.getStatus(),
    };
  }
}
