import {Injectable} from 'angular2/core';


@Injectable()
export class LocalStorageService {

  constructor() { }

  getSchemaDescription(key: string) {
    return localStorage.getItem('desc.schema.' + key);
  }

  setSchemaDescription(key: string, value: string) {
    localStorage.setItem('desc.schema.' + key, value);
  }

  removeSchemaDescription(key: string) {
    localStorage.removeItem('desc.schema.' + key);
  }

  schemaDescriptionExists(key) {
    return localStorage.getItem('desc.schema.' + key) != null;
  }
}
