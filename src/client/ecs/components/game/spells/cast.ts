import { Component } from '@client/core/ecs/component/component';
import { Spells } from '@shared/utils/spells';
import { Spell } from '@shared/schemas/game/spell/spell';
import { Entity } from '@client/core/ecs/entity/entity';
import { Pointer } from '@client/ecs/components/physics/pointer';
import { Position } from '@client/ecs/components/physics/position';

export class Cast extends Component {
  constructor() {
    super('cast');
  }

  public spellID: Spells = null;
  public spell: Spell = null;

  cast(entity: Entity) {
    if (this.spell.castTime > 0) {
      const pointer = entity.get<Pointer>('pointer');
      const position = entity.get<Position>('position');

      if (pointer) {
        pointer.x = position.x;
        pointer.y = position.y;
      }
    }
  }
}