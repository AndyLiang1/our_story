#!/usr/bin/env bash

echo "Using migrations from: $(pwd)"
MIGRATIONS_DIR="./yoyo_migrations"

echo "Migration status before"
make list

yoyo apply -b -v --database $DB_CONNECTION_STRING $MIGRATIONS_DIR/tables/

echo "Migration status after"
make list

