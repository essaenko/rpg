import { Room } from 'colyseus.js';
import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import type { SceneState } from '@shared/schemas/scene';
import type { Entity } from '@shared/ecs/entity';
import { map } from '@client/ecs/entities/map';
import { MapSchema } from '@colyseus/schema';
import { NetworkEntity } from '@client/core/ecs/entity/network-entity';
import type { Component } from '@shared/ecs/component';
import { isKeyOf } from '@client/utils/types';
import { Components } from '@client/ecs/components/map';
import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class NetworkSystem extends System {
  constructor() {
    super('network');
  }
  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {}

  observe(room: Room<SceneState>, container: ECSContainer) {
    room.state.entities.forEach((entity) => {
      this.initEntity(entity, container);
    });
    room.state.entities.onAdd((entity) => {
      this.initEntity(entity, container);
    });
    room.state.entities.onRemove((entity) => {
      container.removeEntity(container.getEntity(entity.id));
    });
  }

  initEntity(eSchema: Entity, container: ECSContainer) {
    const type = Object.keys(map).find((key) => eSchema.components.has(key)); // Object.keys(map).includes(name)
    if (type) {
      const entity = new map[type as keyof typeof map](eSchema.id);
      eSchema.components.forEach((cSchema) => {
        this.initEntityComponent(entity, cSchema);
      });
      eSchema.components.onAdd((cSchema) => {
        this.initEntityComponent(entity, cSchema);
      });
      eSchema.components.onRemove((cSchema) => {
        entity.removeComponent(cSchema.name);
      });

      container.addEntity(entity);
    }
  }

  initEntityComponent(entity: NetworkEntity, cSchema: Component) {
    const name = cSchema.name;
    if (isKeyOf(name, Components)) {
      const Factory = Components[name as keyof typeof Components];
      const component = new Factory();
      entity.addComponent(component);

      if (component instanceof NetworkComponent) {
        component.observe(cSchema as any);
      }
    }
  }
}
