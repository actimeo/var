COMMENT ON SCHEMA patient IS 'This module collects all the information about the patients.

A patient is assigned to institution service groups.

When a patient is assigned to a particular group, it is defined one or more referents from the staff members assigned to that group.

A presence status is defined for each patient in each institution. This status is more important than the assignation of a patient in a group.
';

COMMENT ON TABLE patient.patient IS 'Base information about a patient. Uniqueness of patients is done in firstname/lastname/birthdate.';

COMMENT ON TABLE patient.patient_group_assignment IS 'Information about the assignment of a patient to a service group';

COMMENT ON TABLE patient.patient_group_referent IS 'Patients have one or more referents when assigned to a service group';

COMMENT ON TABLE patient.status IS 'Presence status of a patient in an institution';

COMMENT ON COLUMN patient.patient.pat_id IS 'Unique identifier';

COMMENT ON COLUMN patient.patient.pat_firstname IS 'Patient first name(s)';

COMMENT ON COLUMN patient.patient.pat_lastname IS 'Patient last name';

COMMENT ON COLUMN patient.patient.pat_birthdate IS 'Patient birth date';

COMMENT ON COLUMN patient.patient_group_assignment.pga_id IS 'Unique identifier';

COMMENT ON COLUMN patient.patient_group_assignment.sgr_id IS 'The service group of assignment';

COMMENT ON COLUMN patient.patient_group_assignment.pat_id IS 'The assigned patient';

COMMENT ON COLUMN patient.patient_group_assignment.pga_status IS 'Status of the assignment';

COMMENT ON COLUMN patient.patient_group_assignment.pga_start_date IS 'Assignment start date';

COMMENT ON COLUMN patient.patient_group_assignment.pga_end_date IS 'Assignment end date';

COMMENT ON COLUMN patient.patient_group_assignment.pga_request_date IS 'Date of assignment request';

COMMENT ON COLUMN patient.patient_group_assignment.pga_renew_request_date IS 'Date of assignment renewal request';

COMMENT ON COLUMN patient.patient_group_assignment.pga_notes IS 'Free notes about the assignment';

COMMENT ON COLUMN patient.patient_group_referent.pgr_id IS 'Unique identifier';

COMMENT ON COLUMN patient.patient_group_referent.pga_id IS 'Patient/group to which is attached the referent';

COMMENT ON COLUMN patient.patient_group_referent.stf_id IS 'Referent staff member';

COMMENT ON COLUMN patient.status.sta_id IS 'Unique identifier';

COMMENT ON COLUMN patient.status.pat_id IS 'Patient';

COMMENT ON COLUMN patient.status.ins_id IS 'Institution';

COMMENT ON COLUMN patient.status.sta_status IS 'Status';

COMMENT ON TYPE patient.institution_status IS 'Presence status of a patient in an institution:
- preadmission: Patient pre-admission is requested
- admission: Patient admission is requested
- present: Patient admission is accepted and patient is present
- left: Patient is not present anymore
- unknown: Unknown status
';

COMMENT ON TYPE patient.patient_group_assignment_status IS 'Status (for information) of the assignment request of a patient in a service group:
- requested: the request to assign the patient to the group is done, waiting for a response
- accepted: the request is accepted
- refused: the request is refused
- finished: *(really used?)*';

