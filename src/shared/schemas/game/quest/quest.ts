import { ArraySchema, Schema, type } from '@colyseus/schema';
import { QuestRequirement } from '@shared/schemas/game/quest/quest-requirement';
import { QuestReward } from '@shared/schemas/game/quest/quest-reward';
import { QuestCondition } from '@shared/schemas/game/quest/quest-condition';
import { Entity } from '@shared/ecs/entity';

export class Quest extends Schema {
  constructor() {
    super();
  }

  @type('string') id: string;
  @type('string') name: string;
  @type('string') description: string;
  @type('string') short_description: string;
  @type('boolean') finished: boolean = false;
  @type([QuestRequirement]) requirements = new ArraySchema<QuestRequirement>();
  @type([QuestReward]) rewards = new ArraySchema<QuestReward>();
  @type([QuestCondition]) conditions = new ArraySchema<QuestCondition>();

  init(state: Record<string, any>) {
    if (state.name) {
      this.name = state.name;
    }
    if (state.description) {
      this.description = state.description;
    }
    if (state.short_description) {
      this.short_description = state.short_description;
    }
    if (state.requirements) {
      for (const config of state.requirements) {
        const req = new QuestRequirement();
        req.init(config);

        this.requirements.push(req);
      }
    }
    if (state.rewards) {
      for (const config of state.rewards) {
        const rew = new QuestReward();
        rew.init(config);

        this.rewards.push(rew);
      }
    }
    if (state.conditions) {
      for (const config of state.conditions) {
        const condition = new QuestCondition();
        condition.init(config);

        this.conditions.push(condition);
      }
    }
  }

  passConditions(entity: Entity): boolean {
    if (!this.conditions) return true;

    for (const condition of this.conditions) {
      if (condition.pass(entity) === false) {
        return false;
      }
    }

    return true;
  }
}
