import { migration as bag } from './bag.migration';
import { migration as quests } from './quests.migration';
import { migration as spellBook } from './spell-book.migration';
import { migration as equip } from './equip.migration';
import { migration as appearance } from './appearance.migration';
import { migration as physics } from './physics.migration';
import { migration as tag } from './tag.migration';
import { migration as classes } from './class.migration';
import { migration as resources } from './resources.migration';
import { migration as stats } from './stats.migration';
import { migration as level } from './level.migration';
import { migration as location } from './location.migration';

import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
  for (let migration of [
    bag,
    quests,
    spellBook,
    equip,
    appearance,
    physics,
    tag,
    classes,
    resources,
    stats,
    level,
    location,
  ]) {
    try {
      await migration();
    } catch (e) {
      console.error(e);
    }
  }

  console.log('Migrations finished');
  Promise.resolve();

  process.exit(0);
})();
