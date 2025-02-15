import { MDBClient } from '..';

import { Class } from '@shared/types';

export const migration = async (): Promise<void> => {
  const collection = MDBClient.instance().db.collection('characters');
  await collection.updateMany(
    {
      'components.name': { $ne: 'class' },
    },
    {
      $push: {
        components: {
          name: 'class',
          class: Class.Warrior,
        },
      } as any,
    },
  );
};
