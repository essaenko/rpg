import { Client, Room } from '@colyseus/core';
import { SceneState } from '@shared/schemas/scene';
import { ECSContainer } from '@shared/ecs';
import { isTransportEventType } from '../utils';
import { Player } from '../../ecs/entities/player';
import { CollisionSystem } from '../../ecs/systems/physics/collision';
import { TiledMap } from '@shared/utils/types';
import { Entity } from '@shared/ecs/entity';
import { MovementSystem } from '../../ecs/systems/physics/movement';
import { MoveSystem } from '../../ecs/systems/physics/move';
import { LevelSystem } from '../../ecs/systems/level';
import { TransportEventTypes } from '@shared/types';
import { MDBClient } from '@server/mongodb';

export abstract class Scene extends Room<SceneState> {
  public ecs = new ECSContainer();
  public map: TiledMap;

  protected constructor() {
    super();
    this.ecs = new ECSContainer();

    this.ecs.addSystem(new MoveSystem());
    this.ecs.addSystem(new CollisionSystem());
    this.ecs.addSystem(new MovementSystem());

    this.ecs.addSystem(new LevelSystem());
  }

  onCreate(options: any) {
    this.onMessage(TransportEventTypes.Move, (client: Client, message: any) => {
      this.ecs.processMessage(client, TransportEventTypes.Move, message);
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
