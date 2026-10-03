# Valha

Turn useful AI work into readable Valha pages, reuse trusted knowledge, and find
Blueprints when requested. The plugin connects to the hosted Valha MCP server at
`https://valha.ai/mcp`.

## What it does

- **Save work:** when you ask, turns the useful outcome of a conversation into a
  Valha page, or updates an existing one. Pages are private until you share them.
- **Use knowledge:** searches the pages your Valha account can read and cites the
  ones it used.
- **Use Blueprints:** when you ask for one, finds reusable methods written by people
  in your Valha workspace. A Blueprint is used only after you select it, as
  reference material for your request.

## Examples

- "Save this work as a Valha page people will actually read."
- "Find relevant Valha knowledge for this task."
- "Find a suitable Valha Blueprint for this task."

## Data it sends

The plugin talks only to `https://valha.ai/mcp`, signed in with your Valha
account through OAuth. It sends what a request needs: the page content you ask to
save, your search queries, and the Blueprint you select. It does not send whole
transcripts, and it runs no local code. Valha's
[Privacy Policy](https://valha.ai/privacy) covers how that data is stored and
deleted.

## Codex

```bash
codex plugin marketplace add valha-ai/valha-plugin
codex plugin add valha@valha
```

Sign in to Valha when Codex asks, then start a new task.

## Claude

In Claude on the web or desktop (paid plans), open **Customize → Plugins → Add →
Add marketplace**, add `valha-ai/valha-plugin` from a repository, then add
Valha. It follows your account into chat, Cowork, and Claude Code.

In the terminal:

```bash
claude plugin marketplace add valha-ai/valha-plugin
claude plugin install valha@valha
```

In a new session, run `/mcp`, select `valha`, and choose **Authenticate**.

## Update

```bash
codex plugin marketplace upgrade valha
claude plugin marketplace update valha && claude plugin update valha@valha
```

Start a new task or session afterwards. Other assistants, including ChatGPT, are
covered at [valha.ai/connect](https://valha.ai/connect).

## Troubleshooting

- **The assistant says Valha is not connected:** sign in again. In Claude Code, run
  `/mcp`, select `valha`, and choose **Authenticate**; in Codex, sign in when asked.
- **The sign-in page does not open in the Claude desktop app:** add
  `https://valha.ai/mcp` as a custom connector under **Customize → Connectors**.
- **Valha's skills or tools are missing:** start a new task or session after
  installing or updating, so the plugin loads.
- **Anything else:** see [valha.ai/support](https://valha.ai/support) or write to
  contact@valha.ai.

## Terms

[Privacy Policy](https://valha.ai/privacy) · [Terms](https://valha.ai/terms) ·
[License](https://github.com/valha-ai/valha-plugin/blob/main/LICENSE) ·
[Security](https://github.com/valha-ai/valha-plugin/blob/main/SECURITY.md) ·
[Changelog](https://github.com/valha-ai/valha-plugin/blob/main/CHANGELOG.md)
