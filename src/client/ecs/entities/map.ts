import { Player } from './player';
import { NetworkEntity } from '@client/core/ecs/entity/network-entity';

export const map = {
  'tag-player': Player,
  'tag-npc': Player,
  'tag-object': NetworkEntity,
} as const;
