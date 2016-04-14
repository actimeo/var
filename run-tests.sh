echo '====================== PgProc PHPUNIT ========================'
(cd pgproc/tests && ../../phpunit .) || exit 1

echo '====================== PgDoc PHPUNIT ========================='
(cd pgdoc/tests && ../../phpunit .) || exit 1

echo '======================= Auth PHPUNIT ========================='
(cd auth/tests && ../../phpunit .) || exit 1

echo '====================== Portal PHPUNIT ========================'
(cd portal/tests && ../../phpunit .) || exit 1

echo '====================== Organ PHPUNIT ========================='
(cd organ/tests && ../../phpunit .) || exit 1

#exit;
echo '========================= JASMINE ============================'
karma start || exit 1

echo '=========================== OK ==============================='
