import { Component } from '@client/core/ecs/component/component';

export class Target extends Component {
  public target: string;
  constructor() {
    super('target');
  }

  destroy() {
    super.destroy();
  }
}
