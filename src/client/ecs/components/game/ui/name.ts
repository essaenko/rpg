import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { Name as NameScheme } from '@server/ecs/components/game/ui/name';

export class Name extends NetworkComponent {
  constructor() {
    super('name');
  }

  value: string = '';
}
