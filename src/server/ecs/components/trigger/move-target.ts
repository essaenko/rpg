import { Entity } from '@shared/ecs/entity';
import { Trigger } from './trigger';
import { Position } from '../physics/position';

export class MoveTarget extends Trigger {
  constructor() {
    super('move-target');
  }
  validate(entity: Entity): boolean {
    return entity.has('tag-player') && entity.has('position');
  }
  activate(entity: Entity): void {
    entity.get<Position>('position').x += 200;
  }
}
