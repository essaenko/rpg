import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'level' },
    },
    {
      $push: {
        components: {
          name: 'level',
          level: 2,
          exp: 0,
        },
      } as any,
    },
  );
};
