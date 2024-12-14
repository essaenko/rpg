import { Equip } from '@server/ecs/components/game/item/equip';
import { Cast } from '@server/ecs/components/game/spell/cast';
import { CastRequest } from '@server/ecs/components/game/spell/cast-request';
import { Damage } from '@server/ecs/components/game/spell/damage';
import { Dot } from '@server/ecs/components/game/spell/dot';
import { Heal } from '@server/ecs/components/game/spell/heal';
import { Hot } from '@server/ecs/components/game/spell/hot';
import { NegativeEffect } from '@server/ecs/components/game/spell/negative-effect';
import { PositiveEffect } from '@server/ecs/components/game/spell/positive-effect';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { ChangeHealth } from '@server/ecs/components/game/stats/health/change-health';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { ChangeResource } from '@server/ecs/components/game/stats/resource/change-resource';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { NPC } from '@server/ecs/components/game/tag/npc';
import { Player } from '@server/ecs/components/game/tag/player';
import { Class } from '@server/ecs/components/game/class';
import { Level } from '@server/ecs/components/game/level';
import { Move } from '@server/ecs/components/game/move';
import { Name } from '@server/ecs/components/game/name';
import { Body } from '@server/ecs/components/physics/body';
import { Collider } from '@server/ecs/components/physics/collider';
import { Position } from '@server/ecs/components/physics/position';
import { Speed } from '@server/ecs/components/physics/speed';
import { Velocity } from '@server/ecs/components/physics/velocity';
import { Appearance } from '@server/ecs/components/game/appearance';
import { Fraction } from '@server/ecs/components/game/fraction';
import { QuestGiver } from '@server/ecs/components/game/quest/quest-giver';
import { QuestLog } from '@server/ecs/components/game/quest/quest-log';

export const map = {
  // Game components
  appearance: Appearance,
  equip: Equip,

  // Should not persist on save/load character
  // damage: DamageComponent,
  // heal: HealComponent,
  dot: Dot,
  hot: Hot,
  'negative-effect': NegativeEffect,
  'positive-effect': PositiveEffect,
  'spell-book': SpellBook,

  'change-health': ChangeHealth,
  health: Health,

  'change-resource': ChangeResource,
  resource: Resource,

  'main-stats': MainStats,
  'secondary-stats': SecondaryStats,

  'tag-npc': NPC,
  'tag-player': Player,

  'quest-giver': QuestGiver,
  'quest-log': QuestLog,

  class: Class,
  fraction: Fraction,
  level: Level,
  move: Move,
  name: Name,

  // Physics components
  body: Body,
  collider: Collider,
  position: Position,
  speed: Speed,
  velocity: Velocity,
} as const;

export const isComponentName = (name: unknown): name is keyof typeof map => {
  return typeof name === 'string' && name in map;
};
