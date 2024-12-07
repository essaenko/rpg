import { Component } from '@client/core/ecs/component/component';
import Sprite = Phaser.GameObjects.Sprite;

export class SpriteComponent extends Component {
  public sprite: Sprite;

  constructor() {
    super('sprite');
  }

  destroy() {
    super.destroy();

    this.sprite?.destroy(true);
  }
}
