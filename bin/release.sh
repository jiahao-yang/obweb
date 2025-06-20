#!/bin/env bash
pushd ob
git checkout main
git pull
popd

pushd front
npm install
npm run build
popd

pushd backend
npm install
pkill -f "node server.js"
npm run prod

