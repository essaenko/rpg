import { Entity } from '@shared/ecs/entity';
import { BodyComponent } from '../components/physics/body';
import { ResourceType } from '@shared/types';
import { ColliderComponent } from '../components/physics/collider';
import { HealthComponent } from '../components/game/stats/health/health';
import { ClassComponent } from '../components/game/class';
import { ResourceComponent } from '../components/game/stats/resource/resource';
import { VelocityComponent } from '../components/physics/velocity';
import { PositionComponent } from '../components/physics/position';
import { SpeedComponent } from '../components/physics/speed';
import { MoveComponent } from '../components/game/move';
import { LevelComponent } from '../components/game/level';
import { SpellBookComponent } from '../components/game/spells/spell-book';
import { MainStatsComponent } from '@server/ecs/components/game/stats/main-stats';
import { SecondaryStatsComponent } from '@server/ecs/components/game/stats/secondary-stats';
import { NameComponent } from '@server/ecs/components/game/name';
import { EquipComponent } from '@server/ecs/components/game/item/equip';

export class Character extends Entity {
  constructor() {
    super();

    this.addComponent(new BodyComponent());
    this.addComponent(new PositionComponent());
    this.addComponent(new VelocityComponent());
    this.addComponent(new ColliderComponent());
    this.addComponent(new SpeedComponent());
    this.addComponent(new MoveComponent());

    this.addComponent(new NameComponent());
    this.addComponent(new HealthComponent());
    this.addComponent(new MainStatsComponent());
    this.addComponent(new SecondaryStatsComponent());
    this.addComponent(new ResourceComponent());

    this.addComponent(new ClassComponent());
    this.addComponent(new LevelComponent());
    this.addComponent(new SpellBookComponent());

    this.addComponent(new EquipComponent());
  }
}
