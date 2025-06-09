import { System } from '@client/core/ecs/system';
import Phaser from 'phaser';
import { ECSContainer } from '@client/core/ecs';
import { Cast as CastComponent } from '@client/ecs/components/game/spells/cast';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';

export class Cast extends System {
  constructor() {
    super('cast');
  }

  onUpdate(scene: Phaser.Scene, container: ECSContainer, delta: number): void {
    for(const entity of container.query(['cast'])) {
      const cast = entity.get<CastComponent>('cast');

      if (cast.spellID) {
        cast.spell = entity.get<SpellBook>('spell-book').spells.get(cast.spellID.toString());
        cast.cast(entity);
        entity.remove(cast);
      }
    }
  }
}