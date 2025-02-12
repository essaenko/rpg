import { type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';

export class Player extends NetworkComponent {
  @type('boolean') empty = true;
  constructor() {
    super('tag-player');
  }

  serializable = true;

  init(state: Record<string, any>): void {}
}
