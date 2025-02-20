import { EventComponent } from './event';

export class LocationVisited extends EventComponent {
  constructor() {
    super('location-visited');
  }

  public location: string;
  init(state: Record<string, any>): void {
    //
  }
}

export const isLocationVisitedEvent = (event: EventComponent): event is LocationVisited => {
  return event.type === 'location-visited';
};
