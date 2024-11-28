import { Scene } from '@server/core/scene/scene';
import { SceneState } from '@shared/schemas/scene';
import { isMapKey, maps } from '@shared/maps/mapping';
import { MDBClient } from '@server/mongodb';
import { map as EntityMap } from '@server/ecs/entities/map';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { Player } from '@server/ecs/entities/player';
import { Entity } from '@shared/ecs/entity';
import { Npc } from '@server/ecs/entities/npc';
import type { Component } from '@shared/ecs/component';
import { Client } from '@colyseus/core';
import { nanoid } from 'nanoid';
import { CharacterSave } from '@server/mongodb/types';
import { BodyComponent } from '@server/ecs/components/physics/body';
import { ColliderComponent } from '@server/ecs/components/physics/collider';
import { PositionComponent } from '@server/ecs/components/physics/position';
import { ObjectComponent } from '@server/ecs/components/game/tags/object';

export class DynamicallyLoadableScene extends Scene {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    super.onCreate(options);

    this.setState(new SceneState());
    if (isMapKey(this.roomName)) {
      this.map = maps[this.roomName];

      if (this.map) {
        this.processMapObjects();
      }
    }

    const state = await MDBClient.instance().readMapConfig(this.roomName);

    state.characters.forEach((e) => this.initEntity(e));
  }

  async onJoin(client: Client) {
    const save = await MDBClient.instance().readPlayerSave('character');
    if (save) {
      this.initEntity(save, client.sessionId);
    } else {
      client.error(1024, `Can't load player`);
    }
  }

  async onLeave(client: Client) {
    const entity = this.ecs.getEntity(client.sessionId);
    this.ecs.removeEntity(client.sessionId);
    this.state.entities.delete(client.sessionId);

    await MDBClient.instance().writePlayerSave(entity);
  }

  initEntityComponents(entity: Entity, state: { components: Map<string, Component> }) {
    state.components.forEach((cState) => {
      if (isComponentName(cState.name)) {
        const Factory = ComponentMap[cState.name];
        const component = new Factory();
        component.init(cState);

        entity.addComponent(component);
      }
    });
  }

  initEntity(state: CharacterSave, id?: string) {
    const type = Object.keys(EntityMap).find((tag) => state.components.has(tag));
    let entity;

    switch (type) {
      case 'tag-npc': {
        entity = new Npc();
        break;
      }
      case 'tag-player': {
        entity = new Player();
        entity.id = id;
        break;
      }
    }

    this.initEntityComponents(entity, state);
    this.addEntity(entity);
  }

  processMapObjects() {
    const layer = this.map.layers.find((layer) => layer.name === 'objects');

    if (layer && layer.objects) {
      layer.objects.forEach((object) => {
        const entity = new Entity();
        const set = this.map.tilesets.find((tileset) => tileset.name === object.type);
        entity.id = nanoid(9);
        entity.addComponent(new ObjectComponent());

        if (object.width && object.height) {
          const body = new BodyComponent();
          body.width = object.width;
          body.height = object.height;

          entity.addComponent(body);
        }

        if (object.x && object.y) {
          const position = new PositionComponent();
          position.x = object.x;
          position.y = object.y;

          entity.addComponent(position);
        }

        if (set && set.tiles) {
          const tile = set.tiles.find(({ id }) => id === object.gid - set.firstgid);

          if (tile && tile.objectgroup) {
            const collider = tile.objectgroup.objects?.find(({ type }) => type === 'collider');

            if (collider) {
              const component = new ColliderComponent();
              component.x = collider.x;
              component.y = collider.y;
              component.width = collider.width;
              component.height = collider.height;

              entity.addComponent(component);
            }
          }
        }

        this.addEntity(entity);
      });
    }
  }
}
