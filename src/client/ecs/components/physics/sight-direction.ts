import { Component } from '@client/core/ecs/component/component';

export class SightDirectionComponent extends Component {
  public direction: 'left' | 'right' | 'forward' | 'backward' = 'backward';
  constructor() {
    super('sight-direction');
  }
}
