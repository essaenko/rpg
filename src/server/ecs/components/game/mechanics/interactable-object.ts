import { type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';
import { InteractionTypes } from '@shared/types';

export class InteractableObject extends NetworkComponent {
  @type('number') action: InteractionTypes = null;
  @type('string') loot: string = null;
  @type('boolean') locked: boolean = false;

  constructor() {
    super('interactable-object');
  }

  init(state: Record<string, any>): void {
    throw new Error('Method not implemented.');
  }
}
