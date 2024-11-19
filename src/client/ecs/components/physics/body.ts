import type { BodyComponent as BodySchema } from '@server/ecs/components/physics/body';

import { NetworkComponent } from '@client/core/ecs/component/network-component';

export class BodyComponent extends NetworkComponent {
  public width: number;
  public height: number;
  public pivotX: number;
  public pivotY: number;

  constructor() {
    super('body');
  }

  observe(schema: BodySchema) {
    schema.onChange(() => {
      this.width = schema.width;
      this.height = schema.height;
      this.pivotX = schema.pivotX;
      this.pivotY = schema.pivotY;
    });
  }
}
