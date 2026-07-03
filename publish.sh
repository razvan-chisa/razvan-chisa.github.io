set -euo pipefail

if [[ -n $(git status --porcelain) ]]; then
  echo "Error: You have uncommitted changes. Please commit or stash them before publishing."
  exit 1
fi

git branch -D pages
git checkout -b pages
git rebase main

npm run build
cp -r dist/* . && rm -rf dist
git add .
git commit -m "Publish dist folder"

git branch --set-upstream-to=origin/pages