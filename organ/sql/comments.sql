COMMENT ON SCHEMA organ IS 'This module describes the structure of the organization receiving the patients.

An organisation is composed of one or several institutions, and of staff members.

Institutions
------------
An institution provides one or more services. Each service is composed of groups, to which patients will be attached.

Staff members
-------------
Staff members are assigned to service groups (only ones from institutions to which members are assignable).';

COMMENT ON TABLE organ.institution IS 'An institution receiving patients.';

COMMENT ON TABLE organ.service IS 'A service to patients';

COMMENT ON TABLE organ.service_group IS 'Group of a certain service';

COMMENT ON TABLE organ.staff IS 'Base information about a staff member. Uniqueness of staff members is done in firstname/lastname.';

COMMENT ON TABLE organ.staff_group_assignment IS 'Assignation of a staff member to a service group';

COMMENT ON TABLE organ.staff_institution_assignable IS 'Assignation possibility of a staff member to service groups of an institution';

COMMENT ON COLUMN organ.institution.ins_id IS 'Unique identifier';

COMMENT ON COLUMN organ.institution.ins_name IS 'Institution name';

COMMENT ON COLUMN organ.service.ser_id IS 'Unique identifier';

COMMENT ON COLUMN organ.service.ins_id IS 'Institution providing the service';

COMMENT ON COLUMN organ.service.ser_name IS 'Service name';

COMMENT ON COLUMN organ.service.ser_topics IS 'Topics covered by the service';

COMMENT ON COLUMN organ.service_group.sgr_id IS 'Unique identifier';

COMMENT ON COLUMN organ.service_group.ser_id IS 'Service provided by the group';

COMMENT ON COLUMN organ.service_group.sgr_name IS 'Name of the group';

COMMENT ON COLUMN organ.service_group.sgr_start_date IS 'Date at which the group activity begins';

COMMENT ON COLUMN organ.service_group.sgr_end_date IS 'Date at which the group activity ends';

COMMENT ON COLUMN organ.service_group.sgr_notes IS 'Free notes about the group';

COMMENT ON COLUMN organ.staff.stf_id IS 'Unique identifier';

COMMENT ON COLUMN organ.staff.stf_firstname IS 'Staff member first name(s)';

COMMENT ON COLUMN organ.staff.stf_lastname IS 'Staff member last name';

COMMENT ON COLUMN organ.staff_group_assignment.sga_id IS 'Unique identifier';

COMMENT ON COLUMN organ.staff_group_assignment.sgr_id IS 'Service group to which the staff member is assigned';

COMMENT ON COLUMN organ.staff_group_assignment.stf_id IS 'Staff member assigned';

COMMENT ON COLUMN organ.staff_institution_assignable.sia_id IS 'Unique identifier';

COMMENT ON COLUMN organ.staff_institution_assignable.ins_id IS 'Staff can be assigned to the service groups of this institution';

COMMENT ON COLUMN organ.staff_institution_assignable.stf_id IS 'Staff member assignable';

