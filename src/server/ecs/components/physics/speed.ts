import { Component } from '@shared/ecs/component';

export class Speed extends Component {
  constructor() {
    super('speed');
  }
  serializable = true;

  public speed: number = 0; // 1

  init(state: Record<string, any>): void {
    if ('speed' in state) {
      this.speed = state.speed;
    }
  }
}
