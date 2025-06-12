import { Component } from '@shared/ecs/component';
import { InteractionTypes } from '@shared/types';

export class InteractableObject extends Component {
  public action: InteractionTypes = null;
  public loot: string = null;
  public locked: boolean = false;
  public releaseAt: number = 0;
  public lockDuration: number = 0;

  constructor() {
    super('interactable-object');
  }

  init(state: Record<string, any>): void {
    throw new Error('Method not implemented.');
  }
}
