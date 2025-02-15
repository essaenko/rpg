import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'spell-book' },
    },
    {
      $push: {
        components: {
          name: 'spell-book',
          spells: ['1', '5'],
        },
      } as any,
    },
  );
};
