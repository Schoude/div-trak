import { describe, expect, it } from 'vitest';
import { createAssetURL } from './assets';

const assetsUrlBase = import.meta.env.VITE_TR_IMAGE_ASSETS_BASE;

describe('createAssetURL function', () => {
  it('Returns a valid TR asset URL', () => {
    const res = createAssetURL('image', 'logos/US0231351067/v2');
    expect(`${assetsUrlBase}/img/logos/US0231351067/v2/dark.min.svg`).toBe(res);
  });
});
