import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'location' },
    },
    {
      $push: {
        components: {
          name: 'location',
          value: 'dummy',
        },
      } as any,
    },
  );
};
