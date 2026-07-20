# Worktrees

## Layout

```
UmBootstrap/                     main working directory — code, on a feature branch
UmBootstrap/.worktrees/docs/     docs worktree — always on docs/site
```

Both folders are the same repository. One `.git`, two branches checked out at once.

`.worktrees/` is gitignored.

## Why

Documentation does not get written, because the thought arrives at the worst moment.

You are several files deep in a feature and realise something needs documenting. Acting on it means stashing your work, switching branch, writing, switching back, finding your place. Each instance is a small cost. In aggregate it is fatal: the docs wait, and then they do not happen.

Committing docs alongside each feature sounds tidier and fails the same way. "I will add it before I merge" is a promise made by someone about to be interrupted.

The worktree removes the switching cost. Write it, push it, it is live, back to work.

## Deployment

`docs/site` deploys to https://umtemplates.github.io/UmBootstrap/ on every push that touches `docs/**`.

Pushing publishes. There is no release gate.

Two things had to be wired for that, and both are easy to forget if this is ever rebuilt:

1. **The workflow trigger** in `.github/workflows/docs.yml` points at `docs/site`.
2. **The `github-pages` environment branch policy** includes `docs/site`. A branch missing from that allowlist builds successfully and then fails at the deploy step, with no steps recorded in the failed job.

`main` is deliberately **not** a trigger. If both branches deployed, they would publish different content, and last-writer-wins means a release deploy would silently overwrite newer documentation with the older `main` copy.

## Rules

**1. Never edit docs from the main working directory.**

The same files exist there. Editing them puts the change on a code feature branch, where it sits unpublished until that branch merges. That is the exact friction this setup removes.

**2. Check the absolute path before editing any docs file.**

The two folders look identical in an editor. The path is the only way to tell. If it is not under `.worktrees/docs/`, you are in the wrong place.

**3. Commit and push docs changes as you make them.**

Do not batch. Pushing deploys.

**4. Docs that are genuinely part of a code change can stay with the code.**

A source file and its reference page changing together belong in the same feature branch. This worktree is for documentation that stands alone.

## Working in it

```bash
cd .worktrees/docs/docs
npm run dev
```

Note the doubled path: the worktree is `.worktrees/docs`, and the Astro site lives in `docs/` inside it.

The worktree has its own working copy and so its own `node_modules`. Already installed; only needed again if the worktree is recreated.

## Drift

Code lands on `develop`, docs land on `docs/site`. They diverge by design.

To bring code into the docs worktree:

```bash
cd .worktrees/docs
git merge develop
```

Worth doing periodically so the docs branch is not building against stale config.

To bring docs back into `develop`, so `develop` is not missing documentation: branch from `develop`, merge `origin/docs/site`, PR as normal.

Neither is urgent. The site deploys from `docs/site` directly.
