import Endpoint from "../entities/endpoint.ts";

export default interface Storage {
  getEndpoints(): Endpoint[];
  setEndpoint(endpoint: Endpoint): void;
}
