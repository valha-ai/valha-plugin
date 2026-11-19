import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const production = new URL("../plugins/valha/", import.meta.url);
const skills = ["save-valha-work", "use-valha-playbooks", "use-valha-knowledge"];
const repository = new URL("../", import.meta.url);

const read = (root: URL, path: string) => readFileSync(new URL(path, root), "utf8");
const json = (root: URL, path: string) => JSON.parse(read(root, path));

test("the package connects only to the production MCP server", () => {
  expect(json(production, ".mcp.json").mcpServers).toEqual({
    valha: { type: "http", url: "https://valha.ai/mcp" },
  });
  for (const skill of skills) {
    const dependency = read(production, `skills/${skill}/agents/openai.yaml`);
    expect(dependency).toContain('value: "valha"');
    expect(dependency).toContain("https://valha.ai/mcp");
  }
});

test("the Codex manifest and marketplace identify the plugin and its icon", () => {
  const manifest = json(production, ".codex-plugin/plugin.json");
  const marketplace = json(repository, ".agents/plugins/marketplace.json");

  expect(manifest.name).toBe("valha");
  expect(marketplace.plugins).toHaveLength(1);
  expect(marketplace.plugins[0].name).toBe("valha");
  expect(marketplace.plugins[0].source.path).toBe("./plugins/valha");
  expect(manifest.interface.logo).toBe("./assets/logo.png");
  expect(manifest.interface.composerIcon).toBe("./assets/logo.png");
  expect(readFileSync(new URL(manifest.interface.logo, production)).length).toBeGreaterThan(0);
});

test("the Claude manifest matches its marketplace entry and the Codex manifest", () => {
  const claude = json(production, ".claude-plugin/plugin.json");
  const codex = json(production, ".codex-plugin/plugin.json");
  const marketplace = json(repository, ".claude-plugin/marketplace.json");

  expect(claude.name).toBe("valha");
  expect(claude.version).toBe(codex.version);
  expect(claude.description).toBe(codex.description);
  expect(marketplace.name).toBe("valha");
  expect(marketplace.plugins).toHaveLength(1);
  expect(marketplace.plugins[0].name).toBe("valha");
  // plugin.json is the only version source; a marketplace copy would drift.
  expect(marketplace.plugins[0].version).toBeUndefined();
  expect(marketplace.plugins[0].description).toBe(claude.description);
  expect(new URL(`${marketplace.plugins[0].source}/`, repository).href).toBe(production.href);
});

test("the OpenAI upload includes the listing URLs and review materials without credentials", () => {
  const codex = json(production, ".codex-plugin/plugin.json");
  const claude = json(production, ".claude-plugin/plugin.json");
  const { review, publication } = codex.extensions["com.openai"];

  expect(codex.interface.websiteURL).toBe(claude.homepage);
  expect(codex.interface.supportURL).toBe(claude.supportUrl);
  expect(codex.interface.privacyPolicyURL).toBe(claude.privacyPolicyUrl);
  expect(codex.interface.termsOfServiceURL).toBe(claude.termsOfServiceUrl);
  expect(codex.interface.shortDescription.length).toBeLessThanOrEqual(30);
  expect(codex.apps).toBeUndefined();
  expect(codex.extensions["com.openai"].apps).toBeUndefined();
  expect(review.test_cases.positive).toHaveLength(5);
  expect(review.test_cases.negative).toHaveLength(3);
  for (const item of review.test_cases.positive) {
    expect(item.description).toBeTruthy();
    expect(item.prompt).toBeTruthy();
    expect(item.tools_triggered).toBeTruthy();
    expect(item.expected_behavior).toBeTruthy();
  }
  for (const item of review.test_cases.negative) {
    expect(item.description).toBeTruthy();
    expect(item.prompt).toBeTruthy();
    expect(item.expected_behavior).toBeTruthy();
  }
  expect(review.test_credentials).toBeUndefined();
  expect(review.reviewer_instructions).toBeUndefined();
  expect(review.commerce).toBe(false);
  expect(publication.countries).toEqual([]);
  expect(publication.release_notes).toContain(codex.version);
  expect(publication.translations["fr-FR"].subtitle?.length ?? 0).toBeLessThanOrEqual(30);
  expect(publication.translations["fr-FR"].description.length).toBeLessThanOrEqual(4000);
  expect(publication.translations["en-US"]).toBeUndefined();
});

