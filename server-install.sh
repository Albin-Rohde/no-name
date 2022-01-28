#!/bin/bash
git clone git@github.com:albinr99salt/no-name.git

cd no-name
git config core.hooksPath "$PWD/hooks/"
git config receive.denyCurrentBranch updateInstead

