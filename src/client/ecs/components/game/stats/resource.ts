import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { ResourceComponent as ResourceComponentSchema } from '@server/ecs/components/game/stats/resource/resource';
import { ResourceType } from '@shared/types';

export class ResourceComponent extends NetworkComponent {
  public max: number;
  public current: number;
  public type: ResourceType;

  constructor() {
    super('resource');
  }

  observe(schema: ResourceComponentSchema): void {
    this.max = schema.max;
    this.type = schema.type;
    this.current = schema.current;

    schema.onChange(() => {
      this.max = schema.max;
      this.type = schema.type;
      this.current = schema.current;
    });
  }
}
