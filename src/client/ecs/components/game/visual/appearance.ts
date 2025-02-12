import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { Appearance as AppearanceSchema } from '@server/ecs/components/game/appearance';
import Container = Phaser.GameObjects.Container;
import { Animation } from '@shared/types';
import { WithArcadeBody } from '@client/utils/types';

export class Appearance extends NetworkComponent {
  public key: string;
  public sprites: WithArcadeBody<Container>;
  public animation: Animation;
  public loaded: boolean;
  public loading: boolean;
  constructor() {
    super('appearance');
  }

  destroy() {
    super.destroy();

    this.sprites.destroy();
  }
}
