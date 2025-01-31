import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { Fraction as FractionSchema } from '@server/ecs/components/game/mechanics/fraction';
import { Fraction as Fractions } from '@shared/types';

export class Fraction extends NetworkComponent {
  public fraction: Fractions;

  constructor() {
    super('fraction');
  }
}
