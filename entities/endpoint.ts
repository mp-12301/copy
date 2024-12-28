import Schema from "./schema.ts";

export default interface Endpoint {
  description?: string;
  context: string;
  version?: string;
  resource: string;
  schema: Schema;
}
