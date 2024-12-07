import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { FractionComponent as FractionSchema } from '@server/ecs/components/game/fraction';
import { Fraction } from '@shared/types';

export class FractionComponent extends NetworkComponent {
  public fraction: Fraction;

  constructor() {
    super('fraction');
  }

  observe(schema: FractionSchema): void {
    schema.onChange(() => {
      this.fraction = schema.fraction;
    });
  }
}
