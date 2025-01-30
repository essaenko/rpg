import { Component } from '@client/core/ecs/component/component';
import Phaser from 'phaser';
type Light = Phaser.GameObjects.Light;

export class LightSource extends Component {
  public source: Light = null;

  constructor() {
    super('light-source');
  }
}
