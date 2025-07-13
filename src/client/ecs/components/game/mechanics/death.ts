import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class Death extends NetworkComponent {
  public dead: boolean;
  public timer: boolean;

  constructor() {
    super('death');
  }
}
