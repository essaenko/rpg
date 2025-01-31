import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { InteractableObject as InteractableObjectSchema } from '@server/ecs/components/game/mechanics/interactable-object';
import { InteractionTypes } from '@shared/types';

export class InteractableObject extends NetworkComponent {
  public action: InteractionTypes = null;
  public loot: string = null;
  public locked: boolean = false;

  constructor() {
    super('interactable-object');
  }
}
