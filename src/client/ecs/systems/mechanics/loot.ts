import { System } from '@client/core/ecs/system';
import { WorldScene } from '@client/core/scene/world-scene';
import { ECSContainer } from '@client/core/ecs';

export class LootSystem extends System {
  constructor() {
    super('loot');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {}
}
