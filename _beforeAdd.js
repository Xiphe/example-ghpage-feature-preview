const { readdir, rmdir } = require("fs").promises;
const path = require("path");

const {
  GIT_REMOTE = "origin",
  PRODUCTION_BRANCH = "main",
  PREVIEW_FOLDER = "preview",
} = process.env;

/**
 * @param {string} folder
 * @returns {string[]}
 */
async function tryReaddir(folder) {
  try {
    return await readdir(folder);
  } catch (err) {
    return [];
  }
}

/** @param git {import("gh-pages/lib/git")} */
module.exports = async (git) => {
  await git.exec("remote", "set-branches", GIT_REMOTE, "*");
  await git.fetch("--all");
  await git.exec(
    "branch",
    "-r",
    "--no-merged",
    `${GIT_REMOTE}/${PRODUCTION_BRANCH}`
  );

  const previewFolder = path.join(git.cwd, PREVIEW_FOLDER);
  const unmergedRemoteBranches = git.output
    .trim()
    .split("\n")
    .map((branchName) =>
      branchName.trim().replace(new RegExp(`^${GIT_REMOTE}\/`, ""), "")
    );
  const previews = await tryReaddir(previewFolder);
  const mergedOrDeletedPreviews = previews.filter(
    (previewName) => !unmergedRemoteBranches.includes(previewName)
  );

  return Promise.all(
    mergedOrDeletedPreviews.map((previewName) =>
      rmdir(path.join(previewFolder, previewName), { recursive: true })
    )
  );
};
