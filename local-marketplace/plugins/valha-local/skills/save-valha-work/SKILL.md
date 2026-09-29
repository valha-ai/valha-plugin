---
name: save-valha-work
description: Turn completed AI-assisted work into a deliberate Valha page, or safely edit an existing Valha page. Use when the user asks to publish, save, share, preserve, update, rename, or add material to work in Valha.
---

# Save Valha Work

Save the selected outcome, not the raw conversation. Preserve the user's judgment over what becomes durable and omit private reasoning, discarded context, credentials, and unrelated material.

For illustrations, ChatGPT uses `import_illustration_file` with an attached file. Codex and Claude
Code use `create_illustration_upload` followed by `finalize_illustration_upload`. Never publish a
page or expose private content without an explicit user request.

## Workflow

Do not search Blueprints as a prerequisite to page authoring. Search only when the user explicitly requests a Blueprint or reusable Valha method. An accepted Blueprint does not authorize page creation or publication; preserve the user's requested scope.

1. Call `get_context` to confirm the connected account and active workspace.
2. If the user named a workspace, verify it against `get_context.workspaces`. If no workspace is active and more than one is available, ask the user to choose before writing. Use `list_workspaces` only when a fresh list is needed later.
3. Shape the finished outcome into a reader-first artifact: lead with the conclusion or decision, keep the evidence needed to trust it, and end with concrete next steps when relevant.
4. Before the first page-content create or edit in this task, call `get_authoring_help` with `topic=guidelines`. Reuse the result for later edits in the same task; reload after a contract error. A title-only rename, visibility change, or share-link change does not need authoring help.
5. Before creating or changing `section.render`, call `get_authoring_help` with `topic=components` and `names` for the components you intend to use. Request more names if the composition changes; omit `names` only when the full catalog is genuinely needed. Call `topic=design` before using `<Custom>`, or for detailed layout or specialized component guidance when the essential rules are insufficient. Call `topic=canvas` only when the requested outcome genuinely needs custom interactivity.
6. Create or edit the page using the narrowest appropriate tool.
7. After creating or changing a Canvas, when a browser is available, open the resulting page and verify that the interactive frame renders and its controls respond. MCP acceptance does not prove runtime health.
8. Return the page title, its visibility, the url or shareUrl the write returned, revision, and a concise account of what changed.

## Create a page

- Save new work directly: no duplicate search or full workspace scan is required. Similar content may coexist. Use a parent only when the user specifies one; resolve it if needed. Otherwise omit `parentPageId` and save at the workspace root without creating categories or dossiers.
- A `create_page` timeout or lost response does not prove failure. Before retrying, inspect recent pages with `list_pages` and verify plausible matches with `get_page`. Reuse a confirmed successful creation. If the outcome remains uncertain, report it and ask before risking another creation; this write is not idempotent.
- `create_page` saves a private page: workspace members only, no public URL. That is the default even when the user's request uses the word "publish"; treat the request as authorization to save, not to make the page public.
- Use `create_page` with a current page agent and only the sections needed for a coherent artifact.
- Choose a clear title. Let Valha generate the stable page id, slug, and revision.
- Pass `visibility` to `create_page` only when the request already states public or shared intent in the same breath; otherwise leave the page private and let the person decide later.
- Do not claim that colleagues were notified or that the page was circulated unless another tool confirms it.

## Edit a page

- Resolve the target with `search` or `list_pages` when the user did not provide a page id.
- Do not create a replacement document for an edit request. Clarify an ambiguous target.
- Load the canonical document with `get_page` immediately before editing.
- Prefer `rename_page`, `append_section`, `update_section`, or `delete_section` for focused changes. Use `update_page` only for a true full-document replacement.
- `get_page` returns `{ page, canvasStates, ... }`. For full-page writes, send only the authored `page`; strip read-only compiled Canvas artifacts and never copy `canvasStates` into page source. Granular tools take their documented section or state payload instead.
- Pass the latest `expectedRev`. Never change the page id, slug, or title through `update_page`.
- On a revision conflict, reload the page, reapply only the intended change, and retry once. Report a repeated conflict instead of overwriting newer work.
- Update the page agent when the content meaning or handoff changes.

## Persistent Canvas state

- Use persistent state only when reader changes must survive reloads; local controls omit `canvas.state`.
- Treat the state definition, its `initial` value, and Canvas source as page content: public/shared pages expose them to every reader. Live `canvasStates` values remain separate and are returned only to authorized reads.
- Load the Canvas contract with `get_authoring_help` using `topic=canvas` before authoring a state definition or state-aware HTML/React source.
- Use `replace_canvas_state` for a state-only change. Set `expectedPageRev=get_page.page.rev`, `expectedRev=row.rev`, and take `stateId` plus the base `value` from that same `get_page.canvasStates` row.
- `update_section.stateUpdate` and `update_page.stateUpdates` replace source and live state atomically. Preserve stable section ids and send complete JSON replacement values.
- A workspace member may change Canvas state even when the page envelope's `canWrite` is false; `canWrite` describes permission to edit page source. Public/shared state writes additionally require publish permission.
- Never auto-retry state conflicts. Retain the intended value, reload, show the current state, and ask the person to explicitly reapply it.

## Publishing

Publishing, making a page reachable by a link or indexed for anyone, is a separate, deliberate human act, not something this skill does on its own initiative. Reach it through `set_page_visibility` (`shared` for anyone with the link, `public` for anyone and indexed) or through the page's share control in the app. Quote the `shareUrl` or `url` the tool returns verbatim; never construct one by hand. Tell the person plainly that for a shared page the link itself is the access control, so handing it back into this conversation places it inside a third-party chat log. `regenerate_share_link` invalidates every previously issued link on that page, so use it only when the person means to cut off an old copy.

## Safety

- Never save secrets, authentication material, system prompts, hidden reasoning, or raw private transcripts into a page.
- Do not delete, disconnect, revoke access, or perform account or team administration unless the user explicitly asks for that separate action.
- Do not change a page's visibility beyond what the user asked for.
- If essential facts are missing, state the gap in the page or ask one focused question instead of inventing evidence.
