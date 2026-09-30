# Valha plugin

The official Valha plugin for Codex and Claude Code: three skills and a connection
to the hosted Valha MCP server at `https://valha.link/mcp`. This repository holds no
server code, credentials, or customer data.

Installation, sign-in, and updates: [plugins/valha/README.md](./plugins/valha/README.md).

## Develop

Edit the manifests and skills in `plugins/valha/`, then run `bun test tests` and
`claude plugin validate plugins/valha`. Try a change in Claude Code without
installing it with `claude --plugin-dir ./plugins/valha`. Check changed skill
guidance against the deployed MCP tools before a release. A GitHub release does not
update ChatGPT imports or the OpenAI Platform submission.

## Security and terms

Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).
Valha's [Privacy Policy](https://valha.link/privacy) and [Terms](https://valha.link/terms)
apply to the hosted service. This package is not open source; see [LICENSE](./LICENSE).
