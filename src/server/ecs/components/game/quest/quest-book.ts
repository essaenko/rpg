import { Component } from '@shared/ecs/component';
import { ArraySchema, type } from '@colyseus/schema';
import { MDBClient } from '@server/mongodb';
import { Quest } from '@shared/schemas/game/quest/quest';

export class QuestBook extends Component {
  constructor() {
    super('quest-book');
  }

  serializable = true;

  @type([Quest]) finished = new ArraySchema<Quest>();
  @type([Quest]) ongoing = new ArraySchema<Quest>();

  async init(state: Record<string, any>) {
    if (state.finished) {
      this.finished.push(
        ...(
          await Promise.all(
            state.finished.map(async (id: string) => {
              {
                const save = await MDBClient.instance().readQuest(id);

                if (save) {
                  const quest = new Quest();
                  quest.init(save);

                  return quest;
                }
              }
            }),
          )
        ).filter(Boolean),
      );
    }
    if (state.ongoing) {
      this.ongoing.push(
        ...(
          await Promise.all(
            state.ongoing.map(async (id: string) => {
              {
                const save = await MDBClient.instance().readQuest(id);

                if (save) {
                  const quest = new Quest();
                  quest.init(save);

                  return quest;
                }
              }
            }),
          )
        ).filter(Boolean),
      );
    }
  }

  serialize(): Record<string, any> {
    return {
      name: this.name,
      finished: this.finished.toArray(),
      ongoing: this.ongoing.toArray(),
    };
  }
}
