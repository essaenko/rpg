import { Component } from '@shared/ecs/component';

export class ColliderComponent extends Component {
  constructor() {
    super('collider');
  }

  public x: number = 0; // 22
  public y: number = 0; // 40
  public width: number = 0; // 24
  public height: number = 0; // 20
  public collides: boolean = false; // false

  init(state: Record<string, any>): void {
    if ('x' in state) {
      this.x = state.x;
    }
    if ('y' in state) {
      this.y = state.y;
    }
    if ('width' in state) {
      this.width = state.width;
    }
    if ('height' in state) {
      this.height = state.height;
    }
    if ('collides' in state) {
      this.collides = state.collides;
    }
  }
}
