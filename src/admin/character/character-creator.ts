import e from 'express';
import { Entity } from '@shared/ecs/entity';
import { nanoid } from 'nanoid';
import { NPC } from '@server/ecs/components/game/tag/npc';
import { Move } from '@server/ecs/components/game/move';
import { Name } from '@server/ecs/components/game/ui/name';
import { Body } from '@server/ecs/components/physics/body';
import { Position } from '@server/ecs/components/physics/position';
import { Collider } from '@server/ecs/components/physics/collider';
import { Health } from '@server/ecs/components/game/stats/health/health';
import { Speed } from '@server/ecs/components/physics/speed';
import { Class } from '@server/ecs/components/game/mechanics/class';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { Fraction } from '@server/ecs/components/game/mechanics/fraction';

import { Class as Classes, ResourceType } from '@shared/types';
import { MainStats } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Appearance } from '@server/ecs/components/game/appearance';

import { Animation } from '@shared/types';
import { Velocity } from '@server/ecs/components/physics/velocity';

export const characterRoutes = (router: e.Router) => {
  router.use(e.json());
  router.post('/character/generate', (req, res) => {
    const {
      name,
      characterClass,
      fraction,
      bodyWidth,
      bodyHeight,
      colliderX,
      colliderY,
      colliderWidth,
      colliderHeight,
      agility,
      strength,
      intelligence,
      armor,
      attackPower,
      crit,
      avoid,
      block,
      spellPower,
      parry,
      sprite,
    } = req.body;
    const entity = new Entity();
    entity.id = nanoid(9);

    entity.add(new NPC());
    entity.add(new Move());
    entity.add(new Name());
    entity.get<Name>('name').value = name;

    entity.add(new Body());
    const body = entity.get<Body>('body');
    body.width = bodyWidth;
    body.height = bodyHeight;

    entity.add(new Position());
    const position = entity.get<Position>('position');
    position.x = 0;
    position.y = 0;

    entity.add(new Collider());
    const collider = entity.get<Collider>('collider');
    collider.x = colliderX;
    collider.y = colliderY;
    collider.width = colliderWidth;
    collider.height = colliderHeight;

    entity.add(new Health());
    const health = entity.get<Health>('health');
    health.current = 100;
    health.max = 100;

    entity.add(new Speed());
    const speed = entity.get<Speed>('speed');
    speed.speed = 100;

    if (characterClass !== 0) {
      const cClass = new Class();
      entity.add(cClass);
      entity.add(new Resource());
      const resource = entity.get<Resource>('resource');
      resource.current = 100;
      resource.max = 100;

      switch (characterClass) {
        case '1': {
          cClass.class = Classes.Warrior;
          resource.type = ResourceType.Rage;
          break;
        }
        case '2': {
          cClass.class = Classes.Sage;
          resource.type = ResourceType.Mana;
          break;
        }
        case '3': {
          cClass.class = Classes.Mage;
          resource.type = ResourceType.Mana;
          break;
        }
        case '4': {
          cClass.class = Classes.Hunter;
          resource.type = ResourceType.Energy;
          break;
        }
      }
    }

    entity.add(new MainStats());
    const mainStats = entity.get<MainStats>('main-stats');
    mainStats.agility = agility;
    mainStats.strength = strength;
    mainStats.intellect = intelligence;

    entity.add(new SecondaryStats());
    const secondaryStats = entity.get<SecondaryStats>('secondary-stats');
    secondaryStats.armor = armor;
    secondaryStats.attackPower = attackPower;
    secondaryStats.crit = crit;
    secondaryStats.dodge = avoid;
    secondaryStats.block = block;
    secondaryStats.spellPower = spellPower;
    secondaryStats.parry = parry;

    entity.add(new Fraction());
    entity.get<Fraction>('fraction').fraction = fraction;

    entity.add(new Appearance());
    entity.get<Appearance>('appearance').key = sprite;
    entity.get<Appearance>('appearance').animation = Animation.Idle;

    entity.add(new Velocity());

    return res.status(200).send(JSON.stringify(entity));
  });
};
