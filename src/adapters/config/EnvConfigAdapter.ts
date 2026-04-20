/**
 * EnvConfigAdapter
 *
 * Reads affiliate program keys from Astro/Vite environment variables.
 * Used as a local-development fallback when Firebase credentials are not configured.
 *
 * Maps Remote Config key names → import.meta.env variable names:
 *   viator_api_key      → VIATOR_API_KEY
 *   viator_partner_id   → VIATOR_PARTNER_ID
 *   gyg_partner_id      → GYG_PARTNER_ID
 *   civitatis_aid       → CIVITATIS_AID
 */
import type { IConfigRepository } from '../../core/ports/IConfigRepository';

const KEY_MAP: Record<string, string> = {
  viator_api_key: 'VIATOR_API_KEY',
  viator_partner_id: 'VIATOR_PARTNER_ID',
  gyg_partner_id: 'GYG_PARTNER_ID',
  civitatis_aid: 'CIVITATIS_AID',
};

export class EnvConfigAdapter implements IConfigRepository {
  async get(key: string): Promise<string | null> {
    const envKey = KEY_MAP[key] ?? key.toUpperCase();
    const value = import.meta.env[envKey] as string | undefined;
    return value && value.trim() !== '' ? value : null;
  }
}
