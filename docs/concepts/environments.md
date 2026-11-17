# Projects and environments

Naagmani scopes application resources by organization, project and environment. Projects normally provide Test and Production contexts for separate credentials, policy and configuration.

## Credential scope

Application API keys use `nm_live_...`; Project Service Tokens use `nm_st_...`. Neither format encodes Test/Production in its prefix. The stored credential context determines the allowed environment. Headers do not grant access to another project or environment.

Select the intended environment before creating credentials, assigning extensions or editing environment-specific configuration. Check project/member attribution and runtime permissions when testing access boundaries.

A production environment does not automatically create dedicated hardware, AWS KMS, a separate database or an availability guarantee. Configure encryption/key management and hosting for your deployment.

See [API keys](/developer-portal/projects/api-keys), [service tokens](/developer-portal/projects/service-tokens) and [project access](/developer-portal/projects/access).
