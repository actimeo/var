export interface DbUserInfo {
  usr_login: string;
  usr_temp_pwd: string;
  usr_rights: string[];
  par_id: number;
}

export interface DbUserLogin {
  usr_token: number;
  usr_temp_pwd: boolean;
  usr_rights: string[];
  par_id: number;
}

