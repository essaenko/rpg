import { Component } from '@shared/ecs/component';

export class NPC extends Component {
  constructor() {
    super('tag-npc');
  }

  serializable = true;

  init(state: Record<string, any>): void {}
}
