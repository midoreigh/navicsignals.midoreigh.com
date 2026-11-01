// The latest Android release, read from GitHub Releases so users always get the latest build.
// Falls back to direct GitHub release links if GitHub API cannot be reached.

export const REPO = 'https://github.com/midoreigh/navicsignals.midoreigh.com';

export interface Release {
  version: string;
  tag: string;
  date: string;
  download: string;
  page: string;
  size: number;
}

export const FALLBACK_RELEASE: Release = {
  version: '0.9',
  tag: 'android-v0.9',
  date: '2026-11-01',
  download: `${REPO}/releases/download/android-v0.9/NavICSkyView-v0.9.apk`,
  page: `${REPO}/releases`,
  size: 672000,
};

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  html_url: string;
  published_at: string;
  assets: GitHubAsset[];
}

export async function fetchLatestRelease(): Promise<Release> {
  try {
    const response = await fetch('https://api.github.com/repos/midoreigh/navicsignals.midoreigh.com/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const r: GitHubRelease = await response.json();
    const asset = r.assets?.find(a => a.name.endsWith('.apk'));
    if (!asset) return FALLBACK_RELEASE;
    return {
      version: r.tag_name.replace(/^(android-)?v/, ''),
      tag: r.tag_name,
      date: r.published_at ? r.published_at.slice(0, 10) : '2026-11-01',
      download: asset.browser_download_url,
      page: r.html_url,
      size: asset.size,
    };
  } catch {
    return FALLBACK_RELEASE;
  }
}

export const megabytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;
