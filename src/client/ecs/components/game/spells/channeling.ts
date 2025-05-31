import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { Spell } from '@shared/schemas/game/spell/spell';

export class Channeling extends NetworkComponent {
  public spell: Spell;
  public remains: number;

  constructor() {
    super('channeling');
  }
}