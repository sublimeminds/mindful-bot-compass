const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'sublimeminds'; // Updated to your GitHub username
const REPO_NAME = 'mindful-bot-compass'; // Updated to your repository name

export interface GitHubAsset {
  name: string;
  download_count: number;
  browser_download_url: string;
  size: number;
  content_type: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: GitHubAsset[];
  prerelease: boolean;
  draft: boolean;
}

export const githubService = {
  async getLatestRelease(): Promise<GitHubRelease | null> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest release:', error);
      return null;
    }
  },

  async getAllReleases(): Promise<GitHubRelease[]> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/releases`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching releases:', error);
      return [];
    }
  },

  getAssetsByPlatform(assets: GitHubAsset[]) {
    return {
      windows: assets.filter(asset => 
        asset.name.endsWith('.exe') || 
        asset.name.endsWith('.msi')
      ),
      macos: assets.filter(asset => 
        asset.name.endsWith('.dmg') || 
        asset.name.endsWith('.zip')
      ),
      linux: assets.filter(asset => 
        asset.name.endsWith('.AppImage') || 
        asset.name.endsWith('.deb') || 
        asset.name.endsWith('.rpm')
      )
    };
  },

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  detectUserPlatform(): 'windows' | 'macos' | 'linux' {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (platform.includes('win') || userAgent.includes('windows')) {
      return 'windows';
    } else if (platform.includes('mac') || userAgent.includes('mac')) {
      return 'macos';
    } else {
      return 'linux';
    }
  }
};
