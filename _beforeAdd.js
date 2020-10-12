const { readdir, rmdir } = require("fs").promises;
const path = require("path");

const REMOTE = "origin";
const PRODUCTION_BRANCH = "main";

/** @param git {import("gh-pages/lib/git")} */
module.exports = async (git) => {
  await git.exec("remote", "set-branches", REMOTE, "*");
  await git.fetch("--all");
  await git.exec(
    "branch",
    "-r",
    "--no-merged",
    `${REMOTE}/${PRODUCTION_BRANCH}`
  );

  const previewFolder = path.join(git.cwd, "preview");
  const unmergedRemoteBranches = git.output
    .trim()
    .split("\n")
    .map((branchName) =>
      branchName.trim().replace(new RegExp(`^${REMOTE}\/`, ""), "")
    );
  const previews = await readdir(previewFolder);
  const mergedOrDeletedPreviews = previews.filter(
    (previewName) => !unmergedRemoteBranches.includes(previewName)
  );

  return Promise.all(
    mergedOrDeletedPreviews.map((previewName) =>
      rmdir(path.join(previewFolder, previewName), { recursive: true })
    )
  );
};
