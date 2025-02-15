import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'main-stats' },
    },
    {
      $push: {
        components: {
          name: 'main-stats',
          intellect: 10,
          strength: 10,
          agility: 10,
        },
      } as any,
    },
  );
  await collection.updateMany(
    {
      'components.name': { $ne: 'secondary-stats' },
    },
    {
      $push: {
        components: {
          name: 'secondary-stats',
          crit: 0,
          armor: 0,
          attackPower: 0,
          spellPower: 0,
          parry: 0,
          avoid: 0,
          block: 0,
        },
      } as any,
    },
  );
};
