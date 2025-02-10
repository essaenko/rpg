import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class Speed extends NetworkComponent {
  constructor() {
    super('speed');
  }

  public speed: number = 0;
}
