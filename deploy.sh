#!/bin/bash

hugo

python3 scripts/generate-null-redirect-stubs.py

git add .

git commit -m "Updates"

git push