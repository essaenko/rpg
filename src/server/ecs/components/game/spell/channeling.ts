import { NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Cast } from '@server/ecs/components/game/spell/cast';
import { Spell } from '@shared/schemas/game/spell/spell';

export class Channeling extends NetworkComponent {
  @type('number') remains: number = 0;
  @type(Spell) spell: Spell;
  public cast: Cast = null;

  init(state: Record<string, any>): void {

  }

  constructor() {
    super('channeling');
  }

  process(duration: number) {
    this.remains = Math.max(0, this.remains - duration);
  }
}
