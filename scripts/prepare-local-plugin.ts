import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePlugin } from "./validate-plugin";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const productionUrl = "https://valha.link/mcp";
const localUrl = "https://localhost:4949/mcp";
const localName = "valha-local";

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function prepareLocalPlugin(marketplaceRoot = join(root, ".tmp/valha-local-marketplace")) {
  validatePlugin();

  const pluginRoot = join(marketplaceRoot, "plugins", localName);
  rmSync(marketplaceRoot, { recursive: true, force: true });
  cpSync(join(root, "plugins/valha"), pluginRoot, { recursive: true });
  rmSync(join(pluginRoot, ".claude-plugin"), { recursive: true });
  rmSync(join(pluginRoot, "README.md"));

  const manifestPath = join(pluginRoot, ".codex-plugin/plugin.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.name = localName;
  manifest.interface.displayName = "Valha Local";
  manifest.interface.websiteURL = "https://localhost:4949";
  writeJson(manifestPath, manifest);

  const mcpPath = join(pluginRoot, ".mcp.json");
  const mcp = JSON.parse(readFileSync(mcpPath, "utf8"));
  if (mcp.mcpServers?.valha?.url !== productionUrl) throw new Error("Unexpected MCP URL");
  mcp.mcpServers.valha.url = localUrl;
  writeJson(mcpPath, mcp);

  for (const skill of ["save-valha-work", "use-valha-blueprints", "use-valha-knowledge"]) {
    const path = join(pluginRoot, "skills", skill, "agents/openai.yaml");
    const content = readFileSync(path, "utf8");
    if (content.split(productionUrl).length !== 2)
      throw new Error(`Unexpected MCP URL in ${skill}`);
    writeFileSync(path, content.replace(productionUrl, localUrl));
  }

  const marketplace = JSON.parse(
    readFileSync(join(root, ".agents/plugins/marketplace.json"), "utf8"),
  );
  marketplace.name = localName;
  marketplace.interface.displayName = "Valha Local";
  marketplace.plugins[0].name = localName;
  marketplace.plugins[0].source.path = `./plugins/${localName}`;
  writeJson(join(marketplaceRoot, ".agents/plugins/marketplace.json"), marketplace);

  return marketplaceRoot;
}

if (import.meta.main) {
  console.info(`Local Valha plugin ready: ${prepareLocalPlugin()}`);
}
