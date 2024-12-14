import { Component } from '@shared/ecs/component';
import { ArraySchema, type } from '@colyseus/schema';

export class QuestLog extends Component {
  constructor() {
    super('quest-log');
  }

  serializable = true;

  @type(['string']) finished = new ArraySchema<string>();
  @type(['string']) ongoing = new ArraySchema<string>();

  init(state: Record<string, any>) {
    if (state.finished) {
      this.finished.push(...state.finished);
    }
    if (state.ongoing) {
      this.ongoing.push(...state.ongoing);
    }
  }

  serialize(): Record<string, any> {
    return {
      name: this.name,
      finished: this.finished.toArray(),
      ongoing: this.ongoing.toArray(),
    };
  }
}
