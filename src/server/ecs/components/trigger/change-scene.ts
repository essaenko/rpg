import { Entity } from '@shared/ecs/entity';
import { Trigger } from './trigger';

export class ChangeScene extends Trigger {
  validate(entity: Entity): boolean {
    return entity.has('tag-player');
  }
  activate(entity: Entity): void {
    console.log('Moving player to another scene');
  }
  constructor() {
    super('change-scene');
  }
}
