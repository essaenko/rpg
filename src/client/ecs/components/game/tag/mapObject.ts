import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { MapObject as ObjectComponentSchema } from '@server/ecs/components/game/tag/mapObject';

export class MapObject extends NetworkComponent {
  public type: string;
  public gid: number;
  constructor() {
    super('tag-object');
  }
}
