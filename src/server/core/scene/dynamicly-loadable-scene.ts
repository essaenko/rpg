import { Scene } from '@server/core/scene/scene';
import { SceneState } from '@shared/schemas/scene';
import { isMapKey, maps } from '@shared/maps/mapping';
import { MDBClient } from '@server/mongodb';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { Entity, NetworkEntity } from '@shared/ecs/entity';
import { Client, RoomException } from '@colyseus/core';
import { nanoid } from 'nanoid';
import { EntitySave } from '@server/mongodb/types';
import { Body } from '@server/ecs/components/physics/body';
import { Collider } from '@server/ecs/components/physics/collider';
import { Position } from '@server/ecs/components/physics/position';
import { MapObject } from '@server/ecs/components/game/tag/mapObject';
import { createPathFromPolygons, isRoutePathObject } from '@server/utils/tiled-object';
import { Patrol } from '@server/ecs/components/game/behaviour/patrol/patrol';
import { AStarService } from '@shared/ecs/service/a-star';
import { InteractableObject } from '@server/ecs/components/game/mechanics/interactable-object';
import { InteractionTypes } from '@shared/types';
import { Death } from '@server/ecs/components/game/mechanics/death';
import { Spawn } from '@server/ecs/components/game/mechanics/spawn';
import { ClientsService } from '@shared/ecs/service/clients';
import { StateView } from '@colyseus/schema';
import { isTriggerFactoryKey, map } from '@server/ecs/components/trigger/map';
import { LocationVisited } from '@server/ecs/components/trigger/location-visited';
import { ChangeScene } from '@server/ecs/components/trigger/change-scene';
import { RoutePath } from '@server/ecs/components/physics/route-path';
import { Behavior } from '@server/ecs/components/game/behaviour/behavior';
import { PatrolTree } from '@server/mechanics/behaviors/patrol';

export class DynamicallyLoadableScene extends Scene {
  constructor() {
    super();
  }

  async onCreate(options: { scene?: string }) {
    super.onCreate(options);

    this.state = new SceneState();
    if (isMapKey(options.scene)) {
      this.map = maps[options.scene];

      if (this.map) {
        const colLayer = this.map.layers.find(({ name }) => name === 'collision');
        if (colLayer) {
          this.ecs.addService(new AStarService(colLayer));
        }
        this.processMapObjects();
        this.processMapNPC();
        this.processMapTriggers();
      }
    }
  }

  async onUncaughtException(
    error: RoomException<this>,
    methodName:
      | 'onCreate'
      | 'onAuth'
      | 'onJoin'
      | 'onLeave'
      | 'onDispose'
      | 'onMessage'
      | 'setSimulationInterval'
      | 'setInterval'
      | 'setTimeout',
  ) {
    console.error(error, `\nin ${methodName}`);
  }

  async onJoin(client: Client) {
    //TODO Change this to a proper login system
    if (!client.userData) client.userData = {};
    let clients = this.ecs.getService<ClientsService>('clients');

    client.userData.id = 'usqPuANKq';
    client.view = new StateView(true);
    clients.register(client);

    const save = await MDBClient.instance().readPlayer(client.userData.id);
    if (save) {
      const entity = new NetworkEntity();
      entity._client = client;
      entity.init(save, client.sessionId);
      entity.add(new Death());
      const spawn = new Spawn();
      const mapSpawn = this.map.layers
        .find(({ name }) => name === 'locations')
        ?.objects?.find(({ type }) => type === 'spawn');

      if (mapSpawn) {
        spawn.point = { x: mapSpawn.x, y: mapSpawn.y };
      }
      entity.add(spawn);
      this.addEntity(entity);
    } else {
      client.error(1024, `Can't load player`);
    }
  }

  async onLeave(client: Client) {
    const entity = this.ecs.getEntity(client.sessionId);
    if (entity) {
      this.ecs.removeEntity(entity.id);
      this.state.entities.delete(entity.id);

      entity.id = client.userData?.id as string;
      await MDBClient.instance().writePlayer(entity);
    }
  }

  async processMapNPC() {
    const layer = this.map.layers.find((layer) => layer.name === 'npc');

    if (layer && layer.layers) {
      for (const l of layer.layers) {
        const id = l.name;
        if (l.objects) {
          const spawn = l.objects.find((o) => o.type === 'spawn');

          if (spawn) {
            const config = await MDBClient.instance().readNPC(id);

            if (config) {
              config.components.push({
                name: 'position',
                x: spawn.x,
                y: spawn.y,
              });
              config.components.push({
                name: 'spawn',
                point: { x: spawn.x, y: spawn.y },
              });
              const entity = new NetworkEntity();
              entity.init(config, config.id);
              entity.add(new Death());

              const route = l.objects.find((o) => o.type === 'route');
              if (route && isRoutePathObject(route)) {
                const path = createPathFromPolygons(route);
                const pPath = new RoutePath();
                pPath.path = path;
                const patrol = new Patrol();
                patrol.active = false;
                patrol.path = path;
                patrol.current = path[0];

                entity.add(patrol);

                let b = entity.get<Behavior>('behavior');

                if (!b) {
                  b = new Behavior();
                  entity.add(b);
                }
                b.behaviors.push(PatrolTree);

                entity.add(pPath);
              }

              this.addEntity(entity);
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

        entity.add(oComp);

        if (object.width && object.height) {
          const body = new Body();
          body.width = object.width;
          body.height = object.height;

          entity.add(body);
        }

        if (object.x && object.y) {
          const position = new Position();
          position.x = object.x;
          position.y = object.y;

          entity.add(position);
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

              entity.add(component);
            }
          }
        }

        if (object.properties) {
          if (object.properties.some((p) => p.name === 'action')) {
            const action = object.properties.find((p) => p.name === 'action');

            switch (action.value) {
              case 'collect': {
                const loot = object.properties.find((p) => p.name === 'value');

                if (loot) {
                  const comp = new InteractableObject();
                  comp.action = InteractionTypes.Loot;
                  comp.loot = loot.value as string;
                  entity.add(comp);
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
  processMapTriggers() {
    const triggers = this.map.layers.find((layer) => layer.name === 'triggers');

    if (triggers && triggers.objects) {
      for (const trigger of triggers.objects) {
        const key = trigger.type;
        if (isTriggerFactoryKey(key)) {
          const e = new Entity();
          e.id = nanoid(9);
          const factory = map[key];
          const t = new factory();
          const p = new Position();
          const c = new Collider();
          const b = new Body();
          p.init({
            x: trigger.x + trigger.width / 2,
            y: trigger.y + trigger.height / 2,
          });
          c.init({
            x: 0,
            y: 0,
            width: trigger.width,
            height: trigger.height,
          });
          b.init({
            width: trigger.width,
            height: trigger.height,
          });

          e.add(t, p, c, b);

          if (t instanceof LocationVisited) {
            const location = trigger.properties?.find(({ name }) => name === 'location');

            if (location && typeof location.value === 'string') {
              t.location = location.value;
            }
          }

          if (t instanceof ChangeScene) {
            const scene = trigger.properties?.find(({ name }) => name === 'scene');
            if (scene && typeof scene.value === 'string') {
              t.scene = scene.value;
            }
          }

          this.addEntity(e);
        }
      }
    }
  }
}
