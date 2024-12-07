
import groundAsset from '@client/assets/tilesets/fantasy-lands/ground.png';
import hillsAsset from '@client/assets/tilesets/fantasy-lands/hills.png';
import dummy_tileAsset from '@client/assets/tilesets/dummy-tile.png';
import ground_dec_propsAsset from '@client/assets/tilesets/fantasy-lands/ground_dec_props.png';
import decorations_mediumAsset from '@client/assets/tilesets/fantasy-lands/decorations_medium.png';
import treeAsset from '@client/assets/tilesets/fantasy-lands/Tree_A_v1.png';
import small_buildingsAsset from '@client/assets/tilesets/fantasy-lands/small_buildings.png';
import dummy_json_map from '@shared/maps/dummy/dummy.json?url';
import wooden_wallsAsset from '@client/assets/tilesets/fantasy-lands/interrior/Walls/FL_Houses_int_WallsD.png';
import floorsAsset from '@client/assets/tilesets/fantasy-lands/interrior/Floors/FL_Houses_int_Floors.png';
import internalsAsset from '@client/assets/tilesets/fantasy-lands/interrior/FL_Houses_int_sidesOfTheHouses.png';
import elementsAsset from '@client/assets/tilesets/fantasy-lands/interrior/FL_Houses_int_building elements.png';
import fire_placeAsset from '@client/assets/tilesets/fantasy-lands/interrior/Furnitures/FL_Houses_int_FurnituresC.png';
import beds_and_drobesAsset from '@client/assets/tilesets/fantasy-lands/interrior/Furnitures/FL_Houses_int_FurnituresA.png';
import kitchenAsset from '@client/assets/tilesets/fantasy-lands/interrior/Furnitures/FL_Houses_int_FurnituresB.png';
import dummy_house_json_map from '@shared/maps/dummy/dummy-house.json?url';
import tree_aAsset from '@client/assets/tilesets/fantasy-lands/Tree_A_v1.png';
import tree_bAsset from '@client/assets/tilesets/fantasy-lands/Tree_B_v1.png';
import water_envAsset from '@client/assets/tilesets/fantasy-lands/water_env.png';
import interborder_json_map from '@shared/maps/interborder/interborder.json?url';

export const map = {
  'dummy': {
      map: {
        key: 'dummy-tiled-map',
        asset: dummy_json_map
      },
      assets: [{
        key: 'ground',
        type: 'sprite',
        asset: groundAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'hills',
        type: 'sprite',
        asset: hillsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'dummy-tile',
        type: 'sprite',
        asset: dummy_tileAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'ground_dec_props',
        type: 'sprite',
        asset: ground_dec_propsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'decorations_medium',
        type: 'sprite',
        asset: decorations_mediumAsset,
        config: {"frameWidth":64,"frameHeight":64}
        },{
        key: 'tree',
        type: 'sprite',
        asset: treeAsset,
        config: {"frameWidth":128,"frameHeight":128}
        },{
        key: 'small-buildings',
        type: 'sprite',
        asset: small_buildingsAsset,
        config: {"frameWidth":160,"frameHeight":192}
        }]
    },
'dummy-house': {
      map: {
        key: 'dummy-house-tiled-map',
        asset: dummy_house_json_map
      },
      assets: [{
        key: 'wooden_walls',
        type: 'sprite',
        asset: wooden_wallsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'floors',
        type: 'sprite',
        asset: floorsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'internals',
        type: 'sprite',
        asset: internalsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'elements',
        type: 'sprite',
        asset: elementsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'fire_place',
        type: 'sprite',
        asset: fire_placeAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'beds_and_drobes',
        type: 'sprite',
        asset: beds_and_drobesAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'kitchen',
        type: 'sprite',
        asset: kitchenAsset,
        config: {"frameWidth":32,"frameHeight":32}
        }]
    },
'interborder': {
      map: {
        key: 'interborder-tiled-map',
        asset: interborder_json_map
      },
      assets: [{
        key: 'ground',
        type: 'sprite',
        asset: groundAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'hills',
        type: 'sprite',
        asset: hillsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'tree_a',
        type: 'sprite',
        asset: tree_aAsset,
        config: {"frameWidth":128,"frameHeight":128}
        },{
        key: 'tree_b',
        type: 'sprite',
        asset: tree_bAsset,
        config: {"frameWidth":160,"frameHeight":176}
        },{
        key: 'ground_dec_props',
        type: 'sprite',
        asset: ground_dec_propsAsset,
        config: {"frameWidth":32,"frameHeight":32}
        },{
        key: 'decorations_medium',
        type: 'sprite',
        asset: decorations_mediumAsset,
        config: {"frameWidth":64,"frameHeight":64}
        },{
        key: 'water_env',
        type: 'sprite',
        asset: water_envAsset,
        config: {"frameWidth":32,"frameHeight":32}
        }]
    }
};

export const isMapBundleKey = (name: string): name is keyof typeof map => {
  return name in map;
};
