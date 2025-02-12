import { NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class Body extends NetworkComponent {
  constructor() {
    super('body');
  }

  serializable = true;

  @type('number') width: number = 0;
  @type('number') height: number = 0;

  init(state: Record<string, any>): void {
    if ('width' in state) {
      this.width = state.width;
    }
    if ('height' in state) {
      this.height = state.height;
    }
  }
}
