import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class LocationVisitEvent extends Component {
  constructor() {
    super('location-visit-event');
  }

  @type('string') visitor: string;
  @type('string') location: string;

  init(state: Record<string, any>) {}
}
