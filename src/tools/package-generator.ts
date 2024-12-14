import fs from 'node:fs';
import path from 'path';
import { assets as assetsURIs, maps } from '@shared/maps/mapping';

type MapPackage = {
  map: {
    key: string;
    asset: string;
  };
  assets: {
    key: string;
    asset: string;
    type: 'sprite';
    config: {
      frameWidth: number;
      frameHeight: number;
    };
  }[];
};

const clientPath = path.resolve(__dirname, '../client');
const imports: Map<string, string> = new Map();
const packages: Map<string, MapPackage> = new Map();

for (let key in maps) {
  const map = maps[key];
  const tilesets = map.tilesets;
  const assets: MapPackage['assets'] = [];

  for (let set of tilesets) {
    const asset = `@client/${path.relative(clientPath, path.resolve(__dirname, '../client', `./${set.image.split('client')[1]}`))}`;
    const assetImport = `import ${set.name.replaceAll('-', '_')}Asset from '${asset}';`;
    imports.set(set.name, assetImport);

    assets.push({
      key: set.name,
      asset: `${set.name.replaceAll('-', '_')}Asset`,
      type: 'sprite',
      config: {
        frameWidth: set.tilewidth,
        frameHeight: set.tileheight,
      },
    });
  }

  packages.set(key, {
    map: {
      key: `${key}-tiled-map`,
      asset: `${key.replaceAll('-', '_')}_json_map`,
    },
    assets,
  });

  imports.set(
    `${key}_json_map`,
    `import ${key.replaceAll('-', '_')}_json_map from '${assetsURIs[key as keyof typeof assetsURIs]}';`,
  );
}

const template = `
${imports.values().toArray().join('\n')}

export const map = {
  ${packages
    .entries()
    .map(
      ([key, pack]) => `'${key}': {
      map: {
        key: '${pack.map.key}',
        asset: ${pack.map.asset}
      },
      assets: [${pack.assets
        .map(
          (asset) => `{
        key: '${asset.key}',
        type: '${asset.type}',
        asset: ${asset.asset},
        config: ${JSON.stringify(asset.config)}
        }`,
        )
        .join(',')}]
    }`,
    )
    .toArray()
    .join(',\n')}
};

export const isMapBundleKey = (name: string): name is keyof typeof map => {
  return name in map;
};
`;

fs.writeFile(path.resolve(clientPath, './assets/tilesets/map.ts'), template, (error) => {
  if (error) {
    console.warn(error);
    return;
  }

  console.log('Package file was successfully written');
});

// console.log(template);
