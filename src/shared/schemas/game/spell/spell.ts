import { Schema, type } from '@colyseus/schema';
import { Entity } from '@shared/ecs/entity';

export abstract class Spell extends Schema {
  constructor(name: string, cost: number, cooldown: number, className: string) {
    super();

    this.name = name;
    this.cost = cost;
    this.cooldown = cooldown;
    this.class = className;
  }

  @type('string') name: string;
  @type('number') cost: number;
  @type('number') cooldown: number;
  @type('string') class: string;

  cast(caster: Entity, target: Entity) {}

  abstract canCast(caster: Entity, target: Entity): boolean;
}
