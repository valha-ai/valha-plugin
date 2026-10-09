# Changelog

All notable public beta plugin contract changes are documented here.

## 0.5.1 (2026-10-09)

- After saving a page, the assistant hands back its members-only Valha link (`appUrl`), so a private page no longer ends a save without a link. The link opens the page in the right workspace and publishes nothing.

## 0.5.0 (2026-10-03)

- Moved to `https://valha.ai`: the MCP server is now `https://valha.ai/mcp`, and the website, support, privacy, and terms links follow. **Reconnection required:** sign-in is bound to the server address, so remove the old Valha connection and sign in again after updating.
- The repository moved to `valha-ai/valha-plugin`; the former `Alex-Levacher/valha-plugin` path redirects.
- Support email is now `contact@valha.ai`.

## 0.4.3 (2026-10-01)

- Described Blueprints as methods written by people in the user's own workspace, returned only after the user selects one; their behavior is unchanged.
- Added what the plugin does, example prompts, the data it sends, Claude app installation, and troubleshooting to the package README.

## 0.4.2 (2026-10-01)

- Added Claude directory listing metadata: display name, icon, and documentation, support, privacy policy, and terms URLs.

## 0.4.1 (2026-09-30)

- Unified the MCP dependency description in every skill's Codex metadata.
- Reduced both READMEs to installation, sign-in, updates, and terms; other assistants are covered on the Valha website.

## 0.4.0 (2026-09-30)

- Skills stop and ask the user to connect or re-authenticate Valha when its tools are unavailable, instead of continuing without them.
- A requested folder is now created as a parent page with child pages; existing pages move only through an approved `reorganize_page_hierarchy` batch.
- Continuations of an existing artifact use `get_continuation_page` and `save_continuation_page`.
- Skill descriptions include French trigger examples.
- Completed the Claude Code manifest metadata, kept the version only in `plugin.json`, and tested that the Claude and Codex manifests stay consistent.
- Declared the `LicenseRef-Valha` license in both manifests and the privacy policy and terms URLs in the Codex manifest.
- This repository now ships only the production package.
- Documented Claude Code sign-in (`/mcp`, or a custom connector in the desktop app) and plugin updates.

## 0.3.0 (2026-09-25)

- Made Blueprint discovery user-initiated in plugin guidance and metadata.
- Added concise authoring help and named component-schema requests; detailed design guidance remains available on demand.
- Removed full authoring-help requirements from title, visibility, and share-link changes.
- Added persistent Canvas authoring guidance and the `replace_canvas_state` workflow.
- Documented coherent `canvasStates` alongside page reads and writes.
- Clarified that Custom sections require detailed design guidance and that Blueprint acceptance does not create page content.

## 0.2.0

- Added the ChatGPT illustration-file workflow documentation.
- Aligned the Codex and Claude Code manifests with the public repository.

## 0.1.0

- Initial Codex and Claude Code beta package.
- Hosted OAuth MCP connection to the Valha server.
- Skills for saving work, reusing Valha knowledge, and applying reviewed Blueprints.
