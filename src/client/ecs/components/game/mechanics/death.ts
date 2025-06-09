import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class Death extends NetworkComponent {
  public dead: boolean;

  constructor() {
    super('death');
  }
}
