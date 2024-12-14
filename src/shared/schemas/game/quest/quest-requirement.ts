import { Schema, type } from '@colyseus/schema';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';

export class QuestRequirement extends Schema {
  constructor() {
    super();
  }

  @type('number') type: QuestRequirementType;
  @type('number') count: number = 0;
  @type('string') req_id: string;
  @type('number') progress: number = 0;

  init(state: Record<string, any>) {
    if (state.type != null && typeof state.type === 'number') {
      this.type = state.type;
    }
    if (state.count != null) {
      this.count = state.count;
    }
    if (state.progress != null) {
      this.progress = state.progress;
    }
    if (state.id) {
      this.req_id = state.req_id;
    }
  }
}
