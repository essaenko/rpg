import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { AppearanceComponent as AppearanceSchema } from '@server/ecs/components/game/appearance';
import Container = Phaser.GameObjects.Container;
import { Animation } from '@shared/types';

export class AppearanceComponent extends NetworkComponent {
  public key: string;
  public sprites: Container;
  public animation: Animation;
  public loaded: boolean;
  public loading: boolean;
  constructor() {
    super('appearance');
  }

  observe(schema: AppearanceSchema): void {
    schema.onChange(() => {
      this.key = schema.key;
      this.animation = schema.animation;
    });
  }

  destroy() {
    super.destroy();

    this.sprites.destroy();
  }
}
