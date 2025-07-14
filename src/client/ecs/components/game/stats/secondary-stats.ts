import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class SecondaryStats extends NetworkComponent {
  constructor() {
    super('secondary-stats');
  }

  public attackPower: number = 0;
  public spellPower: number = 0;
  public crit: number = 0;
  public armor: number = 0;
  public resistance: number = 0;
  public parry: number = 0;
  public dodge: number = 0;
  public block: number = 0;
  public speed: number = 0;

  destroy() {
    super.destroy();
  }
}
