import { TiledMap } from '@shared/utils/types';
import { Pointer2D, Body, Triangle } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { Collider } from '@server/ecs/components/physics/collider';

export const getTileXY = (tile: number, map: TiledMap): Pointer2D => {
  return {
    x: (tile % map.width) * map.tilewidth,
    y: Math.floor(tile / map.width) * map.tileheight,
  };
};

const determinant = (p1: Pointer2D, p2: Pointer2D, p3: Pointer2D) =>
  (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

const isLineIntersecting = (a: Pointer2D, b: Pointer2D, c: Pointer2D, d: Pointer2D): boolean => {
  const d1 = determinant(c, d, a);
  const d2 = determinant(c, d, b);
  const d3 = determinant(a, b, c);
  const d4 = determinant(a, b, d);

  return d1 * d2 < 0 && d3 * d4 < 0;
};

function projectionsOverlap(aMin: number, aMax: number, bMin: number, bMax: number): boolean {
  return !(aMax < bMin || bMax < aMin);
}

// SAT: Получение проекций точек на ось
function projectPoints(points: Pointer2D[], axis: Pointer2D): [number, number] {
  const projections = points.map((point) => point.x * axis.x + point.y * axis.y);
  return [Math.min(...projections), Math.max(...projections)];
}

const satCollision = (b1: Pointer2D & Body, t1: Triangle): boolean => {
  const edges = [
    // Прямоугольник: горизонтальная и вертикальная оси
    { x: b1.width, y: b1.y },
    { x: b1.x, y: b1.height },
    // Треугольник: нормали к его сторонам
    { x: t1.b.x - t1.a.x, y: t1.b.y - t1.a.y },
    { x: t1.c.x - t1.b.x, y: t1.c.y - t1.b.y },
    { x: t1.a.x - t1.c.x, y: t1.a.y - t1.c.y },
  ];

  const rectPoints: Pointer2D[] = [
    { x: b1.x, y: b1.y },
    { x: b1.x + b1.width, y: b1.y },
    { x: b1.x + b1.width, y: b1.y + b1.height },
    { x: b1.x, y: b1.y + b1.height },
  ];
  const triPoints = [t1.a, t1.b, t1.c];

  for (const edge of edges) {
    const axis = { x: -edge.y, y: edge.x }; // Перпендикулярная ось

    const [rectMin, rectMax] = projectPoints(rectPoints, axis);
    const [triMin, triMax] = projectPoints(triPoints, axis);

    if (!projectionsOverlap(rectMin, rectMax, triMin, triMax)) {
      // Нет перекрытия на оси — столкновения нет
      return false;
    }
  }

  // Проекции всех осей перекрываются — столкновение есть
  return true;
};

export const collideTriangle = (b1: Pointer2D & Body, t1: Triangle): boolean => {
  const rEdges: Pointer2D[][] = [
    [
      { x: b1.x, y: b1.y },
      { x: b1.x + b1.width, y: b1.y },
    ],
    [
      { x: b1.x + b1.width, y: b1.y },
      { x: b1.x + b1.width, y: b1.y + b1.height },
    ],
    [
      { x: b1.x + b1.width, y: b1.y + b1.height },
      { x: b1.x, y: b1.y + b1.height },
    ],
    [
      { x: b1.x, y: b1.y + b1.height },
      { x: b1.x, y: b1.y },
    ],
  ];
  const tEdges = [
    [t1.a, t1.b],
    [t1.b, t1.c],
    [t1.c, t1.a],
  ];

  for (const [r1, r2] of rEdges) {
    for (const [t1, t2] of tEdges) {
      if (isLineIntersecting(r1, r2, t1, t2)) {
        return true;
      }
    }
  }

  return satCollision(b1, t1);
};
export const collide = (b1: Pointer2D & Body, b2: Pointer2D & Body): boolean => {
  return (
    collideSide({ c: b1.x, p: b1.width }, { c: b2.x, p: b2.width }) &&
    collideSide({ c: b1.y, p: b1.height }, { c: b2.y, p: b2.height })
  );
};

export const getCollider = (entity: Entity): Pointer2D & Body => {
  const pos = entity.get('position') as unknown as Pointer2D;
  const body = entity.get('body') as unknown as Body;
  const collider = entity.get<Collider>('collider');

  return {
    x: pos.x - body.width / 2 + (collider?.x ?? 0),
    y: pos.y - body.height / 2 + (collider?.y ?? 0),
    width: (collider?.width || null) ?? body.width,
    height: (collider?.height || null) ?? body.height,
  };
};

export const collideSide = (s1: { c: number; p: number }, s2: { c: number; p: number }): boolean => {
  return s1.c < s2.c + s2.p && s1.c + s1.p > s2.c;
};
