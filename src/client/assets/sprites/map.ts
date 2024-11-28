import DummyAsset from './dummy/dummy-sprite.png';
import DummyJson from './dummy/dummy-sprite.json?url';

export const map = {
  dummy: {
    asset: DummyAsset,
    json: DummyJson,
    type: 'aseprite',
  },
} as const;
