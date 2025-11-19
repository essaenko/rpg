import { Component } from '@shared/ecs/component';

export class KillReward extends Component {
  constructor() {
    super('kill-reward');
  }

  serializable = false;

  public amount: number = 0;
  public victimId: string;
  public victimLevel: number = 1;

  init(state: Record<string, any>): void {
    if (typeof state.amount === 'number') {
      this.amount = state.amount;
    }
    if (typeof state.victimId === 'string') {
      this.victimId = state.victimId;
    }
    if (typeof state.victimLevel === 'number') {
      this.victimLevel = state.victimLevel;
    }
  }
}
