COMMENT ON SCHEMA organ IS 'This module describes the structure of the organizations receiving the patients.

Topics
------


Organizations
-------------
An organization can be internal or external. It is composed of one or several groups.

Participants
------------
Participants are working for organizations. They are attached to groups.

Dossier
-------
A dossier contains information about patients or family members. They are attached to different groups, depending the topics.

Group
-----
A group belongs to an organization. One or several participants are attached to this group, and have access to one or several dossiers.

Referee
-------
When a dossier is attached to a group, a referee is chosen from the participants attached to this same group.
';

COMMENT ON TABLE organ.organization IS 'An organization receiving patients.';

COMMENT ON TABLE organ.dossier IS 'Information about patient, family';

COMMENT ON TABLE organ.group IS 'Group receiving patients';

COMMENT ON TABLE organ.participant IS 'Base information about a participant. Uniqueness of participants is done in firstname/lastname.';

COMMENT ON TABLE organ.dossier_assignment IS 'Assignation of a patient to a group';

COMMENT ON TABLE organ.participant_assignment IS 'Assignation of a participant to a group';

COMMENT ON TABLE organ.referee IS 'Participant is a referee for a patient in a give group';

COMMENT ON COLUMN organ.organization.org_id IS 'Unique identifier';

COMMENT ON COLUMN organ.organization.org_name IS 'Organization name';

COMMENT ON COLUMN organ.dossier.dos_id IS 'Unique identifier';

COMMENT ON COLUMN organ.dossier.dos_firstname IS 'Person firstname';

COMMENT ON COLUMN organ.dossier.dos_lastname IS 'Person lastname';

COMMENT ON COLUMN organ.dossier.dos_birthdate IS 'Person birthdate';

COMMENT ON COLUMN organ.group.grp_id IS 'Unique identifier';

COMMENT ON COLUMN organ.group.org_id IS 'Organization to which is attached the group';

COMMENT ON COLUMN organ.group.grp_name IS 'Name of the group';

COMMENT ON COLUMN organ.participant.par_id IS 'Unique identifier';

COMMENT ON COLUMN organ.participant.par_firstname IS 'Participant first name(s)';

COMMENT ON COLUMN organ.participant.par_lastname IS 'Participant last name';
