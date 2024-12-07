import { Room } from 'colyseus.js';
import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import type { SceneState } from '@shared/schemas/scene';
import type { Entity } from '@shared/ecs/entity';
import { WorldScene } from '@client/core/scene/world-scene';
import { CameraComponent } from '@client/ecs/components/game/camera';
import { NetworkEntity } from '@client/core/ecs/entity/network-entity';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';
import { ObjectComponent } from '@client/ecs/components/game/tag/object';
import { isMapKey, maps } from '@shared/maps/mapping';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { AnimationComponent } from '@client/ecs/components/game/asset/animation';

export class NetworkSystem extends System {
  constructor() {
    super('network');
  }
  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['tag-player']).forEach((player) => {
      if (player.id === scene.room.sessionId && !player.has('camera')) {
        const camera = new CameraComponent();
        player.addComponent(camera);
      }
    });

    container.query(['tag-object']).forEach((entity) => {
      if (!entity.has('sprite') && entity instanceof NetworkEntity) {
        this.initObject(entity, scene);
      }
    });
  }

  observe(room: Room<SceneState>, container: ECSContainer) {
    room.state.entities.onAdd((entity) => {
      this.onAddEntity(entity, container);
    });
    room.state.entities.onRemove((entity) => {
      container.removeEntity(container.getEntity(entity.id));
    });
  }

  onAddEntity(eSchema: Entity, container: ECSContainer) {
    const entity = new NetworkEntity(eSchema.id);
    entity.observe(eSchema);

    container.addEntity(entity);
  }

  initObject(entity: NetworkEntity, scene: WorldScene) {
    const location = scene.registry.get('scene');
    const object = entity.get<ObjectComponent>('tag-object');
    const position = entity.get<PositionComponent>('position');

    if (isMapKey(location)) {
      const m = maps[location];
      const set = m.tilesets.find((set) => set.name === object.type);
      if (set) {
        const sprite = scene.physics.add.sprite(position.x, position.y, object.type, object.gid - set.firstgid);
        sprite.setOrigin(0, 0);
        sprite.depth = sprite.y + sprite.height;
        const animKey = `${object.type}-animation-${object.gid - set.firstgid}`;

        if (scene.anims.exists(animKey)) {
          const animComponent = new AnimationComponent();
          animComponent.key = animKey;

          entity.addComponent(animComponent);
        }
        const sComponent = new SpriteComponent();
        sComponent.sprite = sprite;

        entity.addComponent(sComponent);
      }
    }
  }
}
