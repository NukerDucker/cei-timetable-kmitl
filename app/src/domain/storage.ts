import type { StorageLike } from './types'

/** localStorage when available, otherwise null (private mode, SSR, tests). */
export function browserStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

export function readStorageJson(storage: StorageLike | null, key: string): unknown {
  try {
    const raw = storage?.getItem(key)
    return raw ? (JSON.parse(raw) as unknown) : null
  } catch {
    return null
  }
}

export function writeStorageJson(storage: StorageLike | null, key: string, value: unknown): boolean {
  if (!storage) return false
  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
