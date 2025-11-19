import { Component } from '@client/core/ecs/component/component';
import Image = Phaser.GameObjects.Image;

export class Pointer extends Component {
  constructor() {
    super('pointer');
  }

  public x: number;
  public y: number;

  public lastX: number = null;
  public lastY: number = null;

  public frame: Image = null;

  public destroy(): void {
    super.destroy();
    this.frame?.destroy();
  }
}
