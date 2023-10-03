#! /bin/bash

docker compose down -v

rm -rf container
mkdir container
mkdir container/data
mkdir container/conf

docker compose up -d