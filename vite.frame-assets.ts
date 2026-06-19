import { constants, createReadStream } from "node:fs";
import { access, copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export function getPublicAssetRequestPath(url: string | undefined, route = "/image") {
  if (!url) {
    return null;
  }

  const pathname = decodeURIComponent(url.split("?")[0]);
  const routePrefix = route.endsWith("/") ? route : `${route}/`;

  if (!pathname.startsWith(routePrefix)) {
    return null;
  }

  const relativePath = pathname.slice(routePrefix.length);
  const normalizedPath = path.posix.normalize(relativePath);

  if (!relativePath || normalizedPath.startsWith("../") || normalizedPath === ".." || path.posix.isAbsolute(normalizedPath)) {
    return null;
  }

  return normalizedPath;
}

export async function copyDirectoryRecursive(sourceDir: string, targetDir: string) {
  await mkdir(targetDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirectoryRecursive(sourcePath, targetPath);
        return;
      }

      if (entry.isFile()) {
        await mkdir(path.dirname(targetPath), { recursive: true });
        await copyFile(sourcePath, targetPath);
      }
    }),
  );
}

async function pathExists(targetPath: string) {
  try {
    await access(targetPath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export function localFrameAssetsPlugin(options = { sourceDir: "image", route: "/image" }): Plugin {
  let root = "";
  let outDir = "dist";

  return {
    name: "local-frame-assets",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const relativePath = getPublicAssetRequestPath(request.url, options.route);

        if (!relativePath) {
          next();
          return;
        }

        const sourceRoot = path.resolve(root, options.sourceDir);
        const targetPath = path.resolve(sourceRoot, relativePath);

        if (!targetPath.startsWith(`${sourceRoot}${path.sep}`)) {
          response.statusCode = 403;
          response.end("Forbidden");
          return;
        }

        if (!(await pathExists(targetPath)) || !(await stat(targetPath)).isFile()) {
          next();
          return;
        }

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", contentTypes[path.extname(targetPath).toLowerCase()] ?? "application/octet-stream");
        createReadStream(targetPath).pipe(response);
      });
    },
    async writeBundle() {
      const sourceRoot = path.resolve(root, options.sourceDir);

      if (!(await pathExists(sourceRoot))) {
        return;
      }

      await copyDirectoryRecursive(sourceRoot, path.join(outDir, options.sourceDir));
    },
  };
}
