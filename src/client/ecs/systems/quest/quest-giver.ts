import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { QuestGiverState } from '@client/ecs/components/game/quest/quest-giver-state';
import { WorldScene } from '@client/core/scene/world-scene';
import { QuestLog } from '@client/ecs/components/game/quest/quest-log';
import { QuestGiver } from '@client/ecs/components/game/quest/quest-giver';
import { passConditions } from '@client/utils/quest';
import { QuestGiverStates } from '@client/utils/types';
import { TransportEventTypes } from '@shared/types';
import { Action } from '@client/ecs/components/game/action';
import { getDistance } from '@client/utils/physics';

export class QuestGiverSystem extends System {
  constructor() {
    super('quest-giver');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['quest-giver']).forEach((entity) => {
      let state = entity.get<QuestGiverState>('quest-giver-state');
      const giver = entity.get<QuestGiver>('quest-giver');

      if (!state) {
        const player = container.getEntity(scene.room.sessionId);
        const log = player.get<QuestLog>('quest-log');
        const availableQuests = giver?.quests.filter((quest) => {
          return (
            !log?.finished.includes(quest.id) &&
            !log?.ongoing.includes(quest.id) &&
            passConditions(quest.conditions, player)
          );
        });
        const ongoingQuests = giver?.quests.filter((quest) => log?.ongoing.includes(quest.id));
        const finishedQuests = giver?.quests.filter((quest) => log?.finished.includes(quest.id));

        if (availableQuests.length || ongoingQuests.length || finishedQuests.length) {
          state = new QuestGiverState();
          entity.addComponent(state);

          if (availableQuests.length) {
            state.state = QuestGiverStates.QuestAvailable;

            const action = new Action();
            action.action = () => {
              const player = container.getEntity(scene.room.sessionId);

              if (getDistance(entity, player) <= 48) {
                scene.room.send(TransportEventTypes.AcceptQuest, [entity.id, availableQuests[0].id]);
              }
            };
            action.tag = 'quest-giver-action';
            entity.addComponent(action);
          }

          if (ongoingQuests.length) {
            state.state = QuestGiverStates.QuestInProgress;

            const action = new Action();
            action.action = () => {
              scene.room.send(TransportEventTypes.RejectQuest, [ongoingQuests[0].id]);
            };
            action.tag = 'quest-giver-action';
            entity.addComponent(action);
          }

          if (finishedQuests.length) {
            state.state = QuestGiverStates.QuestFinished;
          }
        }
      }
    });
  }

  handleMessage(type: TransportEventTypes, message: any, container: ECSContainer, scene: WorldScene) {
    super.handleMessage(type, message, container, scene);

    if (
      [
        TransportEventTypes.QuestAccepted,
        TransportEventTypes.QuestRejected,
        TransportEventTypes.QuestFinished,
      ].includes(type)
    ) {
      container.query(['quest-giver']).forEach((entity) => {
        entity.removeComponent('quest-giver-state');
        const action = entity.getAll<Action>('action').find((action) => action.tag === 'quest-giver-action');

        if (action) {
          entity.removeComponent(action);
        }
      });
    }
  }
}
