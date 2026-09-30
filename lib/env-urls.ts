import { siteConfig } from './config';

/**
 * Dynamically replaces environment placeholders and any legacy local URLs
 * with the corresponding environment variables configured in siteConfig.
 */
export function replaceEnvUrls(content: string): string {
  if (!content) return content;

  const portalUrl = siteConfig.developerPortalUrl;
  const apiUrl = siteConfig.apiUrl;
  const gatewayUrl = siteConfig.gatewayUrl;
  const docsUrl = siteConfig.url;

  return content
    // Replace explicit placeholders
    .replace(/\{\{\s*DEVELOPER_PORTAL_URL\s*\}\}/g, portalUrl)
    .replace(/\{\{\s*PORTAL_URL\s*\}\}/g, portalUrl)
    .replace(/\{\{\s*API_BASE_URL\s*\}\}/g, apiUrl)
    .replace(/\{\{\s*API_URL\s*\}\}/g, apiUrl)
    .replace(/\{\{\s*GATEWAY_URL\s*\}\}/g, gatewayUrl)
    .replace(/\{\{\s*DOCS_URL\s*\}\}/g, docsUrl)
    .replace(/\{\{\s*SITE_URL\s*\}\}/g, docsUrl)
    // Dynamically map legacy localhost & old domains to active environment URLs
    .replace(/http:\/\/localhost:3000/g, portalUrl)
    .replace(/https:\/\/developer\.naagmani\.app/g, portalUrl)
    .replace(/http:\/\/localhost:8081/g, apiUrl)
    .replace(/https:\/\/api\.naagmani\.app/g, apiUrl)
    .replace(/http:\/\/localhost:8080/g, gatewayUrl)
    .replace(/https:\/\/gateway\.naagmani\.app/g, gatewayUrl)
    .replace(/http:\/\/localhost:3001/g, docsUrl)
    .replace(/http:\/\/localhost:3002/g, docsUrl);
}
