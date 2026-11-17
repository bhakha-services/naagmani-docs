# Publisher portal

Open **Organization → Publisher** to submit an artifact using the workflow available in your deployment. The current bundle-upload workflow accepts prebuilt plugin archives in .tar.gz or .tgz format.

Before uploading, validate the manifest, build for the target runtime and test the plugin. Supply the metadata and artifact details required by the form. Publishing requires an authorized identity and a reachable control plane.

Upload, catalog visibility, review, approval and execution authorization are separate operations. Follow the status returned by your deployment; uploading a bundle does not prove it has passed a security audit or is available in every public catalog.

Review publisher/version identity, checksums and requested permissions before installing third-party artifacts. Apply your organization's code-review and supply-chain controls.

See [package and publish](/build/hdks/publishing), [CLI workflows](/build/cli/plugins) and [marketplace installation](/marketplace/installation).
