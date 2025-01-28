import { ArraySchema, Schema, type } from '@colyseus/schema';
import { QuestRequirement } from '@shared/schemas/game/quest/quest-requirement';
import { QuestReward, QuestRewardTypes } from '@shared/schemas/game/quest/quest-reward';
import { QuestCondition } from '@shared/schemas/game/quest/quest-condition';
import { Entity } from '@shared/ecs/entity';
import { Inventory } from '@server/ecs/components/game/item/inventory';
import { MDBClient } from '@server/mongodb';
import { ItemFactory } from '../item/map';
import { QuestRequirementType } from './types';
import { Level } from '@server/ecs/components/game/progression/level';
import { QuestBook } from '@server/ecs/components/game/quest/quest-book';

export class Quest extends Schema {
  constructor() {
    super();
  }

  @type('string') id: string;
  @type('string') name: string;
  @type('string') description: string;
  @type('string') short_description: string;
  @type([QuestRequirement]) requirements = new ArraySchema<QuestRequirement>();
  @type([QuestReward]) rewards = new ArraySchema<QuestReward>();
  @type([QuestCondition]) conditions = new ArraySchema<QuestCondition>();

  init(state: Record<string, any>) {
    if (state.id) {
      this.id = state.id;
    }
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

  public get completed(): boolean {
    return this.requirements.every((req) => req.amount === req.progress);
  }

  async complete(entity: Entity) {
    if (this.completed) {
      this.applyRequirements(entity);
      this.grantRewards(entity);
      this.finishQuest(entity);
    }
  }

  private finishQuest(entity: Entity) {
    const log = entity.get<QuestBook>('quest-book');
    log.ongoing.splice(log.ongoing.indexOf(this), 1);
    log.finished.push(this);
  }

  private applyRequirements(entity: Entity) {
    for (const req of this.requirements) {
      if (req.type === QuestRequirementType.ToHave) {
        entity.get<Inventory>('inventory')?.removeItem(req.req_id, req.amount);
      }
    }
  }

  private async grantRewards(entity: Entity) {
    for (const reward of this.rewards) {
      switch (reward.type) {
        case QuestRewardTypes.Item:
          const data = await MDBClient.instance().readItem(reward.rew_id);
          if (data) {
            const item = ItemFactory.instantiate(data);

            if (item) {
              entity.get<Inventory>('inventory').addItem(item, reward.amount);
            }
          }

          break;
        case QuestRewardTypes.Exp:
          entity.get<Level>('level').addExp(reward.amount);
          break;
        case QuestRewardTypes.Gold:
          entity.get<Inventory>('inventory').addGold(reward.amount);
          break;
      }
    }
  }
}
