import type { PositionComponent as PositionSchema } from '@server/ecs/components/physics/position';
import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class PositionComponent extends NetworkComponent {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {
    super('position');
  }

  observe(schema: PositionSchema): void {
    schema.onChange(() => {
      this.x = schema.x;
      this.y = schema.y;
    });
  }
}
