import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Entity } from '@shared/ecs/entity';
import { getDistance } from '@server/utils/physics';
import { SpellBookComponent } from '@server/ecs/components/game/spells/spell-book';
import { Fraction, Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import { FractionComponent } from '@server/ecs/components/game/fraction';

export abstract class Spell extends Schema {
  constructor(name: number, cost: number, cooldown: number, range: number, relation: Relation | Relation[]) {
    super();

    this.name = name;
    this.cost = cost;
    this.cooldown = cooldown;
    this.range = range * 32;
    if (Array.isArray(relation)) {
      this.relation.push(...relation);
    } else {
      this.relation.push(relation);
    }
  }

  @type('number') name: number;
  @type('number') cost: number;
  @type('number') cooldown: number;
  @type('string') class: string;
  @type('number') range: number;
  @type('number') cooldownTime: number;
  @type(['number']) relation = new ArraySchema<Relation>();

  abstract cast(caster: Entity, target: Entity): void;

  canCast(caster: Entity, target: Entity): boolean {
    const spellBook = caster.get<SpellBookComponent>('spell-book');
    const { fraction: f1 } = caster.get<FractionComponent>('fraction') ?? { fraction: Fraction.Neutral };
    const { fraction: f2 } = target.get<FractionComponent>('fraction') ?? { fraction: Fraction.Neutral };

    return (
      !this.cooldownTime &&
      getDistance(caster, target) <= this.range &&
      spellBook.spells.has(this.name.toString()) &&
      this.relation.includes(getRelation(f1, f2))
    );
  }

  abstract proc(caster: Entity, target: Entity): void;
}
