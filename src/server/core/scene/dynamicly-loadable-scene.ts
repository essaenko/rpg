import { Scene } from '@server/core/scene/scene';
import { SceneState } from '@shared/schemas/scene';
import { isMapKey, maps } from '@shared/maps/mapping';
import { MDBClient } from '@server/mongodb';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { Entity } from '@shared/ecs/entity';
import { Client } from '@colyseus/core';
import { nanoid } from 'nanoid';
import { EntitySave } from '@server/mongodb/types';
import { BodyComponent } from '@server/ecs/components/physics/body';
import { ColliderComponent } from '@server/ecs/components/physics/collider';
import { PositionComponent } from '@server/ecs/components/physics/position';
import { ObjectComponent } from '@server/ecs/components/game/tag/object';
import { createPathFromPolygons, isRoutePathObject } from '@server/utils/tiled-object';
import { PatrolComponent } from '@server/ecs/components/game/behaviour/patrol';
import { AStarService } from '@shared/ecs/service/a-star';

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
        const colLayer = this.map.layers.find(({ name }) => name === 'collision');
        if (colLayer) {
          this.ecs.addService(new AStarService(colLayer));
        }
        this.processMapObjects();
        this.processMapNPC();
      }
    }
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

  initEntityComponents(entity: Entity, state: EntitySave) {
    state.components.forEach((cState) => {
      if (isComponentName(cState.name)) {
        const Factory = ComponentMap[cState.name];
        const component = new Factory();
        component.init(cState);

        entity.addComponent(component);
      }
    });
  }

  initEntity(state: EntitySave, id?: string) {
    const entity = new Entity();
    entity.id = id ?? state.id;

    this.initEntityComponents(entity, state);
    this.addEntity(entity);

    return entity;
  }

  async processMapNPC() {
    const layer = this.map.layers.find((layer) => layer.name === 'npc');

    if (layer && layer.layers) {
      for (const l of layer.layers) {
        const id = l.name;
        if (l.objects) {
          const spawn = l.objects.find((o) => o.name === 'spawn');

          if (spawn) {
            const config = await MDBClient.instance().readNPC(id);

            if (config) {
              config.components.push({
                name: 'position',
                x: spawn.x,
                y: spawn.y,
              });
              const entity = this.initEntity(config);
              const route = l.objects.find((o) => o.name === 'route');
              if (route && isRoutePathObject(route)) {
                const path = createPathFromPolygons(route);
                const patrol = new PatrolComponent();
                // patrol.active = false;
                patrol.path = path;
                patrol.current = path[0];

                entity.addComponent(patrol);
              }
            }
          }
        }
      }
    }
  }

  processMapObjects() {
    const layer = this.map.layers.find((layer) => layer.name === 'objects');

    if (layer && layer.objects) {
      layer.objects.forEach((object) => {
        const entity = new Entity();
        const set = this.map.tilesets.find((tileset) => tileset.name === object.type);
        const oComp = new ObjectComponent();
        entity.id = nanoid(9);
        oComp.type = object.type;
        oComp.gid = object.gid;

        entity.addComponent(oComp);

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
