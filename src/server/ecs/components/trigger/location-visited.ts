import { Entity } from '@shared/ecs/entity';
import { Trigger } from './trigger';
import { LocationVisited as LocationVisitedEvent } from './events/location-visited';

export class LocationVisited extends Trigger {
  public location: string;
  constructor() {
    super('location-visited');
  }

  activate(entity: Entity): void {
    const event = new LocationVisitedEvent();
    event.location = this.location;

    entity.add(event);
  }

  validate(entity: Entity): boolean {
    return entity.has('tag-player');
  }
}
