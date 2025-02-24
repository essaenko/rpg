import { System } from './system';
import { Entity } from './entity/entity';
import { Scene } from 'phaser';
import { TransportEventTypes } from '@shared/types';
import { NetworkScene } from '@client/core/scene/network-scene';
import { WorldScene } from '@client/core/scene/world-scene';

export class ECSContainer {
  public active: boolean = true;
  public systems: Map<string, System> = new Map();
  public entities: Map<string, Entity> = new Map();
  constructor() {}

  stop() {
    this.active = false;
  }

  start() {
    this.active = true;
  }

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
    entity?.destroy();

    this.entities.delete(entity?.id);
  }

  getEntity(id: string): Entity {
    return this.entities.get(id);
  }

  onUpdate(scene: Scene, delta: number) {
    if (this.active) {
      this.systems.forEach((system) => system.onUpdate(scene, this, delta));
    }
  }

  query(components: string[]) {
    return this.entities.values().filter((entity: Entity) => {
      return components.every((component) => entity.has(component));
    });
  }

  handleMessage(type: TransportEventTypes, message: any, scene: NetworkScene) {
    if (this.active) {
      this.systems.forEach((system) => {
        system.handleMessage(type, message, this, scene);
      });
    }
  }

  destroy() {
    this.stop();
    for (const e of this.entities.values()) {
      this.removeEntity(e);
    }
    for (const s of this.systems.values()) {
      this.removeSystem(s.name);
    }
  }
}
