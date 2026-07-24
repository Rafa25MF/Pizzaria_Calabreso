import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage"]);
const files = [];

function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(absolutePath);
        if (entry.isFile()) files.push(absolutePath);
    }
}

function resolveLocalReference(sourceFile, reference) {
    const cleanReference = reference.split(/[?#]/, 1)[0];
    if (!cleanReference) return null;
    const decodedReference = decodeURIComponent(cleanReference);
    return decodedReference.startsWith("/")
        ? path.join(projectRoot, decodedReference.slice(1))
        : path.resolve(path.dirname(sourceFile), decodedReference);
}

function isExternal(reference) {
    return /^(?:https?:|\/\/|data:|mailto:|tel:|javascript:|#)/i.test(reference);
}

walk(projectRoot);
const failures = [];

for (const file of files) {
    const relativePath = path.relative(projectRoot, file);

    if (/\.(?:class|pyc|exe|dll)$/i.test(file)) {
        failures.push(`${relativePath}: arquivo compilado não deve ser versionado`);
        continue;
    }

    if (file.endsWith(".js") && file !== fileURLToPath(import.meta.url)) {
        const source = fs.readFileSync(file, "utf8");
        if (!source.trim()) {
            failures.push(`${relativePath}: JavaScript vazio`);
            continue;
        }
        try {
            new vm.Script(source, { filename: relativePath });
        } catch (error) {
            failures.push(`${relativePath}: ${error.message}`);
        }
    }

    if (!/\.(?:html|css|md)$/i.test(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    const expressions = file.endsWith(".css")
        ? [/url\(\s*["']?([^\)"']+)/gi]
        : [/(?:href|src)\s*=\s*["']([^"']+)["']/gi, /\]\(([^)]+)\)/g];

    for (const expression of expressions) {
        for (const match of source.matchAll(expression)) {
            const reference = match[1].trim();
            if (!reference || isExternal(reference)) continue;
            const resolvedPath = resolveLocalReference(file, reference);
            if (resolvedPath && !fs.existsSync(resolvedPath)) {
                failures.push(`${relativePath}: referência ausente: ${reference}`);
            }
        }
    }
}

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}

console.log(`Validação concluída: ${files.length} arquivos verificados.`);

