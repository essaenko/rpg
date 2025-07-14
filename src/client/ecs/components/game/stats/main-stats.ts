import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class MainStats extends NetworkComponent {
  constructor() {
    super('main-stats');
  }

  public intellect: number = 0;
  public strength: number = 0;
  public agility: number = 0;
  public stamina: number = 0;

  destroy() {
    super.destroy();
  }
}
