import { BodyComponent } from './physics/body';
import { PositionComponent } from './physics/position';
import { PlayerComponent } from './game/tag/player';
import { HealthComponent } from '@client/ecs/components/game/stats/health';
import { ResourceComponent } from '@client/ecs/components/game/stats/resource';
import { AppearanceComponent } from '@client/ecs/components/game/appearance';
import { ObjectComponent } from '@client/ecs/components/game/tag/object';
import { NpcComponent } from '@client/ecs/components/game/tag/npc';
import { FractionComponent } from '@client/ecs/components/game/fraction';

export const Components = {
  body: BodyComponent,
  position: PositionComponent,
  'tag-player': PlayerComponent,
  'tag-object': ObjectComponent,
  'tag-npc': NpcComponent,
  health: HealthComponent,
  resource: ResourceComponent,
  appearance: AppearanceComponent,
  fraction: FractionComponent,
  // 'spell-book'
} as const;
