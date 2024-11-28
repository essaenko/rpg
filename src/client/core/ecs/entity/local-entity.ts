import { Entity } from '@client/core/ecs/entity/entity';
import { nanoid } from 'nanoid';

export class LocalEntity extends Entity {
  constructor() {
    super(nanoid(9));
  }
}
