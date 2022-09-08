export const isBrowser = typeof window !== 'undefined';

export let __DEV__ = true;

export function enableProdMode() {
  __DEV__ = false;
  if (isBrowser) {
    delete (window as any).$$stores;
    delete (window as any).$$queries;
  }
}

// @internal
export function isDev() {
  return __DEV__;
}
