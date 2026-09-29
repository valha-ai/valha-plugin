# Valha plugin beta

Valha turns useful AI work into pages people will actually read, lets assistants reuse trusted,
permissioned knowledge, and finds reusable Blueprint methods when requested.
This public repository distributes the official beta plugin for Codex and Claude Code. The hosted
OAuth MCP server remains operated at `https://valha.link/mcp`; this repository contains no Valha
server code, credentials, or customer data.

## Develop

This repository is the source of truth for the production plugin. Edit its manifests and skills
here, then run `bun test tests`. Check that changed skill
guidance matches the deployed MCP tools before release. GitHub updates, Codex installations,
ChatGPT personal imports, and OpenAI Platform submissions are separate steps.

For local Codex testing, use the tracked `local-marketplace/` directory. It contains
`valha-local@valha-local` with the same three skills, a blue icon, and a connection to
`https://localhost:4949/mcp`. Register it once with
`codex plugin marketplace add ./local-marketplace`, then install with
`codex plugin add valha-local@valha-local`. Edit the two plugin packages directly; the tests
check that their skill guidance stays equal while the MCP URLs differ. After editing the local
package, remove and add `valha-local@valha-local` again, then start a new task. Select the
intended plugin explicitly when both Valha and Valha Local are available.

## Install

These beta commands install the production package from the GitHub marketplace. A future
universal Plugins Directory listing will be a separate installation and will not update this
marketplace copy automatically. The development package is not listed in this root marketplace.

```bash
codex plugin marketplace add Alex-Levacher/valha-plugin
codex plugin add valha@valha
```

```bash
claude plugin marketplace add Alex-Levacher/valha-plugin
claude plugin install valha@valha
```

Authenticate the Valha MCP server when prompted, then start a new task or session so the skills load.
ChatGPT uses `import_illustration_file` for attached files; Codex and Claude Code use
`create_illustration_upload` followed by `finalize_illustration_upload`.

ChatGPT beta connects directly to `https://valha.link/mcp` in Developer mode. Availability depends
on the account and workspace policy. See [valha.link/connect](https://valha.link/connect).

## Security and terms

Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md). Valha's
[Privacy Policy](https://valha.link/privacy) and [Terms](https://valha.link/terms) apply to the hosted
service. This distribution package is not open source; see [LICENSE](./LICENSE).
