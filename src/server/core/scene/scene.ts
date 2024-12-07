import { Client, Room } from '@colyseus/core';
import { SceneState } from '@shared/schemas/scene';
import { ECSContainer } from '@shared/ecs';
import { isTransportEventType } from '../utils';
import { CollisionSystem } from '../../ecs/systems/physics/collision';
import { TiledMap } from '@shared/utils/types';
import { Entity } from '@shared/ecs/entity';
import { MovementSystem } from '../../ecs/systems/physics/movement';
import { MoveSystem } from '../../ecs/systems/physics/move';
import { LevelSystem } from '../../ecs/systems/level';
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

export abstract class Scene extends Room<SceneState> {
  public ecs: ECSContainer;
  public map: TiledMap;

  protected constructor() {
    super();
    this.ecs = new ECSContainer(this);

    this.ecs.addSystem(new MoveSystem());
    this.ecs.addSystem(new CollisionSystem());
    this.ecs.addSystem(new MovementSystem());

    //Behaviour systems
    this.ecs.addSystem(new PatrolSystem());

    this.ecs.addSystem(new LevelSystem());

    this.ecs.addSystem(new CastRequestSystem());
    this.ecs.addSystem(new CastSystem());
    this.ecs.addSystem(new CooldownSystem());

    this.ecs.addSystem(new HealthSystem());
    this.ecs.addSystem(new HealSystem());
    this.ecs.addSystem(new DamageSystem());
    this.ecs.addSystem(new HotSystem());
    this.ecs.addSystem(new DotSystem());
  }

  onCreate(options: any) {
    this.onMessage(TransportEventTypes.Move, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.Move, message);
    });
    this.onMessage(TransportEventTypes.CastRequest, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.CastRequest, message);
    });
    this.onMessage('*', (client: Client, type: string | number, message: any) => {
      if (isTransportEventType(type)) {
        this.ecs.processMessage(client, type, message);
      }
    });

    this.setSimulationInterval((delta: number) => {
      this.ecs.update(delta / 1000, this);
    });
  }

  addEntity(entity: Entity) {
    this.ecs.addEntity(entity);
    this.state.entities.set(entity.id, entity);
  }
}
