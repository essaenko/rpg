import { Component } from '@client/core/ecs/component/component';

export class HealthFrame extends Component {
  constructor() {
    super('health-frame');
  }

  destroy() {
    super.destroy();
  }
}
