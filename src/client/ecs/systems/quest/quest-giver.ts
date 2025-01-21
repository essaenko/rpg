import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { QuestGiverState } from '@client/ecs/components/game/quest/quest-giver-state';
import { WorldScene } from '@client/core/scene/world-scene';
import { QuestLog } from '@client/ecs/components/game/quest/quest-log';
import { QuestGiver } from '@client/ecs/components/game/quest/quest-giver';
import { passConditions } from '@client/utils/quest';
import { Cursors, QuestGiverStates } from '@client/utils/types';
import { TransportEventTypes } from '@shared/types';
import { Action } from '@client/ecs/components/game/mechanics/action';
import { getDistance } from '@shared/utils/physics';
import { Position } from '@client/ecs/components/physics/position';
import { QUEST_GIVER_ACTION_DISTANCE } from '@shared/utils/const';
import { Appearance } from '@client/ecs/components/game/asset/appearance';
import { QuestRequest } from '@client/ecs/components/game/ui/quest-request';

export class QuestGiverSystem extends System {
  constructor() {
    super('quest-giver');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['quest-giver']).forEach((entity) => {
      let state = entity.get<QuestGiverState>('quest-giver-state');
      const giver = entity.get<QuestGiver>('quest-giver');
      const appearance = entity.get<Appearance>('appearance');
      const body = appearance?.sprites?.getByName('body') as Phaser.Physics.Arcade.Sprite;
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
        if (!state) {
          state = new QuestGiverState();
          entity.addComponent(state);
        }

        if (state.state !== QuestGiverStates.QuestAvailable && availableQuests.length) {
          state.state = QuestGiverStates.QuestAvailable;

          const action = new Action();
          action.action = () => {
            const player = container.getEntity(scene.room.sessionId);

            if (
              getDistance(entity.get<Position>('position'), player.get<Position>('position')) <=
              QUEST_GIVER_ACTION_DISTANCE
            ) {
              player.removeComponent('quest-request');
              const qr = new QuestRequest();
              qr.quest = availableQuests[0];
              qr.giver = entity.id;

              player.addComponent(qr);
              entity.removeComponent(action);
            }
          };
          action.tag = 'quest-giver-action';
          entity.addComponent(action);
        }

        if (state.state !== QuestGiverStates.QuestInProgress && ongoingQuests.length) {
          state.state = QuestGiverStates.QuestInProgress;

          const action = new Action();
          action.action = () => {
            scene.room.send(TransportEventTypes.RejectQuest, [ongoingQuests[0].id]);
            entity.removeComponent(action);
          };
          action.tag = 'quest-giver-action';
          entity.addComponent(action);
        }

        if (state.state !== QuestGiverStates.QuestFinished && finishedQuests.length) {
          state.state = QuestGiverStates.QuestFinished;
        }

        if (body && body.input) {
          switch (state.state) {
            case QuestGiverStates.QuestAvailable:
              body.input.cursor = `url(${Cursors.AwailableQiest}), pointer`;
              break;
            case QuestGiverStates.QuestInProgress:
              body.input.cursor = `url(${Cursors.Default}), pointer`;
              break;
            case QuestGiverStates.QuestFinished:
              body.input.cursor = `url(${Cursors.CompletedQuest}), pointer`;
              break;
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
      });
    }
  }
}
