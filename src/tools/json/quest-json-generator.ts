import { Quest } from '@shared/schemas/game/quest/quest';
import { QuestRewardTypes } from '@shared/schemas/game/quest/quest-reward';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';
import { nanoid } from 'nanoid';

const quest = new Quest();
quest.id = nanoid(9);
quest.name = 'Нужно больше урожая';
quest.description = 'Собрать больше урожая';
quest.short_description = 'Собрать 10 кустов многолистного одуванчика для деревни';

//NOTE: Rewards
[{ type: QuestRewardTypes.Exp, amount: 30 }].forEach((rew) => {
  quest.addReward(rew.type, rew.amount);
});

//NOTE: Requirements
[{ type: QuestRequirementType.ToHave, id: 'uoTqAZsXN', amount: 10 }].forEach((req) => {
  quest.addRequirement(req.type, req.id, req.amount);
});

//NOTE: Conditions
[{ level: 2, quest: null }].forEach((cond) => {
  quest.addCondition(cond.level, cond.quest);
});

console.log(
  JSON.stringify({
    ...quest,
    conditions: quest.conditions.map((c) => c.toJSON()),
    requirements: quest.requirements.map((c) => c.toJSON()),
    rewards: quest.rewards.map((c) => c.toJSON()),
    id: quest.id,
  }),
);
