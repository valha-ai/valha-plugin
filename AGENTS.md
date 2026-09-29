# Valha plugin

This repository is the source of truth for the public Valha plugin. Edit the manifests, three skills, and package documentation here. The hosted MCP server is maintained separately. `local-marketplace/` is a static Codex development variant with the same skill guidance, a distinct blue icon, and a localhost MCP connection. Keep its skills in sync when changing the production package. Both packages are public; never include private repository paths, credentials, or customer data.

Before a release, run `bun test tests`. Compare skill guidance with the deployed MCP tool contract. A local commit or GitHub push does not update a ChatGPT personal plugin or an OpenAI Platform submission. Do not push, submit, or publish without Alex's explicit request.
