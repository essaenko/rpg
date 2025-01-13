import { Component } from '@shared/ecs/component';
import { ArraySchema, type } from '@colyseus/schema';
import { Quest } from '@shared/schemas/game/quest/quest';
import { MDBClient } from '@server/mongodb';

export class QuestBook extends Component {
  constructor() {
    super('quest-book');
  }

  public serializable: boolean = true;

  @type([Quest]) quests = new ArraySchema<Quest>();

  init(state: Record<string, any>) {
    state.quests?.forEach((id: string) => {
      const save = MDBClient.instance().readQuest(id);

      if (save) {
        const quest = new Quest();
        quest.init(save);
        this.quests.push(quest);
      }
    });
  }

  public serialize(): Record<string, any> {
    return {
      name: this.name,
      quests: this.quests.map((quest) => quest.id),
    };
  }
}
