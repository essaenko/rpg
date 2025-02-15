import { NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

import { Body as BodyType } from '@shared/types';

export class Body extends NetworkComponent {
  constructor() {
    super('body');
  }

  serializable = true;

  @type('number') width: number = 0;
  @type('number') height: number = 0;

  init(state: BodyType): void {
    if ('width' in state) {
      this.width = state.width;
    }
    if ('height' in state) {
      this.height = state.height;
    }
  }
}
