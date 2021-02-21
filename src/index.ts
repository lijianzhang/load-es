import { Module } from 'module';
import path from 'path';
import fs from 'fs';
import { transformSync } from 'esbuild';

const OriginModule = Module as any;
const originModuleLoad = OriginModule._load;

function parseNodeModulePaths(filename: string) {
    const paths: string[] = [];
    let p = filename;
    while (p.length > 1) {
        paths.push(path.dirname(p) + '/node_modules');
        p = path.dirname(p);
    }
    return paths;
}

function resolveFilename(filename: string, parent): string {
    if (filename.startsWith('/')) {
        return filename;
    } else {
        return OriginModule._resolveFilename(filename, parent);
    }
}

OriginModule._extensions['.ts'] = function (module, filename) {
    const context = fs.readFileSync(filename, 'utf-8');
    module._compile(transformSync(context, { format: 'cjs', sourcemap: "inline"  }).code, filename);
}

OriginModule._load = (request: string, parent, isMain) => {
    try {
        const m = originModuleLoad(request, parent, isMain);
        return m;
    } catch (error) {
        if (error.code === 'ERR_REQUIRE_ESM') {
            const filename = resolveFilename(request, parent);
            const code = transformSync(fs.readFileSync(filename).toString(), { format: 'cjs', sourcemap: "inline" }).code;
            //@ts-ignore
            const m: any = new Module();
            m.id = filename;
            m.filename = filename
            m.paths = parseNodeModulePaths(filename)
            m.parent = parent;
            m._compile(code, filename);
            require.cache[filename] = m;
            return m.exports;
        } else if (/\.css/.test(request)) {
            return {};
        } else if (/\.ts$/.test(request)) {
            const filename = resolveFilename(request, parent);
            const code = transformSync(fs.readFileSync(filename).toString(), { format: 'cjs', sourcemap: "inline"  }).code;
            //@ts-ignore
            const m: any = new Module();
            m.id = filename;
            m.filename = filename
            m.paths = parseNodeModulePaths(filename)
            m.parent = parent;
            m._compile(code, filename);
            require.cache[filename] = m;
            return m.exports;
        }
        else {
            throw error;
        }

    }
}