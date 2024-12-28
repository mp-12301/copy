import Schema from "./schema.ts";

export default interface Resource {
  id: string;
  schema: Schema | null;
}
