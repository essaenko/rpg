import { MDBClient } from '..';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'equip' },
    },
    {
      $push: {
        components: {
          name: 'equip',
          mainHand: 'ssfSE_2hy',
        },
      } as any,
    },
  );
};
