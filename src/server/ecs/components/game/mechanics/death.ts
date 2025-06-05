import { type } from '@colyseus/schema';
import { NetworkComponent } from '@shared/ecs/component';

export class Death extends NetworkComponent {
  init(state: Record<string, any>): void {}

  constructor() {
    super('death');
  }

  @type('boolean') dead: boolean = false;
}
