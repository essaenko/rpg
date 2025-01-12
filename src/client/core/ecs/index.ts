import { System } from './system';
import { Entity } from './entity/entity';
import { Scene } from 'phaser';
import { TransportEventTypes } from '@shared/types';
import { NetworkScene } from '@client/core/scene/network-scene';
import { WorldScene } from '@client/core/scene/world-scene';

export class ECSContainer {
  public systems: Map<string, System> = new Map();
  public entities: Map<string, Entity> = new Map();
  constructor() {}

  addSystem(system: System): void {
    this.systems.set(system.name, system);
  }

  removeSystem(name: string): void {
    this.systems.delete(name);
  }

  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  removeEntity(entity: Entity): void {
    entity.destroy();

    this.entities.delete(entity.id);
  }

  getEntity(id: string): Entity {
    return this.entities.get(id);
  }

  onUpdate(scene: Scene) {
    this.systems.forEach((system) => system.onUpdate(scene, this));
  }

  query(components: string[]) {
    return this.entities.values().filter((entity: Entity) => {
      return components.every((component) => entity.has(component));
    });
  }

  handleMessage(type: TransportEventTypes, message: any, scene: NetworkScene) {
    this.systems.forEach((system) => {
      system.handleMessage(type, message, this, scene);
    });
  }
}
