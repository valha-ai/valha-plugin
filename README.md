# Valha plugin

The official Valha plugin for Codex and Claude Code: three skills and a connection
to the hosted Valha MCP server at `https://valha.ai/mcp`. This repository holds no
server code, credentials, or customer data.

Installation, sign-in, and updates: [plugins/valha/README.md](./plugins/valha/README.md).

## Develop

Edit the manifests and skills in `plugins/valha/`, then run `bun test tests` and
`claude plugin validate plugins/valha`. Try a change in Claude Code without
installing it with `claude --plugin-dir ./plugins/valha`. Check changed skill
guidance against the deployed MCP tools before a release. A GitHub release does not
update ChatGPT imports or the OpenAI Platform submission.

For an OpenAI directory submission, keep listing fields in the Codex manifest's
`interface` and review/publication fields in `extensions.com.openai`. Include all
three skills and the shared MCP configuration in a complete ZIP of `plugins/valha/`,
including hidden files. Store reviewer credentials only in the private Platform
form, never in the ZIP or this repository. ZIP upload, automated checks, review,
approval, and publication are separate steps; preserve Claude compatibility when
changing the shared package.

## Security and terms

Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).
Valha's [Privacy Policy](https://valha.ai/privacy) and [Terms](https://valha.ai/terms)
apply to the hosted service. This package is not open source; see [LICENSE](./LICENSE).
