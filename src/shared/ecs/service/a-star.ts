import { TiledMapLayer } from '@shared/utils/types';
import Easystar from 'easystarjs';
import { Pointer2D } from '@shared/types';
import { Service } from '@shared/ecs/service/service';

export type Path = Pointer2D[];

export class AStarService extends Service {
  private readonly grid: number[][] = [];
  private readonly eStar = new Easystar.js();
  constructor(layer: TiledMapLayer) {
    super('a-star');
    for (let i = 0; i < layer.data.length; i += layer.width) {
      this.grid.push(layer.data.slice(i, i + layer.width));
    }

    this.eStar.setGrid(this.grid);
    this.eStar.setAcceptableTiles([0]);
    this.eStar.enableDiagonals();
  }

  /**
   * Finds a path to destination point if possible. Returns path in TILES not in coordinates
   * @param from
   * @param to
   */
  async find(from: Pointer2D, to: Pointer2D): Promise<Path | null> {
    return await new Promise((resolve) => {
      this.eStar.findPath(from.x, from.y, to.x, to.y, (path) => {
        resolve(path);
      });

      this.eStar.calculate();
    });
  }
}
