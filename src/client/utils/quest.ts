import type { QuestCondition } from '@shared/schemas/game/quest/quest-condition';
import { Entity } from '@client/core/ecs/entity/entity';
import { Level } from '@client/ecs/components/game/level';
import { QuestLog } from '@client/ecs/components/game/quest/quest-log';
import type { ArraySchema } from '@colyseus/schema';

export const passConditions = (conditions: ArraySchema<QuestCondition>, entity: Entity): boolean => {
  for (const condition of conditions) {
    if (!passCondition(condition, entity)) return false;
  }

  return true;
};

export const passCondition = (condition: QuestCondition, entity: Entity): boolean => {
  const lvl = entity.get<Level>('level');
  const log = entity.get<QuestLog>('quest-log');
  if (condition.level) {
    return (lvl?.level ?? 0) >= condition.level;
  }

  if (condition.quest) {
    return log?.finished.includes(condition.quest) ?? false;
  }
};
