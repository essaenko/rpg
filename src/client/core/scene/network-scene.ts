import Phaser from 'phaser';
import { Client, Room } from 'colyseus.js';

import type { SceneState } from '@shared/schemas/scene';

import { Networking } from '@client/services/networking';

import { ECSContainer } from '@client/core/ecs';
import { InputSystem } from '@client/ecs/systems/input';
import { NetworkSystem } from '@client/ecs/systems/network';
import { LoadSystem } from '@client/ecs/systems/assets/load';
import { SpriteSystem } from '@client/ecs/systems/assets/sprite';
import { MovementSystem } from '@client/ecs/systems/physics/movement';
import { AnimationSystem } from '@client/ecs/systems/assets/animation';
import { CameraSystem } from '@client/ecs/systems/camera';
import { TargetSystem } from '@client/ecs/systems/combat/target';
import { GraphicsSystem } from '@client/ecs/systems/assets/graphics';
import { AppearanceSystem } from '@client/ecs/systems/assets/appearance';
import { QuestGiverSystem } from '@client/ecs/systems/quest/quest-giver';
import { InteractionSystem } from '@client/ecs/systems/mechanics/interaction';
import { LootSystem } from '@client/ecs/systems/mechanics/loot';
import { ActionSystem } from '@client/ecs/systems/mechanics/action';
import { LightSystem } from '@client/ecs/systems/physics/light';
import { GameObjectsSystem } from '@client/ecs/systems/game-objects';
import { SceneSystem } from '@client/ecs/systems/scene';

export class NetworkScene extends Phaser.Scene {
  onJoin?: () => void;
  public room: Room<SceneState>;
  public ecs: ECSContainer = new ECSContainer();

  constructor(public name: string) {
    super(name);
  }

  preload() {
    this.ecs.addSystem(new LoadSystem());
    this.ecs.addSystem(new SceneSystem());
    this.ecs.addSystem(new GameObjectsSystem());

    this.ecs.addSystem(new NetworkSystem());
    this.ecs.addSystem(new InputSystem());
    this.ecs.addSystem(new MovementSystem());
    this.ecs.addSystem(new CameraSystem());

    this.ecs.addSystem(new AnimationSystem());
    this.ecs.addSystem(new SpriteSystem());

    this.ecs.addSystem(new TargetSystem());
    this.ecs.addSystem(new GraphicsSystem());
    this.ecs.addSystem(new AppearanceSystem());

    this.ecs.addSystem(new QuestGiverSystem());
    this.ecs.addSystem(new InteractionSystem());
    this.ecs.addSystem(new ActionSystem());
    this.ecs.addSystem(new LootSystem());

    this.ecs.addSystem(new LightSystem());

    (window as any).ecs = this.ecs;
    this.registry.set('ecs', this.ecs);

    this.ecs.start();
    this.initialize();
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.ecs.onUpdate(this, delta / 1000);
  }

  async initialize() {
    (this.ecs.systems.get('network') as NetworkSystem).observe(Networking.instance.room, this.ecs);
    this.room = Networking.instance.room;

    this.room.onMessage('*', (type, message) => {
      if (typeof type === 'number') {
        this.ecs.handleMessage(type, message, this);
      }
    });

    if (this.onJoin) {
      this.onJoin();
    }
  }
}
