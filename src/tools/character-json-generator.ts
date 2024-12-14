import { nanoid } from 'nanoid';
import { Class } from '@server/ecs/components/game/class';
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
import { Hit } from '@server/mechanics/spells/warrior/hit';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Equip } from '@server/ecs/components/game/item/equip';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { NPC } from '@server/ecs/components/game/tag/npc';
import { Name } from '@server/ecs/components/game/name';
import { Entity } from '@shared/ecs/entity';
import { WarriorSpells } from '@shared/utils/spells';
import { Fraction } from '@server/ecs/components/game/fraction';
import { Appearance } from '@server/ecs/components/game/appearance';
import { QuestGiver } from '@server/ecs/components/game/quest/quest-giver';
import { H } from 'vite/dist/node/types.d-aGj9QkWt';

const character = new Entity();
character.id = nanoid(9);

character.addComponent(new Class());
character.get<Class>('class').class = Classes.Warrior;

character.addComponent(new NPC());
character.addComponent(new Name());

character.get<Name>('name').value = 'Манекен';
character.addComponent(new Body());
const body = character.get<Body>('body');
body.width = 64;
body.height = 64;
body.pivotY = 32;
body.pivotX = 32;

character.addComponent(new Position());
const position = character.get<Position>('position');
position.x = 0;
position.y = 0;

character.addComponent(new Collider());
const collider = character.get<Collider>('collider');
collider.x = 22;
collider.y = 40;
collider.width = 24;
collider.height = 20;

character.addComponent(new Health());
const health = character.get<Health>('health');
health.current = 100;
health.max = 100;

character.addComponent(new Speed());
const speed = character.get<Speed>('speed');
speed.speed = 80;

character.addComponent(new Resource());
const resource = character.get<Resource>('resource');
resource.current = 100;
resource.max = 100;
resource.type = ResourceType.Rage;

character.addComponent(new MainStats());
const mainStats = character.get<MainStats>('main-stats');
mainStats.agility = 10;
mainStats.strength = 12;
mainStats.intellect = 8;

character.addComponent(new SecondaryStats());
const secondaryStats = character.get<SecondaryStats>('secondary-stats');
secondaryStats.armor = 10;
secondaryStats.attackPower = 12;
secondaryStats.crit = 10;
secondaryStats.avoid = 0;
secondaryStats.block = 0;
secondaryStats.spellPower = 6;
secondaryStats.parry = 0;

character.addComponent(new Fraction());
character.get<Fraction>('fraction').fraction = Fractions.Neutral;
character.addComponent(new Appearance());
character.get<Appearance>('appearance').key = 'dummy';
character.get<Appearance>('appearance').animation = Animation.Idle;

character.addComponent(new Equip());
const equip = character.get<Equip>('equip');
const weapon = new Weapon();
weapon.slot = EquipSlot.MainHand;
weapon.hand = WeaponHand.DualHand;
weapon.name = 'Тренировочный меч';
weapon.attackMax = 10;
weapon.attackMin = 6;
weapon.type = WeaponType.Sword;
weapon.speed = 2;

equip.mainHand = weapon;

character.addComponent(new SpellBook());
const spellBook = character.get<SpellBook>('spell-book');
const warriorHit = new Hit();
warriorHit.cooldown = weapon.speed;
spellBook.spells.set(WarriorSpells.Hit.toString(), warriorHit);

character.addComponent(new QuestGiver());
// character.get<QuestGiver>('quest-giver').quests.push('y3FmVAjXY');

console.log(JSON.stringify(character));
