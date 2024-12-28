import * as path from "jsr:@std/path";

import Storage from "../Storage.ts";
import Resource from "../../entities/resource.ts";
import Context from "../../entities/context.ts";

const NOT_FOUND = "ENOENT";

export default class FileStorage implements Storage {
  private root_folder = "__storage";

  private contexts: Context[] = [];

  constructor(rootPath: string) {
    this.root_folder = rootPath;
  }

  async init() {
    const rootInfo = await this.checkFile(this.root_folder);

    if (rootInfo === null) {
      this.makeDir(this.root_folder);
    }

    const contextsAtRoot = this.readDir(this.root_folder);

    for await (const context of contextsAtRoot) {
      if (context.isDirectory) {
        const resourcesAtContext = this.readDir(
          path.join(this.root_folder, context.name),
        );

        const newContext = {
          id: context.name,
          resources: [] as Resource[],
        };
        this.contexts.push(newContext);

        for await (const resource of resourcesAtContext) {
          const data = await this.readFile(
            path.join(this.root_folder, context.name, resource.name),
          );

          let schema;
          try {
            schema = JSON.parse(data);
          } catch (_e) {
            schema = null;
          }

          newContext.resources.push({
            id: resource.name,
            schema,
          });
        }
      }
    }
  }

  getContext(contextId: string): Context | null {
    return this.contexts.find((context) => context.id === contextId) || null;
  }

  createContext(context: Context): void {
    const { id: contextName } = context;
    const contextPath = path.join(this.root_folder, contextName);

    this.makeDir(contextPath);

    this.contexts.push({
      id: contextName,
      resources: [] as Resource[],
    });
  }

  getAllContexts(): Context[] {
    return this.contexts;
  }

  removeContext(contextId: string): Promise<void> {
    const context = this.getContext(contextId);

    if (context) {
      const contextIndex = this.contexts.findIndex((context) =>
        context.id === context.id
      );
      this.contexts.splice(contextIndex, 1);

      const contextPath = path.join(this.root_folder, contextId);
      return this.removeDir(contextPath);
    }

    return Promise.reject();
  }

  getResource(contextId: string, resourceId: string): Resource | null {
    const context = this.getContext(contextId);
    if (context) {
      return context.resources.find((resource) => resource.id === resourceId) ||
        null;
    }
    return null;
  }

  setResource(contextId: string, resource: Resource): Promise<void> {
    const schemaStr = getSchemaStr(resource);
    const pathToResource = path.join(
      this.root_folder,
      contextId,
      resource.id,
    );

    const resourceToUpdate = this.getResource(contextId, resource.id);
    if (resourceToUpdate) {
      resourceToUpdate.schema = resource.schema || null;
    } else {
      const context = this.getContext(contextId);
      if (context) {
        context.resources.push(resource);
      }
    }

    return this.writeFile(pathToResource, schemaStr);

    function getSchemaStr(resource: Resource) {
      let schemaStr = "";
      if (resource.schema) {
        try {
          schemaStr = JSON.stringify(resource.schema);
        } catch (_e) {
          schemaStr = "";
        }
      }
      return schemaStr;
    }
  }

  removeResource(contextId: string, resourceId: string): Promise<void> {
    const context = this.getContext(contextId);
    if (context) {
      const resourceIndex = context.resources.findIndex((resource) =>
        resource.id === resourceId
      );
    }
    const pathToResourceFile = path.join(
      this.root_folder,
      contextId,
      resourceId,
    );
    return this.removeFile(pathToResourceFile);
  }

  getAllResources(contextId: string): Resource[] {
    const context = this.getContext(contextId);
    if (context) {
      return context.resources;
    }
    return [];
  }

  private writeFile(pathFile: string, data: string): Promise<void> {
    const encoder = new TextEncoder();
    const dataEncoded = encoder.encode(data);
    return Deno.writeFile(pathFile, dataEncoded);
  }

  private async readFile(pathFile: string): Promise<string> {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(pathFile);
    return decoder.decode(data);
  }

  private removeFile(pathFile: string): Promise<void> {
    return Deno.remove(pathFile);
  }

  private makeDir(pathDir: string): Promise<void> {
    return Deno.mkdir(pathDir);
  }

  private readDir(pathDir: string): AsyncIterable<Deno.DirEntry> {
    return Deno.readDir(pathDir);
  }

  private async removeDir(pathDir: string): Promise<void> {
  }

  private async checkFile(pathFile: string): Promise<Deno.FileInfo | null> {
    let info;
    try {
      info = await Deno.stat(pathFile);
    } catch (_e) {
      info = null;
    }
    return info;
  }
}
