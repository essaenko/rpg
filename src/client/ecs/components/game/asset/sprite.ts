import { Component } from '@client/core/ecs/component/component';
import GOSprite = Phaser.GameObjects.Sprite;

export class Sprite extends Component {
  public sprite: GOSprite;

  constructor() {
    super('sprite');
  }

  destroy() {
    super.destroy();

    this.sprite?.destroy(true);
  }
}
