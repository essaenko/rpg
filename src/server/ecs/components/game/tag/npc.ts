import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';

export class NPC extends Component {
  constructor() {
    super('tag-npc');
  }
  @type('boolean') empty = true;

  serializable = true;

  init(state: Record<string, any>): void {}
}
