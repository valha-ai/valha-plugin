# Valha

Turn useful AI work into readable Valha pages, reuse trusted knowledge, and find
Blueprints when requested. The plugin connects to the hosted Valha MCP server at
`https://valha.link/mcp`.

## Codex

```bash
codex plugin marketplace add Alex-Levacher/valha-plugin
codex plugin add valha@valha
```

Sign in to Valha when Codex asks, then start a new task.

## Claude Code

```bash
claude plugin marketplace add Alex-Levacher/valha-plugin
claude plugin install valha@valha
```

In a new session, run `/mcp`, select `valha`, and choose **Authenticate**. In the
Claude desktop app, if the sign-in page does not open, add `https://valha.link/mcp`
as a custom connector under **Settings → Connectors** instead.

## Update

```bash
codex plugin marketplace upgrade valha
claude plugin marketplace update valha && claude plugin update valha@valha
```

Start a new task or session afterwards. Other assistants, including ChatGPT, are
covered at [valha.link/connect](https://valha.link/connect).

## Terms

[Privacy Policy](https://valha.link/privacy) · [Terms](https://valha.link/terms) ·
[License](https://github.com/Alex-Levacher/valha-plugin/blob/main/LICENSE) ·
[Security](https://github.com/Alex-Levacher/valha-plugin/blob/main/SECURITY.md) ·
[Changelog](https://github.com/Alex-Levacher/valha-plugin/blob/main/CHANGELOG.md)
