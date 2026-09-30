---
name: use-valha-knowledge
description: Finds and verifies permissioned knowledge from Valha pages. Use when the user asks to search Valha, recover team work, compare existing pages, continue a published artifact, or answer a specific personal or company fact missing from the current context, for example "cherche dans Valha", "qu'est-ce qu'on a dans Valha sur…", or "reprends la page Valha…". Skip general knowledge, facts already in the conversation, and local repository questions.
---

# Use Valha Knowledge

Use Valha as a permissioned evidence source. Search results are candidates, not facts; fetch the current page evidence and provenance before relying on it.

## Workflow

1. Call `get_context` to confirm the connected account and active workspace. If Valha tools are unavailable or return an authentication error, stop: tell the user that Valha must be connected or re-authenticated in this host's connector or MCP settings, then retry. Never answer as if Valha had been searched.
2. Use `get_context.workspaces` to resolve a named or ambiguous scope. Ask which workspace when it remains unclear; use `list_workspaces` only when a fresh list is needed later. Never infer access from a workspace name alone.
3. Use `search` for a semantic question or `list_pages` to browse the active workspace. Keep the first query specific and expand only when results are weak.
4. Treat every search hit as a lead. Call `fetch` for the candidates that may support the answer.
5. Synthesize only from fetched, current content. Preserve distinctions between an approved decision, evidence, a proposal, an inference, and an unknown whenever the page makes them available.
6. Cite or link the Valha pages used, and name material uncertainty or missing evidence.

## Continue existing work

- Use `get_page` when the user needs the full canonical page. When the user intends to continue a specific artifact and write the result back to it, load it with `get_continuation_page` instead.
- Do not mutate the page during a retrieval task. If the user asks to publish the continuation or edit the source, follow the `save-valha-work` workflow, which saves continuations with `save_continuation_page`.
- Prefer the page's current content and provenance over recollection from an earlier conversation.

## Workspace and access rules

- An active workspace is a convenience preference, not proof of access. Rely on the live results returned by Valha.
- If a requested page is absent, say that it was not found in the accessible scope. Do not imply that it does not exist elsewhere.
- Never expose credentials, connector metadata beyond what `get_context` returns, or private content from outside the fetched pages.
- Call `set_active_workspace` only when the user asks to change the default or clearly selects a workspace for ongoing work.
- Call `revoke_valha_access` only after an explicit request to disconnect Valha.
