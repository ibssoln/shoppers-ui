#!/bin/bash
set -v

## angular cli build
npm run ng build -- --configuration production

## create and populate a folder
if [ -d "target" ]
then 
  rm -r target
  mkdir target
else
  mkdir target
fi

## copy node and angular code
cp -r dist target/dist
cp -r bulid target/build
cp server.js target
cp default.env target
cp -r server target
cp .npmrc target
cp package.json target
cp Dockerfile target

## download dependencies
cd target
node build/marking.js $1

cd ..
