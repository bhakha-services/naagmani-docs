# Publishing to the Marketplace

Share your custom plugins and integrations with your organization or the broader global AI developer community.

---

## Publishing Workflow

1. **Develop and Test**: Ensure your plugin passes unit tests and manifest validation.
2. **Package**: Build the multi-platform binary archive.
3. **Publish**: Push to the registry with the desired visibility flag.

```bash
naagmani plugins publish ./dist/my-guard-1.0.0.tar.gz \
  --scope organization \
  --visibility private
```

---

## Review & Certification

Public plugins submitted to the Global Marketplace undergo automated security scanning and sandboxed vulnerability checks prior to public listing.

---

## Next Steps

- [Plugin Visibility & Scopes](/docs/marketplace/plugin-visibility)
- [Troubleshooting Common Errors](/docs/troubleshooting/common-errors)