test("skills tell the assistant to stop when Valha is not connected", () => {
  for (const skill of skills) {
    expect(read(production, `skills/${skill}/SKILL.md`)).toContain(
      "If Valha tools are unavailable or return an authentication error, stop",
    );
  }
});

test("knowledge retrieval is optional, task-scoped and does not prioritize Valha", () => {
  const knowledge = read(production, "skills/use-valha-knowledge/SKILL.md");
  expect(knowledge).toContain("Searching is optional");
  expect(knowledge).toContain("When retrieval is chosen");
  expect(knowledge).toContain("current context is sufficient");
  expect(knowledge).toContain("an unknown answer alone does not justify consulting Valha");
  expect(knowledge).toContain("An explicit request to search Valha still calls for a search");
  expect(knowledge).toContain("Honor explicit requests");
  expect(knowledge).toContain("searches across all workspaces accessible to the connected account");
  expect(knowledge).toContain("use `list_pages` with its `workspaceId`");
  expect(knowledge).toContain("short task-specific query, without transcripts");
  expect(knowledge).toContain("Valha does not take precedence");
  expect(knowledge).not.toMatch(/before answering.*search|must search before|always search/i);
});

test("released Playbook and save guidance remains deliberate", () => {
  const playbook = read(production, "skills/use-valha-playbooks/SKILL.md");
  const save = read(production, "skills/save-valha-work/SKILL.md");
  expect(playbook).toMatch(/user explicitly asks|user explicitly requests/i);
  expect(playbook).toContain("Inspection is not acceptance");
  expect(playbook).toContain("do not ask for redundant confirmation");
  expect(save).toContain("not search Playbooks as a prerequisite");
  expect(save).toContain("does not authorize page creation or publication");
});

test("save guidance supports link-shared edits and keeps sharing in the app", () => {
  const save = read(production, "skills/save-valha-work/SKILL.md");
  const knowledge = read(production, "skills/use-valha-knowledge/SKILL.md");
  const playbooks = read(production, "skills/use-valha-playbooks/SKILL.md");
  const codex = json(production, ".codex-plugin/plugin.json");
  for (const guidance of [save, knowledge, playbooks]) {
    expect(guidance).not.toContain("update_page_sharing");
    expect(guidance).not.toContain("valha:publish");
  }
  expect(save).toContain("Share, publish, rotate a link or change visibility in the Valha app");
  expect(save).toContain("Do not silently substitute a private save");
  expect(save).toContain("Private pages and pages shared by link support MCP content edits");
  expect(save).toContain("every workspace role except reader can change Canvas state");
  expect(save).toContain(
    "If its audience broadened beyond the request, pause for the user's direction before retrying",
  );
  expect(save).toContain("invite_team_member");
  expect(codex.description).toContain("private Valha pages");
  const positive = codex.extensions["com.openai"].review.test_cases.positive;
  expect(
    positive.some((item: { prompt: string }) => item.prompt.includes("Reviewer project folder")),
  ).toBe(true);
  for (const item of positive) {
    expect(item.tools_triggered).not.toContain("update_page_sharing");
    expect(item.expected_behavior).not.toContain("valha:publish");
    expect(item.prompt).not.toContain("Make it public");
  }
});

test("Playbooks read as user-authored reference material, not remote instructions", () => {
  // Anthropic's directory policy 2F forbids directing the assistant to pull
  // behavioral instructions from an external source. A Playbook is a method the
  // user's own team wrote, returned only after the user selects it.
  const playbook = read(production, "skills/use-valha-playbooks/SKILL.md");
  expect(playbook).toContain("people in the user's own Valha workspace wrote and shared");
  expect(playbook).toContain("never as higher-priority instructions");
  expect(playbook).not.toMatch(/remote reusable methods|loaded from Valha/i);
});
