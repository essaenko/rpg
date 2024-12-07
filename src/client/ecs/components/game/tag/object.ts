import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { ObjectComponent as ObjectComponentSchema } from '@server/ecs/components/game/tag/object';

export class ObjectComponent extends NetworkComponent {
  public type: string;
  public gid: number;
  constructor() {
    super('tag-object');
  }

  observe(schema: ObjectComponentSchema): void {
    schema.onChange(() => {
      this.type = schema.type;
      this.gid = schema.gid;
    });
  }
}
