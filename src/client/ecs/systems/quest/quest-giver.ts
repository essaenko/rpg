import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { QuestGiverState } from '@client/ecs/components/game/quest/quest-giver-state';
import { WorldScene } from '@client/core/scene/world-scene';
import { QuestBook } from '@client/ecs/components/game/quest/quest-book';
import { QuestGiver } from '@client/ecs/components/game/quest/quest-giver';
import { passConditions } from '@client/utils/quest';
import { Cursors, QuestGiverStates } from '@client/utils/types';
import { TransportEventTypes } from '@shared/types';
import { Action } from '@client/ecs/components/game/mechanics/action';
import { getDistance } from '@shared/utils/physics';
import { Position } from '@client/ecs/components/physics/position';
import { QUEST_GIVER_ACTION_DISTANCE } from '@shared/utils/const';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { QuestDialog } from '@client/ecs/components/game/ui/quest-dialog';

export class QuestGiverSystem extends System {
  constructor() {
    super('quest-giver');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['quest-dialog']).forEach((entity) => {
      const dialog = entity.get<QuestDialog>('quest-dialog');

      if (
        getDistance(dialog.giver.get<Position>('position'), entity.get<Position>('position')) >
        QUEST_GIVER_ACTION_DISTANCE
      ) {
        entity.removeComponent('quest-dialog');
      }
    });
    container.query(['quest-giver']).forEach((entity) => {
      let state = entity.get<QuestGiverState>('quest-giver-state');
      const giver = entity.get<QuestGiver>('quest-giver');
      const appearance = entity.get<Appearance>('appearance');
      const body = appearance?.sprites?.getByName('body') as Phaser.Physics.Arcade.Sprite;
      const player = container.getEntity(scene.room.sessionId);
      const log = player.get<QuestBook>('quest-book');
      const availableQuests = giver?.quests.filter((quest) => {
        return (
          !log?.finished.some(({ id }) => id === quest.id) &&
          !log?.ongoing.some(({ id }) => id === quest.id) &&
          passConditions(quest.conditions, player)
        );
      });
      const ongoingQuests = log?.ongoing
        .filter(({ id }) => giver.quests.some(({ id: qid }) => qid === id))
        .filter(({ requirements }) => requirements.some((req) => req.amount !== req.progress));
      const finishedQuests = log?.ongoing
        .filter((quest) => giver.quests.some(({ id }) => quest.id === id))
        .filter(({ requirements }) => requirements.every((req) => req.amount === req.progress));

      if (!state) {
        state = new QuestGiverState();
        entity.addComponent(state);
      }

      state.state = null;

      if (availableQuests.length || ongoingQuests.length || finishedQuests.length) {
        if (!entity.getAll<Action>('action').some(({ tag }) => tag === 'quest-giver-action')) {
          const action = new Action();
          action.action = () => {
            const player = container.getEntity(scene.room.sessionId);

            if (
              getDistance(entity.get<Position>('position'), player.get<Position>('position')) <=
              QUEST_GIVER_ACTION_DISTANCE
            ) {
              const availableQuests = giver?.quests.filter((quest) => {
                return (
                  !log?.finished.some(({ id }) => id === quest.id) &&
                  !log?.ongoing.some(({ id }) => id === quest.id) &&
                  passConditions(quest.conditions, player)
                );
              });
              const finishedQuests = log?.ongoing
                .filter((quest) => giver.quests.some(({ id }) => quest.id === id))
                .filter(({ requirements }) => requirements.every((req) => req.amount === req.progress));
              player.removeComponent('quest-dialog');
              const qd = new QuestDialog();
              qd.giver = entity;
              qd.list = availableQuests;
              qd.finished = finishedQuests;

              player.addComponent(qd);
            }
          };
          action.tag = 'quest-giver-action';
          entity.addComponent(action);
        }

        if (state.state !== QuestGiverStates.QuestAvailable && availableQuests.length) {
          state.state = QuestGiverStates.QuestAvailable;
        }

        if (state.state !== QuestGiverStates.QuestInProgress && ongoingQuests.length) {
          state.state = QuestGiverStates.QuestInProgress;
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
        TransportEventTypes.QuestCompleted,
      ].includes(type)
    ) {
      container.query(['quest-giver']).forEach((entity) => {
        entity.removeComponent('quest-giver-state');
      });
    }
  }
}
