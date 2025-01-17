import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'inventory' },
    },
    {
      $push: {
        components: {
          name: 'inventory',
          items: [],
          slots: 25,
        },
      } as any,
    },
  );
};
