const TR_IMAGE_ASSETS_BASE = import.meta.env.VITE_TR_IMAGE_ASSETS_BASE;
const TR_IMAGE_DARK = '/dark.min.svg';
// const TR_IMAGE_LIGHT = '/light.min.svg';

export type AssetType = 'image';

export function createAssetURL (type: AssetType, assetPart: string) {
  switch (type) {
    case 'image':
      return `${TR_IMAGE_ASSETS_BASE}/img/${assetPart}${TR_IMAGE_DARK}`;
  }
}
