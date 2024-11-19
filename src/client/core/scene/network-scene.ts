import { Scene } from 'phaser';
import { Client, Room } from 'colyseus.js';

import type { SceneState } from '@shared/schemas/scene';

import { ECSContainer } from '@client/core/ecs';
import { InputSystem } from '@client/ecs/systems/input';
import { NetworkSystem } from '@client/ecs/systems/network';
import { LoadSystem } from '@client/ecs/systems/load';
import { SpriteSystem } from '@client/ecs/systems/sprite';
import { MovementSystem } from '@client/ecs/systems/movement';
import { AnimationSystem } from '@client/ecs/systems/animation';
import { CameraSystem } from '@client/ecs/systems/camera';

export class NetworkScene extends Scene {
  public room: Room<SceneState>;
  public ecs: ECSContainer = new ECSContainer();

  constructor(public name: string) {
    super(name);
  }

  async create(): Promise<void> {
    this.ecs.addSystem(new InputSystem(this));
    this.ecs.addSystem(new MovementSystem());
    this.ecs.addSystem(new AnimationSystem());
    this.ecs.addSystem(new NetworkSystem());
    this.ecs.addSystem(new LoadSystem());
    this.ecs.addSystem(new SpriteSystem());
    (window as any).ecs = this.ecs;

    await this.joinServerRoom();
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.ecs.onUpdate(this);
  }

  async joinServerRoom(): Promise<boolean> {
    const client = this.registry.get('client');

    if (client && client instanceof Client) {
      try {
        this.room = await client.joinOrCreate(this.name);

        (this.ecs.systems.get('network') as NetworkSystem).observe(this.room, this.ecs);
        this.ecs.addSystem(new CameraSystem(this.room));

        return true;
      } catch (err) {
        return false;
      }
    }
  }
}
