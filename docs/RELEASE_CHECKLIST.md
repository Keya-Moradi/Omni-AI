# Release Checklist (before pushing to main)

Use this quick pass before every push to `main` to keep the repo safe and consistent.

1) Comments sanity
- Ensure code has concise, helpful comments where needed (flows, intent, non-obvious logic). Avoid line-by-line noise.

2) Codex Safe Protocol (CSP)
- Secrets stay out of git (`.env` ignored, placeholders only in examples).
- No secret logging; session/env config pulled from environment.
- Non-destructive git usage; no force pushes or resets without intent.
- Auth/ownership checks present on user-owned resources; middleware order intact.

3) Version history
- Update `docs/VERSION_HISTORY.md` with a new entry reflecting the changes since the last version.
- Commit the version bump alongside the code/docs changes.
