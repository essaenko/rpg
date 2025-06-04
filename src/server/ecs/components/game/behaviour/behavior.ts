import { Component } from '@shared/ecs/component';
import { BlueshellState, Selector, Sequence } from 'blueshell';
import { Entity } from '@shared/ecs/entity';
import { ECSContainer } from '@shared/ecs';
import { map } from '@server/mechanics/behaviors/map';

type BehaviorComponentState = {
  behaviors: (keyof typeof map)[];
};

export type BehaviorState = {
  entity: Entity;
  container: ECSContainer;
} & BlueshellState;

export class Behavior extends Component {
  public behaviors: (Sequence<BehaviorState, void> | Selector<BehaviorState, void>)[] = [];

  constructor() {
    super('behavior');
  }

  init(state: BehaviorComponentState) {
    for (const bname of state.behaviors) {
      this.behaviors.push(map[bname]);
    }
  }
}
