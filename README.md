Variation v2
============
Status 
------
Early development stage.

Install
-------
- In your favourite PostgreSQL server, create a new role
- copy config.inc.php.sample to config.inc.php
- copy config.inc.php.sample to config.inc.php
- Edit these 2 files with your database information

```shell
# create the database
sudo su postgres -c ./create-db.sh
# install tables and co. 
./install.sh
# install stored procedures
./update.sh
# tun tests
./run-tests.sh
```


