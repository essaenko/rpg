import { Component } from '@shared/ecs/component';

export class NPCComponent extends Component {
  constructor() {
    super('tag-npc');
  }

  init(state: Record<string, any>): void {}
}
