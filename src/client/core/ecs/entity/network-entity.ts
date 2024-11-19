import { Entity } from './entity';

export class NetworkEntity extends Entity {
  constructor(id: string) {
    super(id);
  }

  destroy(): void {
    super.destroy();
  }
}
