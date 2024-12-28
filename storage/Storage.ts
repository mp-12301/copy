import Context from "../entities/context.ts";
import Resource from "../entities/resource.ts";

export default interface Storage {
  getContext(contextId: string): Context | null;
  createContext(context: Context): void;
  getAllContexts(): Context[];
  removeContext(contextId: string): void;
  getResource(contextId: string, resourceId: string): Resource | null;
  setResource(contextId: string, resource: Resource): void;
  getAllResources(contextId: string): Resource[];
  removeResource(contextId: string, resourceId: string): void;
}
