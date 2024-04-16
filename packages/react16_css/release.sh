#!/bin/bash
version=$(node -p "require('./package.json').version")
npm_package_name=$(node -p "require('./package.json').name")
git add package.json
git commit -m "release: ${npm_package_name} v${version}"
git tag "v${version}"
git push
git push --tags
npm publish
cnpm sync
