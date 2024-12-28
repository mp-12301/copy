import Mock from "./mock.ts";

export type Method = "POST" | "GET";

export default interface Schema {
  method: Method;
  status: number;
  data: Mock;
}
