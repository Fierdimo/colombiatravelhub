/**
 * FirebaseRemoteConfigAdapter
 *
 * Fetches configuration values from Firebase Remote Config at build time
 * using the REST API with service-account authentication (no firebase-admin
 * SDK needed — only Node.js built-ins).
 *
 * Required env vars (keep these in .env / Vercel environment settings):
 *   FIREBASE_PROJECT_ID      — e.g. "my-project-12345"
 *   FIREBASE_CLIENT_EMAIL    — service account email
 *   FIREBASE_PRIVATE_KEY     — PEM private key (use \n for line breaks in .env)
 *
 * Remote Config keys expected (set in Firebase console):
 *   viator_api_key        — Viator Partner API key
 *   viator_partner_id     — Viator affiliate PID
 *   gyg_partner_id        — GetYourGuide Partner ID
 *   civitatis_aid         — Civitatis Affiliate ID
 *
 * Returns null from create() when Firebase credentials are not configured,
 * so callers can fall back to EnvConfigAdapter.
 */
import { createSign } from 'node:crypto';
import type { IConfigRepository } from '../../core/ports/IConfigRepository';

interface RemoteConfigResponse {
  parameters?: Record<string, { defaultValue?: { value?: string } }>;
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/firebase.remoteconfig',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }),
  ).toString('base64url');

  const signable = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signable);
  const signature = sign.sign(privateKey, 'base64url');
  const jwt = `${signable}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`Firebase auth failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export class FirebaseRemoteConfigAdapter implements IConfigRepository {
  private constructor(private readonly params: Record<string, string>) {}

  /**
   * Fetches all Remote Config parameters once.
   * Returns null if FIREBASE_* credentials are not configured (local dev without Firebase).
   */
  static async create(): Promise<FirebaseRemoteConfigAdapter | null> {
    const projectId = import.meta.env.FIREBASE_PROJECT_ID as string | undefined;
    const clientEmail = import.meta.env.FIREBASE_CLIENT_EMAIL as string | undefined;
    const rawKey = import.meta.env.FIREBASE_PRIVATE_KEY as string | undefined;

    if (!projectId || !clientEmail || !rawKey) {
      return null;
    }

    // .env stores \n as a literal backslash-n — convert to real newlines
    const privateKey = rawKey.replace(/\\n/g, '\n');

    try {
      const token = await getAccessToken(clientEmail, privateKey);

      const res = await fetch(
        `https://firebaseremoteconfig.googleapis.com/v1/projects/${projectId}/remoteConfig`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.ok) {
        console.warn(
          `[FirebaseRemoteConfig] Failed to fetch config: ${res.status} — falling back to env vars`,
        );
        return null;
      }

      const data = (await res.json()) as RemoteConfigResponse;
      const params: Record<string, string> = {};

      for (const [key, param] of Object.entries(data.parameters ?? {})) {
        const value = param.defaultValue?.value;
        if (value !== undefined && value !== '') {
          params[key] = value;
        }
      }

      return new FirebaseRemoteConfigAdapter(params);
    } catch (err) {
      console.warn('[FirebaseRemoteConfig] Error fetching config — falling back to env vars', err);
      return null;
    }
  }

  async get(key: string): Promise<string | null> {
    return this.params[key] ?? null;
  }
}
