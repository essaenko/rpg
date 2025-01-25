import { Schema, type } from '@colyseus/schema';
import { Entity } from '@shared/ecs/entity';
import { Level } from '@server/ecs/components/game/progression/level';
import { QuestBook } from '@server/ecs/components/game/quest/quest-book';

export class QuestCondition extends Schema {
  constructor() {
    super();
  }
  @type('number') level: number = null;
  @type('string') quest: string = null;

  init(state: Record<string, any>) {
    if (state.level != null) {
      this.level = state.level;
    }
    if (state.quest) {
      this.quest = state.quest;
    }
  }

  pass(entity: Entity): boolean {
    const lvl = entity.get<Level>('level');
    const log = entity.get<QuestBook>('quest-book');

    if (this.level) {
      return this.level <= lvl.level;
    }

    if (this.quest) {
      return log.finished.some(({ id }) => id === this.quest);
    }
  }
}
