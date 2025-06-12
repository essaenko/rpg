import { entity, type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';

@entity
export class Player extends NetworkComponent {
  constructor() {
    super('tag-player');
  }

  serializable = true;

  init(state: Record<string, any>): void {}
}
