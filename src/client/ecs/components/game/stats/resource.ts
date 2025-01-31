import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { Resource as ResourceSchema } from '@server/ecs/components/game/stats/resource/resource';
import { ResourceType } from '@shared/types';

export class Resource extends NetworkComponent {
  public max: number;
  public current: number;
  public type: ResourceType;

  constructor() {
    super('resource');
  }
}
