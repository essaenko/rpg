import { SightDirectionComponent } from '@client/ecs/components/physics/sight-direction';
import { NetworkEntity } from '@client/core/ecs/entity/network-entity';

export class Character extends NetworkEntity {
  constructor(id: string) {
    super(id);

    this.addComponent(new SightDirectionComponent());
  }
}
