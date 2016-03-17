import {Injectable} from 'angular2/core';

@Injectable()
export class UserService {
  private LOGIN = 'login';
  private TOKEN = 'token';

  connect(token, login) {
    localStorage.setItem(this.TOKEN, token);
    localStorage.setItem(this.LOGIN, login);
  }

  getToken() { return localStorage.getItem(this.TOKEN); }
  getLogin() { return localStorage.getItem(this.LOGIN); }

  isConnected() { return localStorage.getItem(this.TOKEN) !== null; }

  disconnect() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.LOGIN);
  }
}
