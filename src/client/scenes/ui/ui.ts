import { ECSContainer } from '@client/core/ecs';
import { Entity } from '@client/core/ecs/entity/entity';
import { Room } from 'colyseus.js';
import { Scene } from 'phaser';
import { HealthBar } from './health-bar';

export class UIScene extends Scene {
  private ecs: ECSContainer;
  private room: Room;
  private player: Entity;

  constructor() {
    super({ key: 'ui-scene', active: true });
  }

  preload() {}

  init() {
    this.scene.add('health-bar', HealthBar);

    this.events.addListener('network-inited', ({ room, ecs }: { room: Room; ecs: ECSContainer }) => {
      this.room = room;
      this.ecs = ecs;
    });
    this.game.events.on('player-connected', () => {
      this.scene.launch('health-bar', { ecs: this.ecs, id: this.room.sessionId });
    });
  }

  public update(time: number, delta: number): void {
    if (this.ecs && this.room && !this.player) {
      const player = this.ecs.getEntity(this.room.sessionId);

      if (player) {
        this.player = player;
      }
    }
  }
}
