import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { QuestRequirementType } from '@shared/schemas/game/quest/types';
import { EnemyKillEvent } from '@server/ecs/components/game/event/enemy-kill';

export class QuestRequirementSystem extends System {
  constructor() {
    super('quest-requirement');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {}
}
