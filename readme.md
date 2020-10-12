# Example gh-pages feature preview

This repo exists as a demo on how to deploy previews of all branches
to GitHub Pages.

## `cleanup-gh-pages-previews` package

In case you have a setup thats similar to this one I published the `_beforeAdd.js` script to npm.

```bash
# install script
npm i cleanup-gh-pages-previews

# configure it
GIT_REMOTE=origin \
PRODUCTION_BRANCH=main \
PREVIEW_FOLDER=preview \
`# use it with gh-pages` \
gh-pages --before-add cleanup-gh-pages-previews
```
