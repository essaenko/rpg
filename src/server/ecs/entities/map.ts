import { Player } from '@server/ecs/entities/player';
import { Npc } from '@server/ecs/entities/npc';

export const map = {
  'tag-player': Player,
  'tag-npc': Npc,
} as const;
