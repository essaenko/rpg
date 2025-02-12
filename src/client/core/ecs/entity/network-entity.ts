import { Entity } from './entity';
import type { EntitySchema } from '@shared/ecs/entity';
import type { NetworkComponent as Component} from '@shared/ecs/component';
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
    this.$(eSchema).listen('id', (value) => {
      this.id = value;
    });

    this.$(eSchema).components.onAdd((cSchema) => {
      this.onAddComponent(cSchema);
    }, false);

    this.$(eSchema).components.onRemove((cSchema) => {
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
        this.$(cSchema).bindTo(component);
        this.$(cSchema).onChange(() => {
          component.emit('component:change');
        });
      }
    }
  }
}
