import { describe, expect, it } from 'vitest';
import { createAssetURL } from './assets';

describe('createAssetURL function', () => {
  it('Returns a valid TR asset URL', () => {
    const res = createAssetURL('image', 'logos/US0231351067/v2');
    expect('https://assets.traderepublic.com/img/logos/US0231351067/v2/dark.min.svg').toBe(res);
  });
});
