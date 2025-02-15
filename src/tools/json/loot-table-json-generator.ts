import { nanoid } from 'nanoid';

const table = { id: nanoid(9), items: [] };

table.items.push({
  item: nanoid(9),
  chance: 1,
});

console.log(JSON.stringify(table));
