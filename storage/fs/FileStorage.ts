import * as path from "jsr:@std/path";

import Endpoint from "../../entities/endpoint.ts";
import Storage from "../Storage.ts";

const NOT_FOUND = "ENOENT";
const ROOT_FOLDER = "__storage";

export default class FileStorage implements Storage {
  getEndpoints(): Endpoint[] {
    return [
      {
        id: "123",
        name: "foobar",
        context: "mock",
        version: "1",
        resource: "shoes",
      },
    ];
  }

  async setEndpoint(endpoint: Endpoint): Promise<void> {
    const { context, name } = endpoint;

    await this.checkRootFolder();

    await this.checkContextFolder(context);

    await this.checkEndpointFolder(context, name);
  }

  private async checkEndpointFolder(
    contextFolderPath: string,
    endpointFilePath: string,
  ): Promise<void> {
    const pathToEndpointFile = path.join(
      ROOT_FOLDER,
      contextFolderPath,
      endpointFilePath,
    );

    const endpointFileInfo = await this.checkFile(pathToEndpointFile);

    if (endpointFileInfo === null) {
      const textEncoder = new TextEncoder();
      const data = textEncoder.encode(
        "This is a subject we should not talk about",
      );
      await Deno.writeFile(pathToEndpointFile, data);
    }
  }

  private async checkContextFolder(contextFolderPath: string) {
    const pathToContext = path.join(ROOT_FOLDER, contextFolderPath);

    const contextInfo = await this.checkFile(pathToContext);

    if (contextInfo === null) {
      Deno.mkdir(pathToContext);
    }
  }

  private async checkRootFolder() {
    const rootInfo = await this.checkFile(ROOT_FOLDER);
    if (rootInfo === null) {
      Deno.mkdir(ROOT_FOLDER);
    }
  }

  private async checkFile(pathFile: string): Promise<Deno.FileInfo | null> {
    let info;
    try {
      info = await Deno.stat(pathFile);
    } catch (error: unknown) {
      if (error.code !== NOT_FOUND) {
        throw error;
      }
      return null;
    }
    return info;
  }
}
