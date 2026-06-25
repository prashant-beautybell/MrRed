import { isAuthSkipped } from "@/lib/dev-auth";

export function useDevStore() {
  return isAuthSkipped();
}

export async function withDataStore<T>(
  dbFn: () => Promise<T>,
  devFn: () => T | Promise<T>
): Promise<T> {
  if (isAuthSkipped()) {
    return devFn();
  }
  try {
    return await dbFn();
  } catch {
    return devFn();
  }
}
