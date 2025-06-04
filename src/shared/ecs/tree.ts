import { Pointer2D } from '@shared/types';
import { Entity } from './entity';

export class QuadTree<T extends Entity = Entity> {
  private nodes: [QuadTree<T>, QuadTree<T>, QuadTree<T>, QuadTree<T>] = null;
  private updates: T[] = [];
  private objects: Set<T> = new Set();

  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 100,
    public height: number = 100,
    public threshold: number = 4,

    public minWidth: number = 100,
    public minHeight: number = 100,
  ) {}

  divide() {
    if (this.width === this.minWidth && this.height === this.minHeight) {
      return;
    }

    this.nodes = [
      new QuadTree<T>(
        this.x,
        this.y,
        Math.max(this.width / 2, this.minWidth),
        Math.max(this.height / 2, this.minHeight),
        this.threshold,
      ),
      new QuadTree<T>(
        this.x + this.width / 2,
        this.y,
        Math.max(this.width / 2, this.minWidth),
        Math.max(this.height / 2, this.minHeight),
        this.threshold,
      ),
      new QuadTree<T>(
        this.x + this.width / 2,
        this.y + this.height / 2,
        Math.max(this.width / 2, this.minWidth),
        Math.max(this.height / 2, this.minHeight),
        this.threshold,
      ),
      new QuadTree<T>(
        this.x,
        this.y + this.height / 2,
        Math.max(this.width / 2, this.minWidth),
        Math.max(this.height / 2, this.minHeight),
        this.threshold,
      ),
    ];

    this.allocateObjects();
  }

  public update() {
    let next = this.updates.shift();

    while (next) {
      this.remove(next);
      this.add(next);

      next = this.updates.shift();
    }
  }

  public add(obj: T) {
    if (this.objects.size >= this.threshold) {
      this.divide();
    }

    this.objects.add(obj);

    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.contains(obj)) {
          node.add(obj);

          return;
        }
      }
    }
  }

  public query(x: number, y: number, width: number, height: number): T[] {
    if (this.intersects(x, y, width, height)) {
      if (this.nodes) {
        const result = [];

        for (const node of this.nodes) {
          result.push(...node.query(x, y, width, height));
        }

        return result;
      }

      return Array.from(this.objects);
    }

    return [];
  }

  public remove(obj: T) {
    this.objects.delete(obj);

    if (this.nodes) {
      for (const node of this.nodes) {
        if (node.has(obj)) {
          node.remove(obj);
        }
      }
    }
  }

  public has(obj: T) {
    return this.objects.has(obj);
  }

  /**
   * Checks that given region is intersects with current quad
   * @param x Horizontal center of region
   * @param y Vertical center of region
   * @param width Width of region
   * @param height Height of region
   */
  public intersects(x: number, y: number, width: number, height: number) {
    return (
      x - width / 2 <= this.x + this.width &&
      x + width / 2 >= this.x &&
      y - height / 2 <= this.y + this.height &&
      y + height / 2 >= this.y
    );
  }

  public contains(obj: T): boolean {
    const pos = obj.get('position') as unknown as Pointer2D;
    return pos.x >= this.x && pos.x <= this.x + this.width && pos.y >= this.y && pos.y <= this.y + this.height;
  }

  public queue(entity: T) {
    this.updates.push(entity);
  }

  private allocateObjects() {
    for (const obj of this.objects) {
      for (const node of this.nodes) {
        if (node.contains(obj)) {
          node.add(obj);

          break;
        }
      }
    }
  }

  get isLeaf(): boolean {
    return !this.nodes;
  }
}
