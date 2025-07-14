import { Body } from './physics/body';
import { Position } from './physics/position';
import { Player } from './game/tag/player';
import { Health } from '@client/ecs/components/game/stats/health';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { NPC } from '@client/ecs/components/game/tag/npc';
import { Fraction } from '@client/ecs/components/game/mechanics/fraction';
import { QuestGiver } from '@client/ecs/components/game/quest/quest-giver';
import { QuestBook } from '@client/ecs/components/game/quest/quest-book';
import { Level } from '@client/ecs/components/game/mechanics/level';
import { Loot } from './game/item/loot';
import { Name } from './game/ui/name';
import { Inventory } from './game/item/inventory';
import { SpellBook } from './game/spells/spell-book';
import { Speed } from './physics/speed';
import { Channeling } from './game/spells/channeling';
import { Death } from './game/mechanics/death';
import { MainStats } from '@client/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@client/ecs/components/game/stats/secondary-stats';

export const Components = {
  body: Body,
  position: Position,
  speed: Speed,
  'tag-player': Player,
  'tag-npc': NPC,
  health: Health,
  resource: Resource,
  'main-stats': MainStats,
  'secondary-stats': SecondaryStats,
  appearance: Appearance,
  fraction: Fraction,
  'quest-giver': QuestGiver,
  'quest-book': QuestBook,
  level: Level,
  loot: Loot,
  name: Name,
  inventory: Inventory,
  'spell-book': SpellBook,
  channeling: Channeling,
  death: Death,
} as const;
