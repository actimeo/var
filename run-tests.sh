echo '====================== PgProc PHPUNIT ========================'
(cd pgproc/tests && ../../phpunit .) || exit 1
echo '====================== PgDoc PHPUNIT ========================='
(cd pgdoc/tests && ../../phpunit .) || exit 1
echo '======================= Auth PHPUNIT ========================='
(cd auth/tests && ../../phpunit .) || exit 1
echo '========================= JASMINE ============================'
karma start || exit 1
echo '=========================== OK ==============================='
