import { config } from '../config';

interface SteamPlayerInfo {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags: number;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
}

interface SteamAPIResponse {
  response: {
    players: SteamPlayerInfo[];
  };
}

export class SteamLogin {
  private realm: string;
  private returnUrl: string;
  private apiKey: string;
  private readonly STEAM_API = 'https://steamcommunity.com/openid/login';
  private readonly STEAM_WEB_API = 'https://api.steampowered.com';

  constructor() {
    this.realm = config.steam.realm;
    this.returnUrl = config.steam.returnUrl;
    this.apiKey = config.steam.apiKey;

    // Validate configuration
    if (!this.apiKey) {
      throw new Error('Steam API key is not configured');
    }
  }

  getURLRedirect(): string {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': this.returnUrl,
      'openid.realm': this.realm,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });

    return `${this.STEAM_API}?${params.toString()}`;
  }

  getURLCheckAuthentication(query: URLSearchParams): string {
    const params = new URLSearchParams(query);
    params.set('openid.mode', 'check_authentication');
    return `${this.STEAM_API}?${params.toString()}`;
  }

  getURLPublicInfo(steamId: string): string {
    return `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamId}`;
  }

  async isValid(query: URLSearchParams): Promise<boolean> {
    const validationUrl = this.getURLCheckAuthentication(query);
    const response = await fetch(validationUrl);
    const text = await response.text();
    return text.includes('is_valid:true');
  }

  async getPublicInfo(steamId: string): Promise<SteamPlayerInfo> {
    const url = `${this.STEAM_WEB_API}/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamId}`;
    console.log('Steam API URL (masked):', url.replace(this.apiKey, 'XXXXX'));

    const response = await fetch(url);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Steam API Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      });
      throw new Error(`Steam API returned ${response.status}: ${text}`);
    }

    const data = await response.json() as SteamAPIResponse;
    
    if (!data.response?.players?.[0]) {
      throw new Error('No player data in Steam response');
    }

    return data.response.players[0];
  }

  async authenticate(query: URLSearchParams) {
    try {
      console.log('Starting Steam authentication with query params:', 
        Object.fromEntries(query.entries())
      );

      const isValid = await this.isValid(query);
      console.log('Steam response validation:', isValid);

      if (!isValid) {
        throw new Error('Invalid Steam authentication response');
      }

      const claimedId = query.get('openid.claimed_id');
      console.log('Claimed ID:', claimedId);

      if (!claimedId) {
        throw new Error('No claimed_id in Steam response');
      }

      const steamId = claimedId.split('/').pop();
      console.log('Extracted Steam ID:', steamId);

      if (!steamId) {
        throw new Error('Could not extract Steam ID from claimed_id');
      }

      const userInfo = await this.getPublicInfo(steamId);
      return userInfo;
    } catch (error) {
      console.error('Steam authentication error:', error);
      throw error;
    }
  }

  async testApiKey() {
    const testUrl = `${this.STEAM_WEB_API}/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=76561197960435530`;
    
    try {
      const response = await fetch(testUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'OwlDiver/1.0'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Test API call failed:', {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body: text
        });
        return false;
      }

      const data = await response.json();
      return !!data.response?.players;
    } catch (error) {
      console.error('Test API call error:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const steamAuth = new SteamLogin();
