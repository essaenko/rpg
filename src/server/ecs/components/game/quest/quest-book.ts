import { Component } from '@shared/ecs/component';
import { ArraySchema, type } from '@colyseus/schema';
import { Quest } from '@shared/schemas/game/quest/quest';

export class QuestBook extends Component {
  constructor() {
    super('quest-book');
  }

  @type([Quest]) quests = new ArraySchema<Quest>();

  init(state: Record<string, any>) {}
}
