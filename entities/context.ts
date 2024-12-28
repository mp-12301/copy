import Resource from "./resource.ts";

export default interface Context {
  id: string;
  resources: Resource[];
}
