import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { QuestBook } from '@server/ecs/components/game/quest/quest-book';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';
import { EnemyKillEvent } from '@server/ecs/components/game/event/enemy-kill';

export class QuestRequirementSystem extends System {
  constructor() {
    super('quest-requirement');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['quest-book', 'enemy-kill-event']).forEach((entity) => {
      const qb = entity.get<QuestBook>('quest-book');
      const event = entity.get<EnemyKillEvent>('enemy-kill-event');
      qb.quests.forEach((quest) => {
        quest.requirements.forEach((req) => {
          if (req.type === QuestRequirementType.ToKill && req.req_id === event.victim) {
            req.progress = Math.min(req.count, req.progress + 1);
          }
        });
      });
    });
  }
}
