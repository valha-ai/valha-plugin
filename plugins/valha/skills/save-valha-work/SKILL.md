---
name: save-valha-work
description: Save, edit or organize private Valha pages when the user asks.
---

# Save Valha Work

Save the selected outcome, not the raw conversation. Preserve the user's judgment over what becomes durable and omit private reasoning, discarded context, credentials, and unrelated material.

## Workflow

Do not search Playbooks as a prerequisite to page authoring. Search only when the user explicitly requests a Playbook or reusable Valha method. An accepted Playbook does not authorize page creation or publication; preserve the user's requested scope.

1. Call `get_context` to confirm the connected account and active workspace. If Valha tools are unavailable or return an authentication error, stop: tell the user that Valha must be connected or re-authenticated in this host's connector or MCP settings, then retry. Never simulate a save, and never substitute local files for Valha.
2. If the user named a workspace, verify it against `get_context.workspaces`. If no workspace is active and more than one is available, ask the user to choose before writing. Call `get_context` again when a fresh list is needed later.
3. Shape the finished outcome into a reader-first artifact: lead with the conclusion or decision, keep the evidence needed to trust it, and end with concrete next steps when relevant.
4. Before the first page-content create or edit in this task, call `get_authoring_help` with `topic=guidelines`. Reuse the result for later edits in the same task; reload after a contract error. A title-only rename does not need authoring help.
5. Before creating or changing `section.render`, call `get_authoring_help` with `topic=components` and `names` for the components you intend to use. Request more names if the composition changes; omit `names` only when the full catalog is genuinely needed. Call `topic=design` before using `<Custom>`, or for detailed layout or specialized component guidance when the essential rules are insufficient. Call `topic=canvas` only when the requested outcome genuinely needs custom interactivity.
6. Create or edit a private page using the narrowest appropriate tool. Shared/public pages remain readable when authorized, but their edits belong in the Valha app.
7. After creating or changing a Canvas, when a browser is available, open the resulting page and verify that the interactive frame renders and its controls respond. MCP acceptance does not prove runtime health.
8. Return the page title, its visibility, the members-only `appUrl` the write returned (always after creating a page; it opens the page in Valha and publishes nothing), any `url` or `shareUrl`, revision, and a concise account of what changed.

## Create a page

- Save new work directly: no duplicate search or full workspace scan is required. Similar content may coexist. Omit `parentPageId` and save at the workspace root unless the user names a parent page (resolve it if needed) or asks for a folder, dossier, or section.
- Valha has no separate folder object: a folder is a parent page. For a folder request, create a short parent page titled for the topic, then create each child page with that page's id as `parentPageId`. Do not invent a hierarchy the user did not ask for.
- To move existing pages under a parent, present the exact moves, and only after explicit approval call `reorganize_page_hierarchy` with each page's latest `expectedRev`.
- To add an illustration, ChatGPT uses `import_illustration_file` with an attached file; Codex and Claude Code use `create_illustration_upload` followed by `finalize_illustration_upload`.
- A `create_page` timeout or lost response does not prove failure. Before retrying, inspect recent pages with `list_pages` and verify plausible matches with `get_page`. Reuse a confirmed successful creation. If the outcome remains uncertain, report it and ask before risking another creation; this write is not idempotent.
- `create_page` saves only private pages: workspace members only, no public URL. If the user explicitly requests public or shared visibility, explain that this step is available in the Valha app. Do not silently substitute a private save; create a private draft only if separately authorized.
- Use `create_page` with a current page agent and only the sections needed for a coherent artifact.
- Choose a clear title. Let Valha generate the stable page id, slug, and revision.
- Omit `visibility` or pass `private`. Sharing and publication are not MCP operations.
- Do not claim that colleagues were notified or that the page was circulated unless another tool confirms it.

## Edit a page

- Resolve the target with `search` or `list_pages` when the user did not provide a page id.
- Do not create a replacement document for an edit request. Clarify an ambiguous target.
- Load the canonical document with `get_page` immediately before editing. If its visibility is shared or public, return its members-only `appUrl` and direct the user to edit it in the Valha app. Do not change its visibility to make an MCP edit possible.
- Prefer `append_section`, `update_section`, or `delete_section` for focused changes. Use `update_page` for a full-document replacement or a rename: change only `title`, and keep the page agent accurate.
- `get_page` returns `{ page, canvasStates, ... }`. For full-page writes, send only the authored `page`; strip read-only compiled Canvas artifacts and never copy `canvasStates` into page source. Granular tools take their documented section or state payload instead.
- Pass the latest `expectedRev`. Never change the page id or slug.
- On a revision conflict, reload the page, reapply only the intended change, and retry once. Report a repeated conflict instead of overwriting newer work.
- Update the page agent when the content meaning or handoff changes.
- To write a continuation back into an existing artifact, load it with `get_page` (pass the continuation prompt's `edit` when it supplies one) and save only its authored `page` with `update_page` after the edit is confirmed, choosing `agentUpdate` (`replace` for changed meaning or handoff, `confirm-current` for visual-only changes, `preserve` when unsure). On conflict, reload with `get_page`, merge, and retry once.

## Persistent Canvas state

- Use persistent state only when reader changes must survive reloads; local controls omit `canvas.state`.
- Treat the state definition, its `initial` value, and Canvas source as page content: public/shared pages expose them to every reader. Live `canvasStates` values remain separate and are returned only to authorized reads.
- Load the Canvas contract with `get_authoring_help` using `topic=canvas` before authoring a state definition or state-aware HTML/React source.
- Use `replace_canvas_state` for a state-only change. Set `expectedPageRev=get_page.page.rev`, `expectedRev=row.rev`, and take `stateId` plus the base `value` from that same `get_page.canvasStates` row.
- `update_section.stateUpdate` and `update_page.stateUpdates` replace source and live state atomically. Preserve stable section ids and send complete JSON replacement values.
- On a private page, a workspace member may change Canvas state even when the page envelope's `canWrite` is false; `canWrite` describes permission to edit page source. MCP state writes to shared/public pages are refused.
- Never auto-retry state conflicts. Retain the intended value, reload, show the current state, and ask the person to explicitly reapply it.

## Sharing and publication

Share, publish, rotate a link or change visibility in the Valha app. For an existing page, return its members-only `appUrl` and point to its Share control. Do not construct public or shared URLs, request publication permissions, or invoke an unlisted sharing tool. Editing a shared/public page also belongs in the app; never make it private as a workaround.

## Safety

- Never save secrets, authentication material, system prompts, hidden reasoning, or raw private transcripts into a page.
- Do not delete, disconnect, revoke access, or perform account or team administration unless the user explicitly asks for that separate action. Valha can invite a team member with `invite_team_member`; for every other account or team change, give the person the link from `get_settings_link`.
- Never change visibility through MCP, including when the user explicitly requests sharing or publication.
- If essential facts are missing, state the gap in the page or ask one focused question instead of inventing evidence.
