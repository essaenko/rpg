import { System } from './system';
import { Entity } from './entity/entity';
import { Scene } from 'phaser';

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
      return components.every((component) => entity.get(component));
    });
  }
}
