import Endpoint from '../../entities/endpoint';
import Storage from '../Storage';

export default class FileStorage implements Storage {

  getEndpoints(): Endpoint[] {
    return [
      {
        id: "123",
        name: "foobar",
        context: "mock",
        version: "1",
        resource: "shoes",
      }
    ]
  }

  setEndpoint(endpoint: Endpoint): void {
      
  }
}
