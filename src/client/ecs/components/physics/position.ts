import type { Position as PositionSchema } from '@server/ecs/components/physics/position';
import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class Position extends NetworkComponent {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {
    super('position');
  }
}
