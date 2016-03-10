import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {UserService} from './../services/user';

declare var PgProc: any;

@Injectable()
export class PortalService {
  token: string;

  constructor(private http: Http, user: UserService) { this.token = user.getToken(); }

  listEntities() {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'entity_list', {}).then(resolve, reject);
    });
  }

  listPortals() {
    console.log('portalService listPortals, token=' + this.token);
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'portal_list', {
        'prm_token': this.token
      }).then(resolve, reject);
    });
  }

  addPortal(name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'portal_add', {prm_token: this.token, prm_name: name})
          .then(resolve, reject);
    });
  }

  renamePortal(id, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'portal_rename', {
        prm_token: this.token,
        prm_id: id,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  deletePortal(id) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'portal_delete', {prm_token: this.token, prm_id: id})
          .then(resolve, reject);
    });
  }

  listMainsections(porId) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainsection_list', {
        'prm_token': this.token,
        'prm_por_id': porId
      }).then(resolve, reject);
    });
  }

  addMainsection(porId, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainsection_add', {
        prm_token: this.token,
        prm_por_id: porId,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  deleteMainsection(id) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainsection_delete', {prm_token: this.token, prm_id: id})
          .then(resolve, reject);
    });
  }

  renameMainsection(id, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainsection_rename', {
        prm_token: this.token,
        prm_id: id,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  moveMainsection(id, pos) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainsection_move_before_position', {
        prm_token: this.token,
        prm_id: id,
        prm_position: pos
      }).then(resolve, reject);
    });
  }

  listPersonsections(porId, entity) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personsection_list', {
        'prm_token': this.token,
        'prm_por_id': porId,
        'prm_entity': entity
      }).then(resolve, reject);
    });
  }

  addPersonsection(porId, entity, name) {
    return new Promise((resolve, reject) => {
      PgProc(
          '/portal/ajax/', 'portal', 'personsection_add',
          {prm_token: this.token, prm_por_id: porId, prm_entity: entity, prm_name: name})
          .then(resolve, reject);
    });
  }

  deletePersonsection(id) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personsection_delete', {prm_token: this.token, prm_id: id})
          .then(resolve, reject);
    });
  }

  renamePersonsection(id, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personsection_rename', {
        prm_token: this.token,
        prm_id: id,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  movePersonsection(id, pos) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personsection_move_before_position', {
        prm_token: this.token,
        prm_id: id,
        prm_position: pos
      }).then(resolve, reject);
    });
  }

  listPersonmenus(pseId) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personmenu_list', {
        'prm_token': this.token,
        'prm_pse_id': pseId
      }).then(resolve, reject);
    });
  }

  addPersonmenu(pseId, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personmenu_add', {
        prm_token: this.token,
        prm_pse_id: pseId,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  deletePersonmenu(id) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personmenu_delete', {prm_token: this.token, prm_id: id})
          .then(resolve, reject);
    });
  }

  renamePersonmenu(id, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personmenu_rename', {
        prm_token: this.token,
        prm_id: id,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  movePersonmenu(id, pos) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'personmenu_move_before_position', {
        prm_token: this.token,
        prm_id: id,
        prm_position: pos
      }).then(resolve, reject);
    });
  }

  listMainmenus(mseId) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainmenu_list', {
        'prm_token': this.token,
        'prm_mse_id': mseId
      }).then(resolve, reject);
    });
  }

  addMainmenu(mseId, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainmenu_add', {
        prm_token: this.token,
        prm_mse_id: mseId,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  deleteMainmenu(id) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainmenu_delete', {prm_token: this.token, prm_id: id})
          .then(resolve, reject);
    });
  }

  renameMainmenu(id, name) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainmenu_rename', {
        prm_token: this.token,
        prm_id: id,
        prm_name: name
      }).then(resolve, reject);
    });
  }

  moveMainmenu(id, pos) {
    return new Promise((resolve, reject) => {
      PgProc('/portal/ajax/', 'portal', 'mainmenu_move_before_position', {
        prm_token: this.token,
        prm_id: id,
        prm_position: pos
      }).then(resolve, reject);
    });
  }
}
