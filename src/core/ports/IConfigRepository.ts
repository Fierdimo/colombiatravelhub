/**
 * Port — provides access to remote/external configuration values.
 * Adapters: FirebaseRemoteConfigAdapter (production), EnvConfigAdapter (local dev).
 */
export interface IConfigRepository {
  /** Returns the value for the given key, or null if not set / not found. */
  get(key: string): Promise<string | null>;
}
