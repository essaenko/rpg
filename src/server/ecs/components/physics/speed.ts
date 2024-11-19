import { Component } from '@shared/ecs/component';

export class SpeedComponent extends Component {
  constructor() {
    super('speed');
  }

  public speed: number = 0; // 40

  init(state: Record<string, any>): void {
    if ('speed' in state) {
      this.speed = state.speed;
    }
  }
}
