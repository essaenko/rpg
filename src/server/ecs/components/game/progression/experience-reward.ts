import { Component } from '@shared/ecs/component';

export class ExperienceReward extends Component {
  constructor() {
    super('experience-reward');
  }

  serializable = true;

  public baseExp: number = 0;
  public difficultyMultiplier: number = 1;

  init(state: Record<string, any>): void {
    if (typeof state.baseExp === 'number') {
      this.baseExp = Math.max(0, state.baseExp);
    }

    if (typeof state.difficultyMultiplier === 'number') {
      this.difficultyMultiplier = Math.max(0, state.difficultyMultiplier);
    }
  }
}
