import { type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';

export class NPC extends NetworkComponent {
  constructor() {
    super('tag-npc');
  }
  @type('boolean') empty = true;

  serializable = true;

  init(state: Record<string, any>): void {}
}
