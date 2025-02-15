import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'appearance' },
    },
    {
      $push: {
        components: {
          name: 'appearance',
          key: 'dummy',
          animation: 1,
        },
      } as any,
    },
  );
};
