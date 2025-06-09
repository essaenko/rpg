import { NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { Cast } from '@server/ecs/components/game/spell/cast';
import { Spell } from '@shared/schemas/game/spell/spell';

export class Channeling extends NetworkComponent {
  @type('number') remains: number = 0;
  @type(Spell) spell: Spell;
  public cast: Cast = null;
  public tick: number = null;

  init(state: Record<string, any>): void {

  }

  constructor() {
    super('channeling');
  }

  process(duration: number): Cast | null {
    this.remains = Math.max(0, this.remains - duration);

    if (this.tick) {
      this.tick = Math.max(0, this.tick - duration);

      if (this.tick === 0 && this.remains !== 0) {
        this.tick = this.spell.tick;

        return this.cast;
      }
    }

    return null;
  }
}
