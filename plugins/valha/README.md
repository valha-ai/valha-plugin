# Valha plugin beta

Valha helps assistants turn useful work into pages people will read, reuse trusted
permissioned knowledge, and find reusable Blueprint methods when requested.
This public repository distributes the official beta plugin for Codex and Claude Code. The hosted
OAuth MCP server remains operated at `https://valha.link/mcp`; this repository contains no Valha
server code, credentials, or customer data.

## Codex

```bash
codex plugin marketplace add Alex-Levacher/valha-plugin
codex plugin add valha@valha
```

Authenticate the `valha` MCP server when prompted, then start a new task so Codex loads the plugin
skills. ChatGPT uses `import_illustration_file` for files; Codex and Claude Code use
`create_illustration_upload` followed by `finalize_illustration_upload`.

## Claude Code

```bash
claude plugin marketplace add Alex-Levacher/valha-plugin
claude plugin install valha@valha
```

Claude Code does not ask you to sign in at installation. In a new session, open the MCP server list
with `/mcp`, select `valha`, and choose **Authenticate** to complete the Valha sign-in in your browser.
The skills load in any session started after installation. In the Claude desktop app, if the
sign-in page does not open, add `https://valha.link/mcp` as a custom connector under
**Settings → Connectors** instead; its sign-in runs in the browser and the connector is also
available to Code sessions.

## ChatGPT developer beta

ChatGPT does not install this repository during the beta. Enable Developer mode under **Settings →
Security and login**, add a custom plugin, and use `https://valha.link/mcp` as the connection URL.
Developer mode availability depends on the account and workspace policy. After Valha tool metadata
changes, open [ChatGPT Plugins](https://chatgpt.com/plugins), select the installed plugin,
open **Plugin actions → Manage**, and select **Refresh** in **Information** at the bottom
of the connection settings. Check the displayed input schemas before starting a new
conversation. Reconnecting OAuth or reinstalling is not a substitute for this metadata refresh.

Each developer-mode connection needs its own refresh when action schemas change; refreshing
the maintainer's connection does not refresh beta testers' connections. Published MCP plugins
pick up new and changed tool definitions through continuous automated review, while changes to
submitted listing information or imported skills require a new version, review, and publication.
Compatible server-only fixes take effect through the live endpoint. See
[OpenAI's metadata version rules](https://developers.openai.com/plugins/deploy/app-review#how-published-mcp-metadata-versions-work).

The permanent installation guide is available at [valha.link/connect](https://valha.link/connect).

## Claude and Gemini apps

Claude web/desktop can connect to the hosted OAuth MCP through a custom connector. The MCP
instructions, tool descriptions and response guidance carry the Blueprint workflow without
requiring installation of this repository. Follow the
[Claude custom connector instructions](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

Gemini web/mobile documents custom MCP apps, including use from chat and Gemini Spark. Google's
[custom app requirements](https://support.google.com/gemini/answer/17209137), checked on
2026-09-21, restrict access to personal accounts for adults in the US, with English-only
availability. Recheck those requirements before testing; Gemini CLI is not proof of Gemini Apps
compatibility. Configure the hosted MCP URL only on an eligible account. No successful Valha
Gemini Apps qualification is claimed by this package.

## Blueprint discovery

Blueprint discovery is opt-in. Ask for a Blueprint or reusable Valha method when one would
help; a generic course, travel project, CRM, page save or edit does not trigger a search.
Using a Blueprint does not require creating a page. An explicitly blank page stays blank.

Search results are candidates, not approved recommendations. Inspect relevance and prerequisites,
clarify uncertain fit, and apply only after explicit selection. A named request to use a specific
method already counts as selection. The assistant may use the selected method as reference and
adapt relevant steps without changing the shared Blueprint. No relevant method means continuing
with a custom approach; an unavailable search is not evidence of no match. Page creation and public
sharing require their own intent.

Tool availability, instruction delivery, retrieval quality and real assistant behavior are separate
checks. A connector cannot guarantee that a host spontaneously calls Valha. Refresh tool metadata
and start a new conversation after changes; an explicit Valha invocation is the fallback when a
host does not discover it automatically, not a passing spontaneous-discovery test.

## Updates

Beta releases use `0.x` versions. Upgrade the marketplace before starting a new task or session:

```bash
codex plugin marketplace upgrade valha
```

In Claude Code, third-party marketplaces do not update automatically. Refresh the marketplace,
then update the plugin:

```bash
claude plugin marketplace update valha
claude plugin update valha@valha
```

See the
[CHANGELOG](https://github.com/Alex-Levacher/valha-plugin/blob/main/CHANGELOG.md) for contract
changes.

## Security and terms

Report vulnerabilities privately as described in
[SECURITY.md](https://github.com/Alex-Levacher/valha-plugin/blob/main/SECURITY.md). Valha's
[Privacy Policy](https://valha.link/privacy) and [Terms](https://valha.link/terms) apply to the hosted
service. This distribution package is not open source; see the
[LICENSE](https://github.com/Alex-Levacher/valha-plugin/blob/main/LICENSE).
