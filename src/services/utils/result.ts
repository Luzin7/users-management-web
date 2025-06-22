export type Result<T, E = unknown> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T, E = unknown>(data: T): Result<T, E> {
  return { success: true, data };
}

export function fail<E = unknown>(error: E): Result<never, E> {
  return { success: false, error };
}