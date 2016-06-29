export interface DbInstitution {
  ins_id: number;
  ins_name: string;
}

export interface DbService {
  ser_id: number;
  ins_id: number;
  ser_name: string;
  ser_topics: string[];
}

export interface DbServiceGroup {
  sgr_id: number;
  ser_id: number;
  sgr_name: string;
  sgr_start_date: string;
  sgr_end_date: string;
  sgr_notes: string;
}

export interface DbStaff {
  stf_id: number;
  stf_firstname: string;
  stf_lastname: string;
}

