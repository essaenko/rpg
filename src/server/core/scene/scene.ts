import { Client, Room } from '@colyseus/core';
import { SceneState } from '@shared/schemas/scene';
import { ECSContainer } from '@shared/ecs';
import { isTransportEventType } from '../utils';
import { CollisionSystem } from '@server/ecs/systems/physics/collision';
import { TiledMap } from '@shared/utils/types';
import { Entity } from '@shared/ecs/entity';
import { MovementSystem } from '@server/ecs/systems/physics/movement';
import { MoveSystem } from '@server/ecs/systems/physics/move';
import { LevelSystem } from '@server/ecs/systems/mechanics/level';
import { TransportEventTypes } from '@shared/types';
import { CastRequestSystem } from '@server/ecs/systems/spells/cast-request';
import { CastSystem } from '@server/ecs/systems/spells/cast';
import { HealthSystem } from '@server/ecs/systems/stats/health';
import { CooldownSystem } from '@server/ecs/systems/spells/cooldown';
import { HealSystem } from '@server/ecs/systems/spells/heal';
import { DamageSystem } from '@server/ecs/systems/spells/damage';
import { HotSystem } from '@server/ecs/systems/spells/hot';
import { DotSystem } from '@server/ecs/systems/spells/dot';
import { PatrolSystem } from '@server/ecs/systems/behaviour/patrol';
import { QuestSystem } from '@server/ecs/systems/quest/quest';
import { QuestRequirementSystem } from '@server/ecs/systems/quest/quest-requirement';
import { InteractionSystem } from '@server/ecs/systems/mechanics/interaction';
import { LootSystem } from '@server/ecs/systems/mechanics/loot';
import { ResurrectionSystem } from '@server/ecs/systems/mechanics/resurrection';
import { AreaOfInterestsSystem } from '@server/ecs/systems/core/area-of-interests';
import { ClientsService } from '@shared/ecs/service/clients';
import { NetworkEntity } from '@shared/ecs/entity';
import { GameObjectsSystem } from '@server/ecs/systems/core/game-objects';
import { TriggerSystem } from '@server/ecs/systems/core/trigger';
import { ProjectileSystem } from '@server/ecs/systems/core/projectile';
import { EventSystem } from '@server/ecs/systems/core/events';

export abstract class Scene extends Room<SceneState> {
  public ecs: ECSContainer;
  public _map: TiledMap;
  public maxClients: number = 50;

  get map(): TiledMap {
    return this._map;
  }

  set map(map: TiledMap) {
    this._map = map;

    this.ecs.createTree(0, 0, map.width * map.tilewidth, map.height * map.tileheight);
  }

  protected constructor() {
    super();
    this.ecs = new ECSContainer(this);

    this.ecs.addSystem(new AreaOfInterestsSystem());
    this.ecs.addSystem(new GameObjectsSystem());

    this.ecs.addSystem(new MoveSystem());
    this.ecs.addSystem(new CollisionSystem());
    this.ecs.addSystem(new MovementSystem());
    this.ecs.addSystem(new EventSystem());
    this.ecs.addSystem(new TriggerSystem());
    this.ecs.addSystem(new ProjectileSystem());

    this.ecs.addSystem(new ResurrectionSystem());

    //Behaviour systems
    this.ecs.addSystem(new PatrolSystem());
    //Mechanics
    this.ecs.addSystem(new LevelSystem());
    this.ecs.addSystem(new QuestSystem());
    this.ecs.addSystem(new QuestRequirementSystem());
    this.ecs.addSystem(new InteractionSystem());
    this.ecs.addSystem(new LootSystem());

    this.ecs.addSystem(new CastRequestSystem());
    this.ecs.addSystem(new CastSystem());
    this.ecs.addSystem(new CooldownSystem());

    this.ecs.addSystem(new HealthSystem());
    this.ecs.addSystem(new HealSystem());
    this.ecs.addSystem(new DamageSystem());
    this.ecs.addSystem(new HotSystem());
    this.ecs.addSystem(new DotSystem());

    this.ecs.addService(new ClientsService());
  }

  onCreate(options: any) {
    this.onMessage(TransportEventTypes.Move, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.Move, message);
    });
    this.onMessage(TransportEventTypes.CastRequest, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.CastRequest, message);
    });
    this.onMessage(TransportEventTypes.AcceptQuest, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.AcceptQuest, message);
    });
    this.onMessage(TransportEventTypes.GetObjects, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.GetObjects, message);
    });
    this.onMessage('*', (client: Client, type: string | number, message: any) => {
      if (isTransportEventType(type)) {
        this.ecs.processMessage(client, type, message);
      }
    });

    this.setSimulationInterval((delta: number) => {
      this.ecs.update(delta / 1000, this);
    }, 1000 / 20);
  }

  addEntity(entity: Entity) {
    this.ecs.addEntity(entity);
    if (entity instanceof NetworkEntity) {
      this.state.entities.set(entity._schema.id, entity._schema);
      this.ecs.getService<ClientsService>('clients')?.get(entity.id)?.view.add(entity._schema);
    }
  }

  removeEntity(entity: Entity) {
    this.ecs.removeEntity(entity.id);

    if (entity instanceof NetworkEntity) {
      this.state.entities.delete(entity._schema.id);
      this.ecs.getService<ClientsService>('clients')?.list.forEach((client) => {
        client.view?.remove(entity._schema);
      });
    }
  }
}
