import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';
import { Position } from '@shared/types';

type ProjectileState = {
  target: Entity | Position;
};

export class Projectile extends Component implements ProjectileState {
  public target: Entity | Position;
  public serializable: boolean = false;

  init(state: ProjectileState): void {
    this.target = state.target;
  }
  constructor() {
    super('projectile');
  }
}
