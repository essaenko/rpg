import { entity, type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';

@entity
export class NPC extends NetworkComponent {
  constructor() {
    super('tag-npc');
  }

  serializable = true;

  init(state: Record<string, any>): void {}
}
