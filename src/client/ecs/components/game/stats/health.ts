import type { HealthComponent as HealthComponentSchema } from '@server/ecs/components/game/stats/health/health';
import { NetworkComponent } from '@client/core/ecs/component/network-component';
import Graphics = Phaser.GameObjects.Graphics;

export class HealthComponent extends NetworkComponent {
  public max: number;
  public current: number;
  public object: Graphics;
  constructor() {
    super('health');
  }

  observe(cSchema: HealthComponentSchema) {
    cSchema.onChange(() => {
      this.max = cSchema.max;
      this.current = cSchema.current;
    });
  }

  onRemove() {
    super.onRemove();

    this.object?.destroy();
  }
}
