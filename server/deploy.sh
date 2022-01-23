#!/bin/bash

## install dependencies if needed.
npm i
## build
npm run build
npm run migrate:latest
## DONE
