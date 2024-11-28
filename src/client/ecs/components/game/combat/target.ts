import { Component } from '@client/core/ecs/component/component';

export class TargetComponent extends Component {
  public target: string;
  constructor() {
    super('target');
  }
}
