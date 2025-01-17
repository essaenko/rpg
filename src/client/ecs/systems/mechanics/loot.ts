import { System } from '@client/core/ecs/system';
import { WorldScene } from '@client/core/scene/world-scene';
import { ECSContainer } from '@client/core/ecs';
import { Loot } from '@client/ecs/components/game/mechanics/loot';
import { TransportEventTypes } from '@shared/types';

export class LootSystem extends System {
  constructor() {
    super('loot');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    // container.query(['loot']).forEach((entity) => {
    //   const loot = entity.get<Loot>('loot');
    //   if (loot.items.length) {
    //     loot.items.forEach((item) => {
    //       scene.room.send(TransportEventTypes.PickItem, [item.id]);
    //     });
    //   }
    // });
  }
}
