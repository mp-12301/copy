import Endpoint from '../entities/endpoint';

export default interface Storage {
  getEndpoints(): Endpoint[];
  setEndpoint(endpoint: Endpoint): void;
}
