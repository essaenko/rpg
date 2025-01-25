import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Entity } from '@shared/ecs/entity';
import { getDistance } from '@shared/utils/physics';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Fraction as Fractions, Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import { Fraction } from '@server/ecs/components/game/mechanics/fraction';
import { Position } from '@server/ecs/components/physics/position';
import { Death } from '@server/ecs/components/game/mechanics/death';

export abstract class Spell extends Schema {
  constructor(name: number, cost: number, cooldown: number, range: number, relation: Relation | Relation[]) {
    super();

    this.id = name;
    this.cost = cost;
    this.cooldown = cooldown;
    this.range = range * 32;
    if (Array.isArray(relation)) {
      this.relation.push(...relation);
    } else {
      this.relation.push(relation);
    }
  }

  @type('number') id: number;
  @type('string') name: string;
  @type('string') description: string;
  @type('number') cost: number;
  @type('number') cooldown: number;
  @type('string') class: string;
  @type('number') range: number;
  @type('number') cooldownTime: number;
  @type(['number']) relation = new ArraySchema<Relation>();

  abstract cast(caster: Entity, target: Entity): void;

  canCast(caster: Entity, target: Entity): boolean {
    const spellBook = caster.get<SpellBook>('spell-book');
    const { fraction: f1 } = caster.get<Fraction>('fraction') ?? { fraction: Fractions.Neutral };
    const { fraction: f2 } = target.get<Fraction>('fraction') ?? { fraction: Fractions.Neutral };
    const death = target.get<Death>('death');

    return (
      !death.dead &&
      !this.cooldownTime &&
      getDistance(caster.get<Position>('position'), target.get<Position>('position')) <= this.range &&
      spellBook.spells.has(this.id.toString()) &&
      this.relation.includes(getRelation(f1, f2))
    );
  }

  abstract proc(caster: Entity, target: Entity): void;
}
