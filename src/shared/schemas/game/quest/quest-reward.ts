import { Schema, type } from '@colyseus/schema';

export enum QuestRewardTypes {
  Gold = 1,
  Exp,
  Item,
}

export class QuestReward extends Schema {
  @type('number') type: QuestRewardTypes;
  @type('number') amount: number;
  @type('string') id: string;
  @type('boolean') optional: boolean;

  init(state: Record<string, any>) {
    if (state.type != null && typeof state.type === 'number') {
      this.type = state.type;
    }
    if (state.amount != null) {
      this.amount = state.amount;
    }
    if (state.id != null) {
      this.id = state.id;
    }
    if (state.optional != null) {
      this.optional = state.optional;
    }
  }
}
