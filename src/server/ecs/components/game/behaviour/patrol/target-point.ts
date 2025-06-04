import { Component } from '@shared/ecs/component';
import { Pointer2D } from '@shared/types';

export class TargetPoint extends Component implements Pointer2D {
  public x: number;
  public y: number;

  constructor() {
    super('target-point');
  }

  init(): void {
  }
}