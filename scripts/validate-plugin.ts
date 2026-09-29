import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mcpUrl = "https://valha.link/mcp";
const pluginFiles = [
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".mcp.json",
  "README.md",
  "skills/save-valha-work/SKILL.md",
  "skills/save-valha-work/agents/openai.yaml",
  "skills/use-valha-blueprints/SKILL.md",
  "skills/use-valha-blueprints/agents/openai.yaml",
  "skills/use-valha-knowledge/SKILL.md",
  "skills/use-valha-knowledge/agents/openai.yaml",
];
const rootFiles = [
  ".gitignore",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/marketplace.json",
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "SECURITY.md",
];
const supportFiles = [
  "AGENTS.md",
  "scripts/prepare-local-plugin.ts",
  "scripts/validate-plugin.ts",
  "tests/validate-plugin.test.ts",
];

function files(directory: string, prefix = ""): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = join(prefix, entry.name);
    if (relativePath === ".git" || relativePath === ".tmp") return [];
    if (entry.isDirectory()) return files(join(directory, entry.name), relativePath);
    if (!entry.isFile()) throw new Error(`unsupported file: ${relativePath}`);
    return [relativePath];
  });
}

function validateInventory(directory: string, expected: string[]) {
  const actual = files(directory);
  const unexpected = actual.filter((path) => !expected.includes(path));
  const missing = expected.filter((path) => !actual.includes(path));
  if (unexpected.length || missing.length) {
    throw new Error(
      `plugin inventory mismatch; unexpected=${unexpected.join(",") || "none"}; missing=${missing.join(",") || "none"}`,
    );
  }
}

export function validatePluginFile(path: string, content: string) {
  if (
    /localhost|127\.0\.0\.1|0\.0\.0\.0|private-repo|github\.com\/(?!Alex-Levacher\/valha-plugin(?=[^A-Za-z0-9_-]|$))/i.test(
      content,
    )
  ) {
    throw new Error(`forbidden private or local reference in ${path}`);
  }
  for (const url of content.match(/https?:\/\/[^\s)`"']+/gi) ?? []) {
    if (/\/mcp(?:[/?#]|$)/i.test(url) && url !== mcpUrl) {
      throw new Error(`unsupported MCP URL in ${path}: ${url}`);
    }
  }
  if (/\b(?:api[_-]?key|secret|password|bearer\s+[a-z0-9._-]{16,})\b/i.test(content)) {
    throw new Error(`possible secret in ${path}`);
  }
  if (path.endsWith(".json")) JSON.parse(content);
  if (path.endsWith(".mcp.json")) {
    const manifest = JSON.parse(content) as { mcpServers?: Record<string, { url?: string }> };
    const servers = manifest.mcpServers;
    if (
      !servers ||
      !Object.keys(servers).length ||
      Object.values(servers).some((s) => s.url !== mcpUrl)
    ) {
      throw new Error(`MCP manifest URL must be ${mcpUrl}`);
    }
  }
  if (path.endsWith("SKILL.md")) {
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (
      !frontmatter ||
      !/^name:\s*\S+/m.test(frontmatter[1]) ||
      !/^description:\s*\S+/m.test(frontmatter[1])
    ) {
      throw new Error(`invalid skill metadata in ${path}`);
    }
  }
  if (path.endsWith("agents/openai.yaml")) {
    const value = Bun.YAML.parse(content) as {
      interface?: { display_name?: unknown; short_description?: unknown; default_prompt?: unknown };
      dependencies?: {
        tools?: Array<{ type?: unknown; value?: unknown; transport?: unknown; url?: unknown }>;
      };
    };
    const tool = value.dependencies?.tools?.length === 1 ? value.dependencies.tools[0] : undefined;
    if (
      typeof value.interface?.display_name !== "string" ||
      typeof value.interface.short_description !== "string" ||
      typeof value.interface.default_prompt !== "string" ||
      tool?.type !== "mcp" ||
      tool.value !== "valha" ||
      tool.transport !== "streamable_http" ||
      tool.url !== mcpUrl
    ) {
      throw new Error(`invalid OpenAI skill metadata in ${path}`);
    }
  }
}

export function validatePlugin() {
  validateInventory(root, [
    ...rootFiles,
    ...supportFiles,
    ...pluginFiles.map((file) => `plugins/valha/${file}`),
  ]);
  validateInventory(join(root, "plugins/valha"), pluginFiles);
  for (const path of [
    "AGENTS.md",
    ...rootFiles,
    ...pluginFiles.map((file) => `plugins/valha/${file}`),
  ]) {
    validatePluginFile(path, readFileSync(join(root, path), "utf8"));
  }
  const codex = JSON.parse(
    readFileSync(join(root, "plugins/valha/.codex-plugin/plugin.json"), "utf8"),
  );
  const claude = JSON.parse(
    readFileSync(join(root, "plugins/valha/.claude-plugin/plugin.json"), "utf8"),
  );
  const marketplace = JSON.parse(
    readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"),
  );
  const codexMarketplace = JSON.parse(
    readFileSync(join(root, ".agents/plugins/marketplace.json"), "utf8"),
  );
  if (
    codex.version !== claude.version ||
    codex.version !== marketplace.version ||
    codex.version !== marketplace.plugins?.[0]?.version ||
    codex.repository !== "https://github.com/Alex-Levacher/valha-plugin" ||
    claude.repository !== codex.repository ||
    codexMarketplace.plugins?.[0]?.source?.path !== "./plugins/valha" ||
    marketplace.plugins?.[0]?.source !== "./plugins/valha"
  ) {
    throw new Error("plugin version, repository, or marketplace source mismatch");
  }
}

if (import.meta.main) {
  validatePlugin();
  console.info("Valha plugin package is valid.");
}
