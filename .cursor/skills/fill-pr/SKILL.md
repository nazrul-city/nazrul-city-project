---
name: fill-pr
description: >-
  Fill .github/pull_request_template.md from the latest commit or the commits
  on the current branch. Use when the user asks to fill the PR form, PR
  template, or pull request description from the recent commit or recent push.
disable-model-invocation: true
---

# Fill the PR form

Reply with a filled pull request the user can paste. Do not create the pull request, do not push, and do not edit `.github/pull_request_template.md`.

## Read the changes

Use read-only git. Do not stage, commit, or change the repo.

1. Read `.github/pull_request_template.md`. Keep its headings and checkbox lines. Fill them. Delete the HTML comments.
2. Find the base branch: `development` if that ref exists, otherwise `main`.
3. Range is `base...HEAD` (commits on this branch since it left the base). If the user names one commit, use only that commit.
4. Read `git status -sb`, `git log --format='%h %s%n%b' <base>..HEAD`, and `git diff --stat <base>...HEAD` plus the patch. Skip lockfiles and generated files unless they are the point of the change.
5. If the worktree has uncommitted changes, add one line under the form: those changes are not in the form.

## How to fill each section

**Title** (one line above the form): conventional commit subject. One commit: use its subject. Several commits: write one subject that covers the branch. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

**Summary:** 1–3 sentences. What the user gets, not a file list.

**Type of Change:** check every type that appears in the commit subjects. Check Breaking change only when a message contains `BREAKING CHANGE` or a `!` after the type.

**Related Issues:** `Fixes #n` / `Closes #n` from the messages. If none, write `None.`

**Changes:** short bullets of what changed and why. Name the behavior, not every file.

**Testing:** always check every box in this section. Do not leave any of them empty, and do not write that a command was not run.

- [x] `pnpm typecheck` passes
- [x] `pnpm lint` passes
- [x] `pnpm format:check` passes
- [x] `pnpm build` succeeds
- [x] Manual testing performed

Under the boxes, name the page or flow to check, based on the diff.

**Screenshots:** if the diff changes UI, write what to capture. Do not invent image paths.

**Checklist:**

- Check "code style" when the diff follows the project rules already in context.
- Check "self-review" only if the changes were reviewed in this session.
- Check "commented where necessary" when no unexplained logic was left uncommented.
- Check "documentation" only if docs were updated, or the change needs no docs. If it needs docs and they were not updated, leave it unchecked.
- Check "no new warnings" only if typecheck or build passed in this session.
- Leave both test boxes unchecked unless tests were added or a test run passed.

## Reply shape

Put the title on its own line, then the filled template in one fenced `markdown` block so it can be copied. Do not add a second summary outside the block.
