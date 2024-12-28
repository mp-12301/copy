export type MockReference = string;

export default interface Mock {
  [key: string]: MockReference;
}
