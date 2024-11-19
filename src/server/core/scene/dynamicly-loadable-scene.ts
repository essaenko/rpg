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

export class DynamicallyLoadableScene extends Scene {
  constructor() {
    super();
  }

  async onCreate(options: any) {
    super.onCreate(options);

    this.setState(new SceneState());
    if (isMapKey(this.roomName)) {
      this.map = maps[this.roomName];
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
        entity.id = nanoid();
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
}
