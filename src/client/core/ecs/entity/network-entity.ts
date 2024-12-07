import { Entity } from './entity';
import type { Entity as EntitySchema } from '@shared/ecs/entity';
import type { Component } from '@shared/ecs/component';
import { isKeyOf } from '@client/utils/types';
import { Components } from '@client/ecs/components/map';
import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class NetworkEntity extends Entity {
  constructor(id: string) {
    super(id);
  }

  destroy(): void {
    super.destroy();
  }

  observe(eSchema: EntitySchema) {
    eSchema.components.onAdd((cSchema) => {
      this.onAddComponent(cSchema);
    }, false);

    eSchema.components.onRemove((cSchema) => {
      this.removeComponent(cSchema.name);
    });
  }

  onAddComponent(cSchema: Component) {
    const name = cSchema.name;
    if (isKeyOf(name, Components)) {
      const Factory = Components[name as keyof typeof Components];
      const component = new Factory();
      this.addComponent(component);

      if (component instanceof NetworkComponent) {
        component.observe(cSchema as any);
      }
    }
  }
}
