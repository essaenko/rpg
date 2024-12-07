import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { Schema } from '@colyseus/schema';

export class NpcComponent extends NetworkComponent {
  constructor() {
    super('tag-npc');
  }

  observe(schema: Schema) {}
}
