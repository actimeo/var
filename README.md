[![Build Status](https://travis-ci.org/actimeo/var.svg?branch=master)](https://travis-ci.org/actimeo/var)

Variation v2
============

Status
------

Early development stage.

Install
-------

- In your favorite PostgreSQL server, create a new connection role
- copy `config.inc.php.sample` to `config.inc.php`
- copy `config.sh.sample` to `config.sh`
- Edit these 2 files with your database information
- Execute the following commands:

```shell
# create the database
$ sudo su postgres -c ./create-db.sh

# install tables and co.
$ ./install.sh

# install stored procedures
$ ./update.sh

# run tests
$ ./run-tests.sh
```

- Configure you preferred web server to serve the `htdocs/` directory.

Modules
-------

### PgProc

Module to call PostgreSQL stored procedures from PHP and Javascript.

### PgDoc

Inline database (schema and stored procedures) documentation. 

Visible at `http://your_server/pgdoc` (Angular2, recent browser needed)

### Auth

Authentication module.

Demo visible at `http://your_server/auth` (Angular2, recent browser needed)
