import { Component } from '@client/core/ecs/component/component';
import type { Quest } from '@shared/schemas/game/quest/quest';

export class QuestRequest extends Component {
  constructor() {
    super('quest-request');
  }

  public quest: Quest = null;
  public giver: string = null;
}
