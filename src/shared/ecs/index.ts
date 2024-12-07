import { System } from './system';
import { TransportEventTypes } from '../types';
import { Client } from '@colyseus/core';
import { Entity } from './entity';
import { Scene } from '../../server/core/scene/scene';
import { Service } from '@shared/ecs/service/service';

export class ECSContainer {
  private systems: Map<string, System> = new Map();
  private entities: Map<string, Entity> = new Map();
  private services: Map<string, Service> = new Map();

  constructor(public scene: Scene) {}

  addService(service: Service): void {
    this.services.set(service.name, service);
  }

  getService<T extends Service>(name: string): T | undefined {
    return this.services.get(name) as T;
  }

  addSystem(system: System) {
    this.systems.set(system.name, system);
  }

  removeSystem(name: string): void {
    this.systems.delete(name);
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  removeEntity(id: string): void {
    this.getEntity(id).onDestroy();
    this.entities.delete(id);
    this.scene.state.entities.delete(id);
  }

  getEntity(id: string): Entity {
    return this.entities.get(id);
  }

  query(components: string[]) {
    return this.entities.values().filter((entity) => components.every((name) => entity.has(name)));
  }

  update(delta: number, scene: Scene) {
    this.systems.forEach((sys) => {
      sys.onUpdate(delta, this, scene);
    });
  }

  processMessage(client: Client, type: TransportEventTypes, message: any) {
    this.systems.forEach((system) => {
      system.handleMessage(client, type, message, this);
    });
  }
}
