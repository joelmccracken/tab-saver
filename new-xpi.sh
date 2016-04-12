#!/usr/bin/env bash

version=0.0.1
xpi_name=@tab-saver-${version}.xpi

jpm xpi

if [[ ! -e "$xpi_name" ]];
then
    echo $xpi_name does not exist
    echo was the version changed?
    exit 1
fi

git add $xpi_name
git commit -m 'new xpi'
