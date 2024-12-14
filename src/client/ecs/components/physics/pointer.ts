import { Component } from '@client/core/ecs/component/component';

export class Pointer extends Component {
  constructor() {
    super('pointer');
  }

  public x: number;
  public y: number;

  public lastX: number = null;
  public lastY: number = null;
}
