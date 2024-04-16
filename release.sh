#!/bin/bash
# Usage: ./release.sh <project_directory>

project_dir="$1"  # Get the project directory from the command line argument

cd "$project_dir" || exit  # Change to the project directory or exit if it fails

version=$(node -p "require('./package.json').version")
npm_package_name=$(node -p "require('./package.json').name")
git add package.json
git commit -m "release: ${npm_package_name} v${version}"
git tag "v${version}"
git push
git push --tags
npm publish
cnpm sync
