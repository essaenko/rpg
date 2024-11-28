import DummyTile from './dummy-tile.png';
import GroundAsset from '@client/assets/tilesets/fantasy-lands/ground.png';
import GroundDecPropsAsset from '@client/assets/tilesets/fantasy-lands/ground_dec_props.png';
import HillsAsset from '@client/assets/tilesets/fantasy-lands/hills.png';
import DecorationsMediumAsset from '@client/assets/tilesets/fantasy-lands/decorations_medium.png';
import TreeAsset from '@client/assets/tilesets/fantasy-lands/Tree_A_v1.png';

import DummyTiledMapAsset from '@shared/maps/dummy/dummy.json?url';

export const map = {
  dummy: {
    map: {
      key: 'dummy-tiled-map',
      asset: DummyTiledMapAsset,
    },
    assets: [
      {
        key: 'dummy-tile',
        asset: DummyTile,
        type: 'sprite',
        config: {
          frameWidth: 32,
          frameHeight: 32,
        },
      },
      {
        key: 'ground',
        asset: GroundAsset,
        type: 'sprite',
        config: {
          frameWidth: 32,
          frameHeight: 32,
        },
      },
      {
        key: 'ground_dec_props',
        asset: GroundDecPropsAsset,
        type: 'sprite',
        config: {
          frameWidth: 32,
          frameHeight: 32,
        },
      },
      {
        key: 'decorations_medium',
        asset: DecorationsMediumAsset,
        type: 'sprite',
        config: {
          frameWidth: 64,
          frameHeight: 64,
        },
      },
      {
        key: 'hills',
        asset: HillsAsset,
        type: 'sprite',
        config: {
          frameWidth: 32,
          frameHeight: 32,
        },
      },
      {
        key: 'tree',
        asset: TreeAsset,
        type: 'sprite',
        config: {
          frameWidth: 128,
          frameHeight: 128,
        },
      },
    ],
  },
} as const;

export const isMapBundleKey = (name: string): name is keyof typeof map => {
  return name in map;
};
