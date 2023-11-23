const TR_IMAGE_ASSETS_BASE = 'https://assets.traderepublic.com';
const TR_IMAGE_DARK = '/dark.min.svg';
// const TR_IMAGE_LIGHT = '/light.min.svg';

export function createAssetURL (type: 'image', assetPart: string) {
  switch (type) {
    case 'image':
      return `${TR_IMAGE_ASSETS_BASE}/img/${assetPart}${TR_IMAGE_DARK}`;
  }
}
