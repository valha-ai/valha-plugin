# Valha plugin

This repository is the source of truth for the public Valha plugin. Edit the manifests, three skills, and package documentation here. The hosted MCP server is maintained separately. This repository ships only the production package: keep development builds, localhost endpoints, and test-only variants out of it. The skills here are the single source; any development build is assembled from them elsewhere, so edit and commit skill changes only in this repository. Do not add project-level skill links (`.claude/skills`): they would load a second copy of each skill next to the installed plugin. Test the package with `claude --plugin-dir ./plugins/valha` instead. Keep the Codex manifest and marketplace aligned with the OpenAI plugin spec. The repository is public; never include private repository paths, credentials, or customer data.

Before a release, run `bun test tests`. Compare skill guidance with the deployed MCP tool contract. A local commit or GitHub push does not update a ChatGPT personal plugin or an OpenAI Platform submission. Do not push, submit, or publish without Alex's explicit request.

## Two host distributions, one shared implementation

Valha has two public plugin distributions: Claude and OpenAI (ChatGPT and Codex).
They share the skills and production MCP server, but their manifests, directory
submissions, approvals, and publication states are separate. A fix for one host
must preserve the other host's behavior. Keep versions aligned when releasing
the same shared implementation; isolate host-specific metadata in its manifest.

Before changing or releasing either distribution, run the shared package tests,
the Claude validator, and the Codex skill checks. Qualify changed workflows in
both hosts and record each result separately; static package validation does not
prove authentication or runtime behavior. Extend the existing tests for a shared
contract regression, and report unavailable host checks as unverified.
