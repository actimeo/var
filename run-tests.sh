echo '====================== PgProc PHPUNIT ========================'
(cd pgproc/tests && ../../phpunit .) || exit 1
echo '======================= Core PHPUNIT ========================='
(cd core/tests && ../../phpunit .) || exit 1
exit;
echo '========================= JASMINE ============================'
karma start || exit 1
echo '=========================== OK ==============================='
