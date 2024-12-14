import { Body } from './physics/body';
import { Position } from './physics/position';
import { Player } from './game/tag/player';
import { Health } from '@client/ecs/components/game/stats/health';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { Appearance } from '@client/ecs/components/game/appearance';
import { MapObject } from '@client/ecs/components/game/tag/mapObject';
import { NPC } from '@client/ecs/components/game/tag/npc';
import { Fraction } from '@client/ecs/components/game/fraction';
import { QuestGiver } from '@client/ecs/components/game/quest/quest-giver';
import { QuestLog } from '@client/ecs/components/game/quest/quest-log';
import { Level } from '@client/ecs/components/game/level';

export const Components = {
  body: Body,
  position: Position,
  'tag-player': Player,
  'tag-object': MapObject,
  'tag-npc': NPC,
  health: Health,
  resource: Resource,
  appearance: Appearance,
  fraction: Fraction,
  'quest-giver': QuestGiver,
  'quest-log': QuestLog,
  level: Level,
  // 'spell-book'
} as const;
