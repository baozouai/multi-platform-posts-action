const ASSETS_PATH = 'https://raw.githubusercontent.com/baozouai/multi-platform-posts-action/main/assets/'

export function getAssetUrl(asset: string) {
  return ASSETS_PATH + asset
}
