import fs from 'fs/promises';
import path from 'path';

const clientPath = path.resolve(__dirname, '../client');

(async () => {
  try {
    const aseprites = await fs.readdir(path.resolve(clientPath, './assets/sprites/aseprite'));
    const assets: {
      [name: string]: {
        asset: string;
        json?: string;
        type: 'aseprite' | 'sprite';
      };
    } = {};
    const imports = [];
    const names = aseprites
      .map((file) => file.split('.').slice(0, -1).join('.'))
      .reduce((acc, name) => {
        acc.add(name);

        return acc;
      }, new Set<string>());

    for (const name of names.keys()) {
      if (aseprites.includes(`${name}.png`) && aseprites.includes(`${name}.json`)) {
        imports.push(`import ${name.replaceAll('-', '_')}Asset from './aseprite/${name}.png'`);
        imports.push(`import ${name.replaceAll('-', '_')}Json from './aseprite/${name}.json?url'`);
        assets[name] = {
          asset: `${name.replaceAll('-', '_')}Asset`,
          json: `${name.replaceAll('-', '_')}Json`,
          type: 'aseprite',
        };
      }
    }

    const template = `${imports.join(';\n')}

export const map = {
${Object.entries(assets).reduce((acc, [name, asset]) => {
  acc += `  ${name.split('-')[0]}: {
    asset: ${asset.asset},
    json: ${asset.json},
    type: '${asset.type}',
  },\n`;

  return acc;
}, '')}
} as const;

export const isAssetKey = (key: unknown): key is keyof typeof map => {
  return typeof key === 'string' && key in map;
};
`;

    await fs.writeFile(path.resolve(clientPath, './assets/sprites/map.ts'), template);

    console.log('Assets map was successfully written');
    process.exit(0);
  } catch (e) {
    console.warn(e);
    process.exit(1);
  }
})();
