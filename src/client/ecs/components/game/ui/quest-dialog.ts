import { Component } from '@client/core/ecs/component/component';
import { Entity } from '@client/core/ecs/entity/entity';
import type { Quest } from '@shared/schemas/game/quest/quest';

export class QuestDialog extends Component {
  constructor() {
    super('quest-dialog');
  }

  public giver: Entity = null;
  public list: Quest[] = [];
  public finished: Quest[] = [];
}
