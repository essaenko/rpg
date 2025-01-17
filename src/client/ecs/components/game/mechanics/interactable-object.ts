import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { InteractableObject as InteractableObjectSchema } from '@server/ecs/components/game/mechanics/interactable-object';
import { InteractionTypes } from '@shared/types';

export class InteractableObject extends NetworkComponent {
  public action: InteractionTypes = null;
  public loot: string = null;
  public locked: boolean = false;

  observe(schema: InteractableObjectSchema): void {
    schema.onChange(() => {
      this.action = schema.action;
      this.loot = schema.loot;
      this.locked = schema.locked;
    });
  }

  constructor() {
    super('interactable-object');
  }
}
