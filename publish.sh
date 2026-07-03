set -euo pipefail

if [[ -n $(git status --porcelain) ]]; then
  echo "Error: You have uncommitted changes. Please commit or stash them before publishing."
  exit 1
fi

git checkout pages
git rebase main

# Find the common ancestor (branch point) of pages and main
BRANCH_POINT=$(git merge-base pages main)

# Squash all commits since branch point into one (interactive rebase with squash)
git reset --soft "$BRANCH_POINT"
git commit -m "Publish dist folder (squashed)"

npm run build
cp -r dist/* . && rm -rf dist
git add .
git commit -m "Publish dist folder"