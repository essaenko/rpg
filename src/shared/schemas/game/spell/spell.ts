import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Entity } from '@shared/ecs/entity';
import { getDistance } from '@shared/utils/physics';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Fraction as Fractions, Relation } from '@shared/types';
import { getRelation } from '@shared/utils/fractions';
import { Fraction } from '@server/ecs/components/game/mechanics/fraction';
import { Position } from '@server/ecs/components/physics/position';
import { Death } from '@server/ecs/components/game/mechanics/death';
import { Scene } from '@server/core/scene/scene';
import { COMMON_SPELLS } from '@shared/utils/const';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';

export abstract class Spell extends Schema {
  /**
   *
   * @param name Spells enum key
   * @param cost Resource cost of spell casting
   * @param cooldown Cooldown time in seconds
   * @param range Range in units (unit is eq a single block which is now 32 px)
   * @param castTime Channelling time to cast spell in seconds
   * @param relation Target relation that spell can be cast onto
   * @param [tick] Describes when need to process cast while channeling spell in seconds.
   */
  protected constructor(
    name: number,
    cost: number,
    cooldown: number,
    range: number,
    castTime: number,
    relation: Relation | Relation[],
    tick?: number,
  ) {
    super();

    this.id = name;
    this.cost = cost;
    this.cooldown = cooldown * 1000;
    this.range = range * 32;
    this.castTime = castTime * 1000;
    if (Array.isArray(relation)) {
      this.relation.push(...relation);
    } else {
      this.relation.push(relation);
    }

    if (tick) {
      this.tick = tick * 1000;
    }
  }

  @type('number') id: number;
  @type('string') name: string;
  @type('string') description: string;
  @type('number') cost: number;
  @type('number') cooldown: number;
  @type('number') range: number;
  @type('number') castTime: number;
  @type('number') cooldownTime: number;
  @type(['number']) relation = new ArraySchema<Relation>();

  public tick: number = null;

  abstract cast(caster: Entity, target: Entity, scene: Scene): void;

  canCast(caster: Entity, target: Entity): boolean {
    const spellBook = caster.get<SpellBook>('spell-book');
    const { fraction: f1 } = caster.get<Fraction>('fraction') ?? { fraction: Fractions.Neutral };
    const { fraction: f2 } = target.get<Fraction>('fraction') ?? { fraction: Fractions.Neutral };
    const death = target.get<Death>('death');
    const resource = target.get<Resource>('resource');

    const hasSpell =
      spellBook != null && Array.from(spellBook.spells.values()).some((spell) => spell.id === this.id);

    return (
      !death?.dead &&
      !this.cooldownTime &&
      getDistance(caster.get<Position>('position'), target.get<Position>('position')) <= this.range &&
      (hasSpell || COMMON_SPELLS.has(this.id)) &&
      resource.current >= this.cost &&
      this.relation.includes(getRelation(f1, f2))
    );
  }

  abstract proc(caster: Entity, target: Entity, scene: Scene): void;
}
