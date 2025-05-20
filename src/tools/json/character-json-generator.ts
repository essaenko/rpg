import { nanoid } from 'nanoid';
import { Class } from '@server/ecs/components/game/mechanics/class';
import {
  Animation,
  Class as Classes,
  EquipSlot,
  Fraction as Fractions,
  ResourceType,
  WeaponHand,
  WeaponType,
} from '@shared/types';
import { Body } from '@server/ecs/components/physics/body';
import { Position } from '@server/ecs/components/physics/position';
import { Collider } from '@server/ecs/components/physics/collider';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { Speed } from '@server/ecs/components/physics/speed';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Equip } from '@server/ecs/components/game/item/equip';
import { Name } from '@server/ecs/components/game/ui/name';
import { Entity } from '@shared/ecs/entity';
import { Fraction } from '@server/ecs/components/game/mechanics/fraction';
import { Appearance } from '@server/ecs/components/game/appearance';
import { Player } from '@server/ecs/components/game/tag/player';
import { Move } from '@server/ecs/components/game/move';

const character = new Entity();
character.id = nanoid(9);

character.add(new Class());
character.get<Class>('class').class = Classes.Warrior;

character.add(new Player());
character.add(new Move());

character.add(new Name());
character.get<Name>('name').value = 'Игрок';

character.add(new Body());
const body = character.get<Body>('body');
body.width = 64;
body.height = 64;

character.add(new Position());
const position = character.get<Position>('position');
position.x = 0;
position.y = 0;

character.add(new Collider());
const collider = character.get<Collider>('collider');
collider.x = 22;
collider.y = 40;
collider.width = 24;
collider.height = 20;

character.add(new Health());
const health = character.get<Health>('health');
health.current = 100;
health.max = 100;

character.add(new Speed());
const speed = character.get<Speed>('speed');
speed.speed = 100;

character.add(new Resource());
const resource = character.get<Resource>('resource');
resource.current = 100;
resource.max = 100;
resource.type = ResourceType.Rage;

character.add(new MainStats());
const mainStats = character.get<MainStats>('main-stats');
mainStats.agility = 10;
mainStats.strength = 12;
mainStats.intellect = 8;

character.add(new SecondaryStats());
const secondaryStats = character.get<SecondaryStats>('secondary-stats');
secondaryStats.armor = 10;
secondaryStats.attackPower = 12;
secondaryStats.crit = 10;
secondaryStats.avoid = 0;
secondaryStats.block = 0;
secondaryStats.spellPower = 6;
secondaryStats.parry = 0;

character.add(new Fraction());
character.get<Fraction>('fraction').fraction = Fractions.Neutral;
character.add(new Appearance());
character.get<Appearance>('appearance').key = 'dummy';
character.get<Appearance>('appearance').animation = Animation.Idle;

character.add(new Equip());
character.add(new SpellBook());

const classc = new Class();
classc.class = Classes.Warrior;
character.add(classc);

// character.addComponent(new QuestGiver());
// character.get<QuestGiver>('quest-giver').quests.push('teLNDHzMg');

console.log(JSON.stringify(character));
