import { ECSContainer } from '@client/core/ecs';
import { System } from '@client/core/ecs/system';
import { LightSource } from '@client/ecs/components/game/mechanics/light-source';
import { Position } from '@client/ecs/components/physics/position';
import { DEFAULT_LERP_VALUE, DEFAULT_LIGHT_HEX_COLOR } from '@client/utils/const';

export class LightSystem extends System {
  constructor() {
    super('light');
  }
  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    container.query(['appearance', 'position']).forEach((entity) => {
      let light = entity.get<LightSource>('light-source');
      if (!light) {
        light = new LightSource();
        light.source = scene.lights.addLight(0, 0, 300, DEFAULT_LIGHT_HEX_COLOR, 1);
        light.destroy = () => {
          scene.lights.removeLight(light.source);
        };

        entity.add(light);
      }

      light.source.x = Phaser.Math.Linear(light.source.x, entity.get<Position>('position').x, DEFAULT_LERP_VALUE);
      light.source.y = Phaser.Math.Linear(light.source.y, entity.get<Position>('position').y, DEFAULT_LERP_VALUE);
    });
  }
}
