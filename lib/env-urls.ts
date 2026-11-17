import { siteConfig } from './config';

/** Replace explicit placeholders; preserve literal URLs in installation examples. */
export function replaceEnvUrls(content: string): string {
  if (!content) return content;

  const portalUrl = siteConfig.developerPortalUrl;
  const cloudUrl = siteConfig.apiUrl;
  const apiUrl = siteConfig.apiUrl;
  const gatewayUrl = siteConfig.gatewayUrl;
  const docsUrl = siteConfig.url;

  return content
    // Replace explicit placeholders
    .replace(/\{\{\s*CLOUD_URL\s*\}\}/g, cloudUrl)
    .replace(/\{\{\s*DEVELOPER_PORTAL_URL\s*\}\}/g, portalUrl)
    .replace(/\{\{\s*PORTAL_URL\s*\}\}/g, portalUrl)
    .replace(/\{\{\s*API_BASE_URL\s*\}\}/g, apiUrl)
    .replace(/\{\{\s*API_URL\s*\}\}/g, apiUrl)
    .replace(/\{\{\s*GATEWAY_URL\s*\}\}/g, gatewayUrl)
    .replace(/\{\{\s*DOCS_URL\s*\}\}/g, docsUrl)
    .replace(/\{\{\s*SITE_URL\s*\}\}/g, docsUrl);
}
