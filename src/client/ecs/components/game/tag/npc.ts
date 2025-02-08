import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class NPC extends NetworkComponent {
  constructor() {
    super('tag-npc');
  }
}
