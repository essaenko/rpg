import { Body } from './physics/body';
import { Position } from './physics/position';
import { Player } from './game/tag/player';
import { Health } from '@client/ecs/components/game/stats/health';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { MapObject } from '@client/ecs/components/game/tag/mapObject';
import { NPC } from '@client/ecs/components/game/tag/npc';
import { Fraction } from '@client/ecs/components/game/mechanics/fraction';
import { QuestGiver } from '@client/ecs/components/game/quest/quest-giver';
import { QuestBook } from '@client/ecs/components/game/quest/quest-book';
import { Level } from '@client/ecs/components/game/mechanics/level';
import { InteractableObject } from '@client/ecs/components/game/mechanics/interactable-object';
import { Loot } from './game/item/loot';
import { Name } from './game/ui/name';
import { Inventory } from './game/item/inventory';
import { SpellBook } from './game/spells/spell-book';

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
  'quest-book': QuestBook,
  level: Level,
  'interactable-object': InteractableObject,
  loot: Loot,
  name: Name,
  inventory: Inventory,
  'spell-book': SpellBook,
} as const;
