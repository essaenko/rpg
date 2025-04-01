import { Entity } from './entity';
import type { EntitySchema } from '@shared/ecs/entity';
import type { NetworkComponent as Component } from '@shared/ecs/component';
import { isKeyOf } from '@client/utils/types';
import { Components } from '@client/ecs/components/map';
import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { GetCallbackProxy } from '@colyseus/schema';

export class NetworkEntity extends Entity {
  constructor(
    id: string,
    private $: GetCallbackProxy,
  ) {
    super(id);
  }

  private _schema: EntitySchema;

  destroy(): void {
    super.destroy();
  }

  observe(eSchema: EntitySchema) {
    this.$(eSchema).listen('id', (value: string) => {
      this.id = value;
    });

    this.on('entity:destroy', this.$(eSchema).components.onAdd((cSchema: Component) => {
      this.onAddComponent(cSchema);
    }, false));

    this.on('entity:destroy', this.$(eSchema).components.onRemove((cSchema: Component) => {
      this.remove(cSchema.name);
    }));

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
      this.add(component);

      if (component instanceof NetworkComponent) {

        this.$(cSchema).bindTo(component);
        component.on('component:destroy', this.$(cSchema).onChange(() => {
          component.emit('component:change');
        }));
        for (const key in cSchema) {
          component.on('component:destroy', this.$(cSchema).listen(key, () => {
            component.emit('component:change');
          }));
        }
      }
    }
  }
}
