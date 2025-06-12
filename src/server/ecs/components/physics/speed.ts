import { type } from '@colyseus/schema';
import { NetworkComponent } from '@shared/ecs/component';

export class Speed extends NetworkComponent {
  constructor() {
    super('speed');
  }
  serializable = true;

  @type('number') speed: number = 1; // 1

  init(state: Record<string, any>): void {
    if ('speed' in state) {
      this.speed = state.speed;
    }
  }
}
