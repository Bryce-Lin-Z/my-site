import { isTauri } from '@tauri-apps/api/core'
import { Store } from '@tauri-apps/plugin-store'

let storePromise: Promise<Store> | null = null

export function getTauriStore(): Promise<Store> {
  if (!storePromise) storePromise = Store.load('lc-data.json')
  return storePromise
}

export { isTauri }
