import { Component } from '@shared/ecs/component';

export class MapObject extends Component {
  constructor() {
    super('tag-object');
  }

  serializable = true;

  public type: string;
  public gid: number;

  init(state: Record<string, any>): void {}
}
