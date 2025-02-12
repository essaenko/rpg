import { migration as bag } from './bag.migration';
import { migration as quests } from './quests.migration';
import { migration as spellBook } from './spell-book.migration';
import { migration as equip } from './equip.migration';

(async () => {
  for (let migration of [bag, quests, spellBook, equip]) {
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
