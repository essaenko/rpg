import { BodyComponent } from './physics/body';
import { PositionComponent } from './physics/position';
import { PlayerComponent } from './tags/player';
import { HealthComponent } from '@client/ecs/components/game/stats/health';

export const Components = {
  body: BodyComponent,
  position: PositionComponent,
  'tag-player': PlayerComponent,
  health: HealthComponent,
} as const;
