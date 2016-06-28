COMMENT ON SCHEMA organ IS 'This module describes the structure of the organization receiving the patients.

Institutions
------------
An institution is composed of one or more groups, to which patients will be attached.

Participants
------------
Participants are assigned to groups.';

COMMENT ON TABLE organ.organization IS 'An organization receiving patients.';

COMMENT ON TABLE organ.dossier IS 'Information about patient, family';

COMMENT ON TABLE organ.group IS 'Group receiving patients';

COMMENT ON TABLE organ.participant IS 'Base information about a participant. Uniqueness of participants is done in firstname/lastname.';

COMMENT ON TABLE organ.dossier_assignment IS 'Assignation of a patient to a group';

COMMENT ON TABLE organ.participant_assignment IS 'Assignation of a participant to a group';

COMMENT ON TABLE organ.referee IS 'Participant is a referee for a patient';

COMMENT ON COLUMN organ.organization.org_id IS 'Unique identifier';

COMMENT ON COLUMN organ.organization.org_name IS 'Organization name';

COMMENT ON COLUMN organ.dossier.dos_id IS 'Unique identifier';

COMMENT ON COLUMN organ.dossier.dos_firstname IS 'Person firstname';

COMMENT ON COLUMN organ.dossier.dos_lastname IS 'Person lastname';

COMMENT ON COLUMN organ.dossier.dos_birthdate IS 'Person birthdate';

COMMENT ON COLUMN organ.group.grp_id IS 'Unique identifier';

COMMENT ON COLUMN organ.group.org_id IS 'Organization to which is attached the group';

COMMENT ON COLUMN organ.group.grp_name IS 'Name of the group';

COMMENT ON COLUMN organ.group.grp_topics IS 'Topics of the group';

COMMENT ON COLUMN organ.participant.par_id IS 'Unique identifier';

COMMENT ON COLUMN organ.participant.par_firstname IS 'Participant first name(s)';

COMMENT ON COLUMN organ.participant.par_lastname IS 'Participant last name';

