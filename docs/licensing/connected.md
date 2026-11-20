# Connected registration and license renewal

Self-hosted installations default to **no vendor connection**. Local sign-in, signed-license verification, and license-expiry reminders work without contacting Naagmani servers. An organization administrator can enable specific connection purposes under **Settings → Naagmani server connection**. The preference is stored by the local Cloud API for the installation and applies to every portal user.

## Consent settings

- **Allow connection to Naagmani services** is the master switch. Turning it off turns off all subordinate purposes and prevents calls to the public service.
- **Release announcements** separately allows the portal to check for the public release, maintenance, and announcement feed. It is off by default.
- Automatic subscription renewal is not available yet. The stored renewal preference is always false; no background license-renewal request is sent. Renewals still require downloading the refreshed encrypted `.lic` from Accounts and importing it locally.

These settings are installation-wide, not per browser or per user. Only a user with `organizations.manage` can change them. If the preference API is missing, unreachable, unauthorized, or returns invalid data, the portal fails closed and does not contact the public feed.

## Exact requests and data

### Local preference read

On opening the settings page, the portal reads the saved preference from the **same self-hosted installation**:

```http
GET http://<configured-local-cloud-api>/v1/installations/<local-installation-id>/connectivity-preferences
Authorization: Bearer <local-session-token>
```

This request does not leave the self-hosted network. The local API returns only three booleans:

```json
{
  "cloud_connection_enabled": false,
  "release_notifications_enabled": false,
  "automatic_license_renewal_enabled": false
}
```

### Local preference update

When an administrator saves a setting, the portal sends this request to the local API:

```http
PUT http://<configured-local-cloud-api>/v1/installations/<local-installation-id>/connectivity-preferences
Authorization: Bearer <local-session-token>
Content-Type: application/json
```

The JSON body has exactly the same three boolean fields shown above. Unknown fields are rejected. Disabling the master connection forces both purpose flags off.

### Public announcement fetch

Only when both the master switch and **Release announcements** are enabled, the portal checks local consent and then sends this request to the configured upstream cloud host (default `https://api.naagmani.com`):

```http
GET https://api.naagmani.com/v1/announcements?org_id=<local-organization-id>
Accept: application/json
```

The feed request sends the organization ID as a query parameter. The public service can also observe ordinary transport metadata: the self-hosted server's public source IP, request time, and HTTP headers such as User-Agent. The local session token, local installation ID, administrator email, license file or license contents, database, prompts, provider credentials, and user records are **not** sent to this endpoint. The request is made by the self-hosted portal server, not each user's browser. The local preference check and any feed error fail closed.

The notification center checks at most every five minutes while enabled. The release dialog uses the same feed result and checks on initial page load or when the browser tab regains focus; it does not run a separate 30-second polling loop. Mark-read actions are stored locally and are not forwarded to the public host.

When either switch is off, the central announcement feed is not contacted. Disabling consent takes effect on the next check; it clears notices from the current UI. A check already in flight may complete before the change is observed.

## License renewal

Automatic license renewal and background heartbeat are not implemented in this build. Subscription auto-payment in Accounts does not by itself update an air-gapped installation's signed artifact. For now, obtain the renewed encrypted `.lic` from Accounts and import it locally, then check the installation ID and expiry in Settings.

See [license import](/licensing/overview), [offline licensing](/licensing/air-gapped) and [network boundaries](/deployment/self-hosted-boundaries).
