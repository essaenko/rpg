export type RoutePathObject = { x: number; y: number; polygon: { x: number; y: number }[] };

export const isRoutePathObject = (object: unknown): object is RoutePathObject => {
  return (
    typeof object === 'object' &&
    object !== null &&
    'x' in object &&
    'y' in object &&
    'polygon' in object &&
    Array.isArray(object.polygon)
  );
};

export const createPathFromPolygons = (object: RoutePathObject) => {
  return object.polygon.map(({ x, y }) => ({
    x: object.x + x,
    y: object.y + y,
  }));
};
