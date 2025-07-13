import path from 'path';
import { assets, maps } from '@shared/maps/mapping';
import fs from 'node:fs';

const shared = path.resolve(process.cwd(), 'src/shared');

Object.entries(maps).forEach(([key, map]) => {
  map.tilesets.forEach((set, index) => {
    if ('source' in set) {
      const source = set.source as string;
      const file = path.resolve(shared, './maps/tilesets', source.split('tilesets/')[1]);
      const content = fs.readFileSync(file);

      map.tilesets[index] = {
        firstgid: set.firstgid,
        ...JSON.parse(content.toString()),
      };
    }
  });

  const file = path.resolve(shared, `.${assets[key as keyof typeof assets].split('@shared')[1].split('?')[0]}`);

  fs.writeFileSync(file, JSON.stringify(map));
});
