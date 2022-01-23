#!/bin/bash

## install dependencies if needed.
npm i
# build and output to './tmp'
BUILD_PATH='./tmp' npm run build
# replace './build' content with new './tmp'
rm -rf ./build && mv ./tmp ./build && rm -rf ./tmp
# DONE.