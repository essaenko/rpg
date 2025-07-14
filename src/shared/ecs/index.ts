import { System } from './system';
import { Pointer2D, TransportEventTypes } from '../types';
import { Client } from '@colyseus/core';
import { Entity } from './entity';
import { Scene } from '@server/core/scene/scene';
import { Service } from '@shared/ecs/service/service';
import { QuadTree } from './tree';
import Logger from 'js-logger';

const ContainerLogger = Logger.get('ECSContainer');

export class ECSContainer {
  private systems: Map<string, System> = new Map();
  private entities: Map<string, Entity> = new Map();
  private services: Map<string, Service> = new Map();
  private tree: QuadTree;

  constructor(public scene: Scene) {
    ContainerLogger.debug('ECSContainer created');
  }

  createTree(x: number, y: number, width: number, height: number) {
    ContainerLogger.debug('QuadTree added');
    this.tree = new QuadTree(x, y, width, height);
  }

  addService<T extends Service = Service>(service: T): T {
    ContainerLogger.debug(`Service ${service.name} added`);
    this.services.set(service.name, service);

    return service;
  }

  getService<T extends Service>(name: string): T | undefined {
    return this.services.get(name) as T;
  }

  addSystem(system: System) {
    ContainerLogger.debug(`System ${system.name} added`);
    this.systems.set(system.name, system);
  }

  removeSystem(name: string): void {
    ContainerLogger.debug(`System ${name} removed`);
    this.systems.delete(name);
  }

  addEntity(entity: Entity) {
    ContainerLogger.debug(`Entity ${entity.id} added`);
    this.entities.set(entity.id, entity);
    const position = entity.get('position') as unknown as Pointer2D;
    if (position) {
      this.tree.add(entity);
    }
  }

  removeEntity(id: string): void {
    ContainerLogger.debug(`Entity ${id} removed`);
    const entity = this.getEntity(id);
    entity.onDestroy();
    this.entities.delete(id);
    this.tree.dequeue(entity);
    this.tree.remove(entity);
  }

  getEntity(id: string): Entity {
    return this.entities.get(id);
  }

  query(components: string[], exclude?: string[]): IteratorObject<Entity>;
  query(entity: Entity, range: number, components: string[], exclude?: string[]): IteratorObject<Entity>;
  query(
    ...args:
      | [components: string[], exclude?: string[]]
      | [entity: Entity, range: number, components: string[], exclude?: string[]]
  ): IteratorObject<Entity> {
    if (Array.isArray(args[0]) && (!args[1] || Array.isArray(args[1]))) {
      const components = args[0];
      const exclude = (args[1] ?? []) as string[];

      return this.entities
        .values()
        .filter((entity) => components.every((name) => entity.has(name)) && exclude.every((name) => !entity.has(name)));
    } else if (args[0] instanceof Entity && typeof args[1] === 'number') {
      {
        const entity = args[0];
        const range = args[1];
        const components = args[2];
        const exclude = args[3] ?? [];

        const pos = entity.get('position') as unknown as Pointer2D;

        if (pos) {
          return Iterator.from(this.tree.query(pos.x, pos.y, range, range)).filter(
            (entity) => components.every((name) => entity.has(name)) && exclude.every((name) => !entity.has(name)),
          );
        } else {
          return Iterator.from([]);
        }
      }
    }
  }

  queueTreeUpdate(entity: Entity) {
    if (entity.has('position') && this.entities.has(entity.id)) {
      this.tree.queue(entity);
    }
  }

  update(delta: number, scene: Scene) {
    ContainerLogger.debug('[ECSContainer]: Update scheduled]');
    const start = performance.now();
    this.systems.forEach((sys) => {
      sys.update(delta, this, scene);
    });
    ContainerLogger.debug(`Update finished after: ${performance.now() - start}ms`);
    ContainerLogger.debug(`Update QTree scheduled`);
    const qstart = performance.now();
    this.tree.update();
    ContainerLogger.debug(`Update QTree finished after: ${performance.now() - qstart}ms`);
  }

  processMessage(client: Client, type: TransportEventTypes, message: any) {
    this.systems.forEach((system) => {
      ContainerLogger.debug(`Message received from client: ${client.sessionId}, ${type}`);
      system.handleMessage(client, type, message, this);
    });
  }
}
