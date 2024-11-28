import { Component } from '@client/core/ecs/component/component';
import Sprite = Phaser.GameObjects.Sprite;

export class SpriteComponent extends Component {
  public sprite: Sprite;

  constructor() {
    super('sprite');
  }

  onRemove() {
    super.onRemove();

    this.sprite?.destroy(true);
  }
}
