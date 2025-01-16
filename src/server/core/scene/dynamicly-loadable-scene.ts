import { Scene } from '@server/core/scene/scene';
import { SceneState } from '@shared/schemas/scene';
import { isMapKey, maps } from '@shared/maps/mapping';
import { MDBClient } from '@server/mongodb';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { Entity } from '@shared/ecs/entity';
import { Client } from '@colyseus/core';
import { nanoid } from 'nanoid';
import { EntitySave } from '@server/mongodb/types';
import { Body } from '@server/ecs/components/physics/body';
import { Collider } from '@server/ecs/components/physics/collider';
import { Position } from '@server/ecs/components/physics/position';
import { MapObject } from '@server/ecs/components/game/tag/mapObject';
import { createPathFromPolygons, isRoutePathObject } from '@server/utils/tiled-object';
import { Patrol } from '@server/ecs/components/game/behaviour/patrol';
import { AStarService } from '@shared/ecs/service/a-star';
import { InteractableObject } from '@server/ecs/components/game/mechanics/interactable-object';
import { InteractionTypes } from '@shared/types';

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
    //TODO Change this to a proper login system
    if (!client.userData) client.userData = {};
    client.userData.id = 'usqPuANKq';

    const save = await MDBClient.instance().readPlayer(client.userData.id);
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

    entity.id = client.userData?.id as string;
    await MDBClient.instance().writePlayer(entity);
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
    entity.id = id ?? nanoid(9);

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
                const patrol = new Patrol();
                patrol.active = false;
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
        const oComp = new MapObject();
        entity.id = nanoid(9);
        oComp.type = object.type;
        oComp.gid = object.gid;

        entity.addComponent(oComp);

        if (object.width && object.height) {
          const body = new Body();
          body.width = object.width;
          body.height = object.height;

          entity.addComponent(body);
        }

        if (object.x && object.y) {
          const position = new Position();
          position.x = object.x;
          position.y = object.y;

          entity.addComponent(position);
        }

        if (set && set.tiles) {
          const tile = set.tiles.find(({ id }) => id === object.gid - set.firstgid);

          if (tile && tile.objectgroup) {
            const collider = tile.objectgroup.objects?.find(({ type }) => type === 'collider');

            if (collider) {
              const component = new Collider();
              component.x = collider.x;
              component.y = collider.y;
              component.width = collider.width;
              component.height = collider.height;

              entity.addComponent(component);
            }
          }
        }

        if (object.properties) {
          if (object.properties.some((p) => p.name === 'action')) {
            const action = object.properties.find((p) => p.name === 'action');

            switch (action.value) {
              case 'collect': {
                const loot = object.properties.find((p) => p.name === 'loot');

                if (loot) {
                  const comp = new InteractableObject();
                  comp.action = InteractionTypes.Loot;
                  comp.loot = loot.value as string;
                  entity.addComponent(comp);
                }
                break;
              }
            }
          }
        }

        this.addEntity(entity);
      });
    }
  }
}
