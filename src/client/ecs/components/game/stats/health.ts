import type { Health as HealthSchema } from '@server/ecs/components/game/stats/health/health';
import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class Health extends NetworkComponent {
  public max: number;
  public current: number;
  constructor() {
    super('health');
  }

  observe(cSchema: HealthSchema) {
    cSchema.onChange(() => {
      this.max = cSchema.max;
      this.current = cSchema.current;
    });
  }

  destroy() {
    super.destroy();
  }
}
