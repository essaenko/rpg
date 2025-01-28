import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { DynamicallyLoadableScene } from '@server/core/scene/dynamicly-loadable-scene';
import { getDistance } from '@shared/utils/physics';
import { QuestGiver } from '@server/ecs/components/game/quest/quest-giver';
import { Position } from '@server/ecs/components/physics/position';
import { QUEST_GIVER_ACTION_DISTANCE } from '@shared/utils/const';
import { QuestBook } from '@server/ecs/components/game/quest/quest-book';

export class QuestSystem extends System {
  constructor() {
    super('quest');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    const patch = [];
    if (type === TransportEventTypes.AcceptQuest) {
      const giver = container.getEntity(message?.[0]);
      const player = container.getEntity(client.sessionId);

      if (
        player &&
        giver &&
        getDistance(giver.get<Position>('position'), player.get<Position>('position')) <= QUEST_GIVER_ACTION_DISTANCE
      ) {
        const { quests } = giver.get<QuestGiver>('quest-giver') ?? {};
        const log = player.get<QuestBook>('quest-book');

        const quest = quests?.find((q) => q.id === message?.[1]);

        if (log && quest && quest.passConditions(player)) {
          log.ongoing.push(quest);
        }
      }
    }
    if (type === TransportEventTypes.RejectQuest) {
      const player = container.getEntity(client.sessionId);
      const log = player.get<QuestBook>('quest-book');

      if (log) {
        const quest = log.ongoing.find(({ id }) => id === message?.[0]);

        if (quest) {
          log.ongoing.splice(log.ongoing.indexOf(quest), 1);
        }
      }
    }
    if (type === TransportEventTypes.CompleteQuest) {
      const player = container.getEntity(client.sessionId);
      const log = player.get<QuestBook>('quest-book');

      if (log) {
        const quest = log.ongoing.find(({ id }) => id === message?.[1]);

        if (quest) {
          quest.complete(player);
        }
      }
    }
  }

  onUpdate(delta: number, container: ECSContainer, scene: DynamicallyLoadableScene): void {}
}
