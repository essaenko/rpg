import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';
import { InteractionTypes } from '@shared/types';

export class InteractableObject extends Component {
  @type('number') action: InteractionTypes = null;
  @type('string') loot: string = null;

  constructor() {
    super('interactable-object');
  }

  init(state: Record<string, any>): void {
    throw new Error('Method not implemented.');
  }
}
