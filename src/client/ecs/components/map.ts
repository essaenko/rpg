import { BodyComponent } from './physics/body';
import { PositionComponent } from './physics/position';
import { PlayerComponent } from './tags/player';

export const Components = {
  body: BodyComponent,
  position: PositionComponent,
  'tag-player': PlayerComponent,
} as const;
