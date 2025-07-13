import fs from 'fs';
import path from 'path';

const cli_args = process.argv.slice(2);

if (cli_args.length === 0 || cli_args[0] === '-h' || cli_args[0] === '--help') {
  console.log('Usage: codegen');

  process.exit(0);
}

const dir = path.resolve(process.cwd(), './src/client/ecs/systems');
const targetPath = path.resolve(dir, cli_args[0]);

if (!fs.existsSync(targetPath)) {
  console.error('Could not find target directory');

  process.exit(1);
}

const name = cli_args[1];

if (!name) {
  console.error('System name cannot be empty');

  process.exit(1);
}

const fileName =
  name
    .split('')
    .map((char, index) => {
      if (char.toLowerCase() !== char && index > 0) {
        return `-${char.toLowerCase()}`;
      }

      return char.toLowerCase();
    })
    .join('') + '.ts';

fs.writeFileSync(
  path.resolve(targetPath, fileName),
  `import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { WorldScene } from '@client/core/scene/world-scene';

export class ${name}System extends System {
  constructor() {
    super('${name}');
  }
  onUpdate(scene: WorldScene, container: ECSContainer, delta: number): void {}
}
`,
);
