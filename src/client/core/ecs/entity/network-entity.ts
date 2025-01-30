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

  private _schema: EntitySchema;

  destroy(): void {
    super.destroy();
  }

  observe(eSchema: EntitySchema) {
    eSchema.onChange(() => {
      this.id = eSchema.id;
    });

    eSchema.components.onAdd((cSchema) => {
      this.onAddComponent(cSchema);
    }, false);

    eSchema.components.onRemove((cSchema) => {
      this.removeComponent(cSchema.name);
    });

    this._schema = eSchema;
  }

  get schema() {
    return this._schema;
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
