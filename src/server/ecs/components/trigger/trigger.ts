import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';

interface TriggerInterface {
  validate(entity: Entity): boolean;
  activate(entity: Entity): void;
}

export class Trigger extends Component implements TriggerInterface {
  init(state: Record<string, any>): void {
    throw new Error('Method not implemented.');
  }

  public type: string = 'trigger';

  constructor(type: string) {
    super('trigger');

    this.type = type;
  }

  validate(entity: Entity) {
    return false;
  }

  activate(entity: Entity) {}
}
