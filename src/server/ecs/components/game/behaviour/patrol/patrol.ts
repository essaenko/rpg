import { entity, type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';
import { Pointer2D } from '@shared/types';

@entity
export class Patrol extends Component {
  constructor() {
    super('patrol');
  }

  public path: Pointer2D[];
  public starPath: Pointer2D[];
  public starCurrent: Pointer2D;
  public current: Pointer2D;
  public active: boolean;
  public vector: Pointer2D;

  init(state: Record<string, any>): void {}
}
