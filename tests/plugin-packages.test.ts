import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const production = new URL("../plugins/valha/", import.meta.url);
const local = new URL("../local-marketplace/plugins/valha-local/", import.meta.url);
const skills = ["save-valha-work", "use-valha-blueprints", "use-valha-knowledge"];

const read = (root: URL, path: string) => readFileSync(new URL(path, root), "utf8");
const json = (root: URL, path: string) => JSON.parse(read(root, path));

test("production and local packages use distinct MCP names and endpoints", () => {
  const productionServers = json(production, ".mcp.json").mcpServers;
  const localServers = json(local, ".mcp.json").mcpServers;
  expect(Object.keys(productionServers)).toEqual(["valha"]);
  expect(Object.keys(localServers)).toEqual(["valha-local"]);
  expect(productionServers.valha.url).toBe("https://valha.link/mcp");
  expect(localServers["valha-local"].url).toBe("https://localhost:4949/mcp");

  for (const skill of skills) {
    const path = `skills/${skill}/`;
    expect(read(local, `${path}SKILL.md`)).toBe(read(production, `${path}SKILL.md`));
    expect(read(local, `${path}agents/openai.yaml`)).toBe(
      read(production, `${path}agents/openai.yaml`)
        .replace('value: "valha"', 'value: "valha-local"')
        .replace("https://valha.link/mcp", "https://localhost:4949/mcp"),
    );
  }
});

test("both plugins have distinct identities and icons", () => {
  const productionManifest = json(production, ".codex-plugin/plugin.json");
  const localManifest = json(local, ".codex-plugin/plugin.json");
  const productionMarketplace = json(
    new URL("../", import.meta.url),
    ".agents/plugins/marketplace.json",
  );
  const localMarketplace = json(
    new URL("../local-marketplace/", import.meta.url),
    ".agents/plugins/marketplace.json",
  );

  expect(productionManifest.name).toBe("valha");
  expect(localManifest.name).toBe("valha-local");
  expect(localManifest.version).toBe(productionManifest.version);
  expect(localManifest.interface.displayName).toBe("Valha Local");
  expect(productionMarketplace.plugins).toHaveLength(1);
  expect(productionMarketplace.plugins[0].name).toBe("valha");
  expect(localMarketplace.name).toBe("valha-local");
  expect(localMarketplace.plugins[0].source.path).toBe("./plugins/valha-local");

  for (const [root, manifest] of [
    [production, productionManifest],
    [local, localManifest],
  ] as const) {
    expect(manifest.interface.logo).toBe("./assets/logo.png");
    expect(manifest.interface.composerIcon).toBe("./assets/logo.png");
    expect(readFileSync(new URL(manifest.interface.logo, root)).length).toBeGreaterThan(0);
  }
  expect(readFileSync(new URL("assets/logo.png", local))).not.toEqual(
    readFileSync(new URL("assets/logo.png", production)),
  );
});

test("released Blueprint and save guidance remains deliberate", () => {
  const blueprint = read(production, "skills/use-valha-blueprints/SKILL.md");
  const save = read(production, "skills/save-valha-work/SKILL.md");
  expect(blueprint).toMatch(/user explicitly asks|user explicitly requests/i);
  expect(blueprint).toContain("Inspection is not acceptance");
  expect(blueprint).toContain("do not ask for redundant confirmation");
  expect(save).toContain("not search Blueprints as a prerequisite");
  expect(save).toContain("does not authorize page creation or publication");
});
