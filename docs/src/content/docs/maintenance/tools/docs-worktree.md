---
title: Documentation Worktree
---

Documentation for UmBootstrap is edited in a git worktree, on a permanent `docs/site` branch, separate from the branch you are writing code on.

Pushing that branch publishes the site.

## The problem it solves

Documentation does not get written, because the thought arrives at the worst moment.

You are several files deep in a feature and realise something needs documenting. Acting on it means stashing your work, switching branch, writing, switching back, finding your place. Each instance is a small cost. In aggregate it is fatal: the docs wait, and then they do not happen.

Committing docs alongside each feature sounds tidier and fails the same way. "I will add it before I merge" is a promise made by someone about to be interrupted.

## Layout

```
UmBootstrap/                     main working directory, code, on a feature branch
UmBootstrap/.worktrees/docs/     docs worktree, always on docs/site
```

Both folders are the same repository. One `.git`, two branches checked out at once. `.worktrees/` is gitignored.

## Writing docs

```bash
cd .worktrees/docs/docs
npm run dev
```

The path is doubled because the worktree is `.worktrees/docs` and the Astro site lives in `docs/` inside it.

Commit and push from the worktree. Pushing deploys.

## Rules

**Never edit docs from the main working directory.** The same files exist there. Editing them puts the change on a code feature branch, where it sits unpublished until that branch merges.

**Check the absolute path before editing.** The two folders look identical in an editor. The path is the only way to tell.

**Do not batch changes.** Push as you write.

**Docs that are genuinely part of a code change can stay with the code.** A source file and its reference page changing together belong in the same feature branch. The worktree is for documentation that stands alone.

## Deployment

`docs/site` deploys to the live site on every push touching `docs/**`.

Two gates control this, and both matter if the setup is ever rebuilt:

1. The trigger in `.github/workflows/docs.yml` points at `docs/site`.
2. The `github-pages` environment branch policy includes `docs/site`.

A branch missing from that second allowlist builds successfully and then fails at the deploy step, with no steps recorded in the failed job. It is a confusing signature if you do not know to look for it.

`main` is deliberately not a trigger. If both branches deployed, they would publish different content, and last-writer-wins means a release deploy would silently overwrite newer documentation with the older `main` copy.

## Keeping the branches in step

Code lands on `develop`, docs land on `docs/site`. They diverge by design.

To bring code changes into the docs worktree:

```bash
cd .worktrees/docs
git merge develop
```

Worth doing periodically so the docs branch is not building against stale config.

To bring documentation back into `develop`, branch from `develop`, merge `origin/docs/site`, and raise a PR as normal.

Neither is urgent. The site deploys from `docs/site` directly.
