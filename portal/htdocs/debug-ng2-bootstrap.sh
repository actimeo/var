#! /bin/sh
# run this script after ng2-bootstrap 1.0.3 install 
find node_modules/ng2-bootstrap -name '*.ts' | grep -v '\.d\.ts$' | xargs rm
