import { EquipComponent } from '@server/ecs/components/game/item/equip';
import { CastComponent } from '@server/ecs/components/game/spells/cast';
import { CastRequestComponent } from '@server/ecs/components/game/spells/cast-request';
import { DamageComponent } from '@server/ecs/components/game/spells/damage';
import { DotComponent } from '@server/ecs/components/game/spells/dot';
import { HealComponent } from '@server/ecs/components/game/spells/heal';
import { HotComponent } from '@server/ecs/components/game/spells/hot';
import { NegativeEffectComponent } from '@server/ecs/components/game/spells/negative-effect';
import { PositiveEffectComponent } from '@server/ecs/components/game/spells/positive-effect';
import { SpellBookComponent } from '@server/ecs/components/game/spells/spell-book';
import { ChangeHealthComponent } from '@server/ecs/components/game/stats/health/change-health';
import { HealthComponent } from '@server/ecs/components/game/stats/health/health';
import { ChangeResourceComponent } from '@server/ecs/components/game/stats/resource/change-resource';
import { ResourceComponent } from '@server/ecs/components/game/stats/resource/resource';
import { MainStatsComponent } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStatsComponent } from '@server/ecs/components/game/stats/secondary-stats';
import { NPCComponent } from '@server/ecs/components/game/tags/npc';
import { PlayerComponent } from '@server/ecs/components/game/tags/player';
import { ClassComponent } from '@server/ecs/components/game/class';
import { LevelComponent } from '@server/ecs/components/game/level';
import { MoveComponent } from '@server/ecs/components/game/move';
import { NameComponent } from '@server/ecs/components/game/name';
import { BodyComponent } from '@server/ecs/components/physics/body';
import { ColliderComponent } from '@server/ecs/components/physics/collider';
import { PositionComponent } from '@server/ecs/components/physics/position';
import { SpeedComponent } from '@server/ecs/components/physics/speed';
import { VelocityComponent } from '@server/ecs/components/physics/velocity';

export const map = {
  // Game components
  equip: EquipComponent,

  damage: DamageComponent,
  dot: DotComponent,
  heal: HealComponent,
  hot: HotComponent,
  'negative-effect': NegativeEffectComponent,
  'positive-effect': PositiveEffectComponent,
  'spell-book': SpellBookComponent,

  'change-health': ChangeHealthComponent,
  health: HealthComponent,

  'change-resource': ChangeResourceComponent,
  resource: ResourceComponent,

  'main-stats': MainStatsComponent,
  'secondary-stats': SecondaryStatsComponent,

  'tag-npc': NPCComponent,
  'tag-player': PlayerComponent,

  class: ClassComponent,
  level: LevelComponent,
  move: MoveComponent,
  name: NameComponent,

  // Physics components
  body: BodyComponent,
  collider: ColliderComponent,
  position: PositionComponent,
  speed: SpeedComponent,
  velocity: VelocityComponent,
} as const;

export const isComponentName = (name: unknown): name is keyof typeof map => {
  return typeof name === 'string' && name in map;
};
