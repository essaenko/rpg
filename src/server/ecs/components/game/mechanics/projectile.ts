import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';
import { Pointer2D } from '@shared/types';

type ProjectileState = {
  target: Entity | Pointer2D;
};

export class Projectile extends Component implements ProjectileState {
  public target: Entity | Pointer2D;
  public serializable: boolean = false;

  init(state: ProjectileState): void {
    this.target = state.target;
  }
  constructor() {
    super('projectile');
  }
}
