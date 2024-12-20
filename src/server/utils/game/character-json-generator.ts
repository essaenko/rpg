import { Character } from '@server/ecs/entities/character';
import { nanoid } from 'nanoid';
import { ClassComponent } from '@server/ecs/components/game/class';
import { Class, EquipSlot, ResourceType, WeaponHand, WeaponType } from '@shared/types';
import { BodyComponent } from '@server/ecs/components/physics/body';
import { PositionComponent } from '@server/ecs/components/physics/position';
import { ColliderComponent } from '@server/ecs/components/physics/collider';
import { HealthComponent } from '@server/ecs/components/game/stats/health/health';
import { SpeedComponent } from '@server/ecs/components/physics/speed';
import { ResourceComponent } from '@server/ecs/components/game/stats/resource/resource';
import { SpellBookComponent } from '@server/ecs/components/game/spells/spell-book';
import { Hit } from '@server/mechanics/spells/warrior/hit';
import { MainStatsComponent } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStatsComponent } from '@server/ecs/components/game/stats/secondary-stats';
import { EquipComponent } from '@server/ecs/components/game/item/equip';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { NPCComponent } from '@server/ecs/components/game/tags/npc';
import { NameComponent } from '@server/ecs/components/game/name';

const character = new Character();
character.id = nanoid(9);
character.get<ClassComponent>('class').name = Class.Warrior;

character.addComponent(new NPCComponent());

character.get<NameComponent>('name').value = 'Манекен';

const body = character.get<BodyComponent>('body');
body.width = 64;
body.height = 64;
body.pivotY = 32;
body.pivotX = 32;

const position = character.get<PositionComponent>('position');
position.x = 128;
position.y = 128;

const collider = character.get<ColliderComponent>('collider');
collider.x = 22;
collider.y = 40;
collider.width = 24;
collider.height = 20;

const health = character.get<HealthComponent>('health');
health.current = 100;
health.max = 100;

const speed = character.get<SpeedComponent>('speed');
speed.speed = 50;

const resource = character.get<ResourceComponent>('resource');
resource.current = 100;
resource.max = 100;
resource.type = ResourceType.Rage;

const mainStats = character.get<MainStatsComponent>('main-stats');
mainStats.agility = 10;
mainStats.strength = 12;
mainStats.intellect = 8;

const secondaryStats = character.get<SecondaryStatsComponent>('secondary-stats');
secondaryStats.armor = 10;
secondaryStats.attackPower = 12;
secondaryStats.crit = 10;
secondaryStats.avoid = 0;
secondaryStats.block = 0;
secondaryStats.spellPower = 6;
secondaryStats.parry = 0;

const equip = character.get<EquipComponent>('equip');
const weapon = new Weapon();
weapon.slot = EquipSlot.MainHand;
weapon.hand = WeaponHand.DualHand;
weapon.name = 'Тренировочный меч';
weapon.attackMax = 10;
weapon.attackMin = 6;
weapon.type = WeaponType.Sword;
weapon.speed = 2;

equip.mainHand = weapon;

const spellBook = character.get<SpellBookComponent>('spell-book');
const warriorHit = new Hit();
warriorHit.cooldown = weapon.speed;
spellBook.spells.set(warriorHit.name, warriorHit);

console.log(JSON.stringify(character));
