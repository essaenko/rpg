import { Component } from '@client/core/ecs/component/component';

export class MapObject extends Component {
  public type: string;
  public gid: number;

  constructor() {
    super('tag-object');
  }
}
