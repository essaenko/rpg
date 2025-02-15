import { ArraySchema } from '@colyseus/schema';
import { Quest } from '@shared/schemas/game/quest/quest';
import { QuestCondition } from '@shared/schemas/game/quest/quest-condition';
import { QuestRequirement } from '@shared/schemas/game/quest/quest-requirement';
import { QuestReward, QuestRewardTypes } from '@shared/schemas/game/quest/quest-reward';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';
import { nanoid } from 'nanoid';

const quest = new Quest();
quest.id = nanoid(9);
quest.name = 'Помощь деревне';
quest.description = 'Помогите деревне собрать урожай';
quest.short_description = 'Помогите деревне';

const exprev = new QuestReward();
exprev.type = QuestRewardTypes.Exp;
exprev.amount = 50;
const goldrev = new QuestReward();
goldrev.type = QuestRewardTypes.Gold;
goldrev.amount = 10;
quest.rewards = new ArraySchema();
quest.rewards.push(exprev, goldrev);

const req = new QuestRequirement();
req.type = QuestRequirementType.ToKill;
req.amount = 3;
quest.requirements = new ArraySchema();
quest.requirements.push(req);

const condition = new QuestCondition();
condition.level = 1;
quest.conditions = new ArraySchema();
quest.conditions.push(condition);

console.log(
  JSON.stringify({
    ...quest,
    conditions: quest.conditions.map((c) => c.toJSON()),
    requirements: quest.requirements.map((c) => c.toJSON()),
    rewards: quest.rewards.map((c) => c.toJSON()),
    id: quest.id,
  }),
);
