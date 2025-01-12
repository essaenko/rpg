import { Component } from '@shared/ecs/component';
import { Position } from '@shared/types';

export class Patrol extends Component {
  constructor() {
    super('patrol');
  }

  public path: Position[];
  public starPath: Position[];
  public starCurrent: Position;
  public current: Position;
  public active: boolean;
  public vector: Position;

  init(state: Record<string, any>): void {}
}
