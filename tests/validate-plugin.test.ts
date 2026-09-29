import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prepareLocalPlugin } from "../scripts/prepare-local-plugin";
import { validatePlugin, validatePluginFile } from "../scripts/validate-plugin";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("the public plugin package has only approved files and production MCP URLs", () => {
  expect(() => validatePlugin()).not.toThrow();
});

test("the local package keeps the skills and points every MCP dependency to localhost", () => {
  const directory = mkdtempSync(join(tmpdir(), "valha-local-plugin-"));
  try {
    prepareLocalPlugin(directory);
    const plugin = join(directory, "plugins/valha-local");
    const manifest = JSON.parse(readFileSync(join(plugin, ".codex-plugin/plugin.json"), "utf8"));
    const mcp = JSON.parse(readFileSync(join(plugin, ".mcp.json"), "utf8"));
    const marketplace = JSON.parse(
      readFileSync(join(directory, ".agents/plugins/marketplace.json"), "utf8"),
    );

    expect(manifest.name).toBe("valha-local");
    expect(marketplace.plugins[0].source.path).toBe("./plugins/valha-local");
    expect(mcp.mcpServers.valha.url).toBe("https://localhost:4949/mcp");
    for (const skill of ["save-valha-work", "use-valha-blueprints", "use-valha-knowledge"]) {
      const metadata = readFileSync(join(plugin, "skills", skill, "agents/openai.yaml"), "utf8");
      expect(metadata).toContain('url: "https://localhost:4949/mcp"');
      expect(readFileSync(join(plugin, "skills", skill, "SKILL.md"), "utf8")).toBe(
        read(`plugins/valha/skills/${skill}/SKILL.md`),
      );
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("private references and other MCP endpoints are rejected", () => {
  expect(() =>
    validatePluginFile("README.md", "https://github.com/example/internal-project"),
  ).toThrow(/forbidden private or local reference/);
  expect(() => validatePluginFile("README.md", "https://localhost:1234/mcp")).toThrow(
    /forbidden private or local reference/,
  );
  expect(() => validatePluginFile("README.md", "https://example.com/mcp")).toThrow(
    /unsupported MCP URL/,
  );
});

test("skill metadata and MCP manifest must point to production", () => {
  expect(() =>
    validatePluginFile(
      "plugins/valha/.mcp.json",
      '{"mcpServers":{"valha":{"url":"https://example.com/mcp"}}}',
    ),
  ).toThrow(/unsupported MCP URL/);
  expect(() =>
    validatePluginFile("plugins/valha/skills/save-valha-work/SKILL.md", "# Missing metadata"),
  ).toThrow(/invalid skill metadata/);
  expect(() =>
    validatePluginFile("plugins/valha/skills/save-valha-work/agents/openai.yaml", "interface: ["),
  ).toThrow();
});

test("skill guidance and plugin manifests retain the released behavior", () => {
  const blueprintSkill = read("plugins/valha/skills/use-valha-blueprints/SKILL.md");
  const saveSkill = read("plugins/valha/skills/save-valha-work/SKILL.md");
  const marketplace = JSON.parse(read(".claude-plugin/marketplace.json"));
  expect(blueprintSkill).toMatch(/user explicitly asks|user explicitly requests/i);
  expect(blueprintSkill).toMatch(/generic work goal|generic course/i);
  expect(blueprintSkill).toMatch(/never scan every workspace/i);
  expect(blueprintSkill).toContain("not approved recommendations");
  expect(blueprintSkill).toMatch(/inspect_blueprint.*before any proposal or acceptance/);
  expect(blueprintSkill).toContain("Inspection is not acceptance");
  expect(blueprintSkill).toContain("do not ask for redundant confirmation");
  expect(saveSkill).toContain("not search Blueprints as a prerequisite");
  expect(saveSkill).toContain("does not authorize page creation or publication");

  for (const host of ["codex", "claude"]) {
    const manifest = JSON.parse(read(`plugins/valha/.${host}-plugin/plugin.json`));
    expect(manifest.description).toContain("readable Valha pages");
    expect(manifest.description).toContain("Blueprints when requested");
    expect(manifest.version).toBe(marketplace.version);
  }
  const codex = JSON.parse(read("plugins/valha/.codex-plugin/plugin.json"));
  expect(codex.interface.shortDescription).toBe("Pages people actually read");
  expect(codex.interface.shortDescription.length).toBeLessThanOrEqual(30);
  expect(codex.interface.longDescription).toContain("When you ask for a Valha Blueprint");
  expect(codex.interface.defaultPrompt).toContain("Find a suitable Valha Blueprint for this task.");
  expect(codex.version).toBe(marketplace.version);
});
