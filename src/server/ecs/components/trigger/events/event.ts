import { Component } from '@shared/ecs/component';

export class EventComponent extends Component {
  constructor(public type: string) {
    super('event');
  }
  public processed: boolean = false;

  init(state: Record<string, any>): void {
    //
  }
}
