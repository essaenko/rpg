import { Component } from '@shared/ecs/component';
import { ArraySchema, type, filter } from '@colyseus/schema';
import { Quest } from '@shared/schemas/game/quest/quest';
import { MDBClient } from '@server/mongodb';

export class QuestGiver extends Component {
  constructor() {
    super('quest-giver');
  }
  serializable = true;

  @type([Quest]) quests = new ArraySchema<Quest>();

  async init(state: Record<string, any>) {
    if (state.quests) {
      for (const id of state.quests) {
        try {
          const config = await MDBClient.instance().readQuest(id);
          const quest = new Quest();
          quest.id = id;
          quest.init(config);

          this.quests.push(quest);
        } catch (e) {}
      }
    }
  }
}
