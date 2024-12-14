import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { DynamicallyLoadableScene } from '@server/core/scene/dynamicly-loadable-scene';
import { getDistance } from '@server/utils/physics';
import { QuestGiver } from '@server/ecs/components/game/quest/quest-giver';
import { QuestLog } from '@server/ecs/components/game/quest/quest-log';

export class QuestSystem extends System {
  constructor() {
    super('quest');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.AcceptQuest) {
      const giver = container.getEntity(message?.[0]);
      const player = container.getEntity(client.sessionId);

      if (player && giver && getDistance(giver, player) <= 50) {
        const { quests } = giver.get<QuestGiver>('quest-giver') ?? {};
        const log = player.get<QuestLog>('quest-log');

        const quest = quests?.find((q) => q.id === message?.[1]);

        if (log && quest && quest.passConditions(player)) {
          log.ongoing.push(quest.id);

          client.send(TransportEventTypes.QuestAccepted, { afterNextPatch: true });
        }
      }
    }
    if (type === TransportEventTypes.RejectQuest) {
      const player = container.getEntity(client.sessionId);
      const log = player.get<QuestLog>('quest-log');

      if (log) {
        log.ongoing.splice(log.ongoing.indexOf(message?.[0]), 1);

        client.send(TransportEventTypes.QuestRejected, { afterNextPatch: true });
      }
    }
  }

  onUpdate(delta: number, container: ECSContainer, scene: DynamicallyLoadableScene): void {}
}
