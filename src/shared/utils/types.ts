export type TiledMapObject = {
  gid?: number;
  height?: number;
  id: number;
  name: string;
  point?: boolean;
  rotation: number;
  type: string;
  visible: boolean;
  width?: number;
  x: number;
  y: number;
};

export type TiledMapTilesetTile = {
  id: number;
  objectgroup?: {
    id: number;
    name: string;
    type: string;
    objects: TiledMapObject[];
  };
};

export type TiledMapLayer = {
  data?: number[];
  height?: number;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width?: number;
  x: number;
  y: number;
  objects?: TiledMapObject[];
  layers?: TiledMapLayer[];
};

export type TiledMapTileset = {
  columns: number;
  firstgid: number;
  image?: string;
  imageheight?: number;
  imagewidth?: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tilewidth: number;
  tiles?: TiledMapTilesetTile[];
};

export type TiledMap = {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: TiledMapLayer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: TiledMapTileset[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
};
