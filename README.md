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

To try an edit in Claude Code without installing it, load the package directly with
`claude --plugin-dir ./plugins/valha`.

## Install

These beta commands install the production package from the GitHub marketplace. A future
universal Plugins Directory listing will be a separate installation and will not update this
marketplace copy automatically.

```bash
codex plugin marketplace add Alex-Levacher/valha-plugin
codex plugin add valha@valha
```

```bash
claude plugin marketplace add Alex-Levacher/valha-plugin
claude plugin install valha@valha
```

Codex asks you to authenticate the Valha MCP server at installation; start a new task so the
skills load. Claude Code does not prompt: in a new session, run `/mcp`, select `valha`, and choose
**Authenticate**. In the Claude desktop app, if the sign-in page does not open, add
`https://valha.link/mcp` as a custom connector under **Settings → Connectors** instead.
ChatGPT uses `import_illustration_file` for attached files; Codex and Claude Code use
`create_illustration_upload` followed by `finalize_illustration_upload`.

ChatGPT beta connects directly to `https://valha.link/mcp` in Developer mode. Availability depends
on the account and workspace policy. See [valha.link/connect](https://valha.link/connect).

## Security and terms

Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md). Valha's
[Privacy Policy](https://valha.link/privacy) and [Terms](https://valha.link/terms) apply to the hosted
service. This distribution package is not open source; see [LICENSE](./LICENSE).
