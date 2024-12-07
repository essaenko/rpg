import { TiledMapLayer } from '@shared/utils/types';
import Easystar from 'easystarjs';
import { Position } from '@shared/types';
import { Service } from '@shared/ecs/service/service';

export type Path = Position[];

export class AStarService extends Service {
  public name = 'a-star';
  private readonly grid: number[][] = [];
  private readonly eStar = new Easystar.js();
  constructor(layer: TiledMapLayer) {
    super();
    for (let i = 0; i < layer.data.length; i += layer.width) {
      this.grid.push(layer.data.slice(i, i + layer.width));
    }

    this.eStar.setGrid(this.grid);
    this.eStar.setAcceptableTiles([0]);
    this.eStar.enableDiagonals();
  }

  async find(from: Position, to: Position): Promise<Path | null> {
    return await new Promise((resolve) => {
      this.eStar.findPath(from.x, from.y, to.x, to.y, (path) => {
        resolve(path);
      });

      this.eStar.calculate();
    });
  }
}
