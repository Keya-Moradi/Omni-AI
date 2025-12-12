# Omni-AI Version History

Version numbers reflect notable pushes to `main`. Each entry summarizes what changed since the prior version.

## v1.0.0 – Initial build
- Base Express/EJS app with auth, conversations, AI route scaffolding, Mongo models, and Heroku deployment setup.

## v1.1.0 – Routing and structure fixes
- Fixed API endpoints, routing, and file structure; ensured dashboard/chat flows were wired correctly.

## v1.2.0 – Safety documentation
- Added `docs/CODEX_SAFE_PROTOCOL.md` to outline safe practices (secrets, git hygiene, command safety).

## v1.3.0 – Env/auth/data hygiene
- Enforced env-driven config (Mongo URI, session secret), removed tracked env file, added `.env` template.
- Ownership checks on conversations/AI routes, cascade delete messages, timestamps, and safer session startup.

## v1.4.0 – Security hardening
- Added helmet, CSRF protection, rate limiting, input validation, secure session cookies, and trust-proxy toggle.

## v1.5.0 – Gemini endpoint fixes
- Switched Gemini calls to v1beta, configurable model/base URL; aligned default model with available endpoints.

## v1.6.0 – Multi-AI conversation loop
- ChatGPT and Gemini now alternate replies using shared history; configurable turn limit; reduced default to 1 for latency.

## v1.6.1 – Docs and setup updates
- README and local setup instructions; collaboration notes; clarified env setup and usage.

## v1.6.2 – Persona clarity
- Added system prompts so ChatGPT/Gemini self-identify and avoid impersonation.

## v1.7.0 – UI refresh
- New cohesive styling, streamlined dashboard/chat, mobile-responsive layout, and loading indicators on forms/AI sends.

## v1.7.1 – Code clarity pass
- Added concise inline comments to server and AI controller to explain flow, personas, and boot order without cluttering logic.

## v1.7.2 – Release process checklist
- Added `docs/RELEASE_CHECKLIST.md` to enforce comment sanity, CSP adherence, and version history updates before pushes to main.

## v1.7.3 – CSP protocol update
- Replaced Codex Safe Protocol with expanded CSP/God/Hellfire instructions for working in this repo.

## v1.7.4 – Conversation start + AI UX
- Start-a-conversation now accepts a prompt, auto-titles the thread, opens the chat, and runs the initial AI turn.
- Added reusable AI sequence helper and ensured chaining uses prior AI responses.

## v1.7.5 – Delete UX, loader, and AI chaining fixes
- Confirm-modal delete calls the API with credentials, removes threads inline, and uses overlay loader to avoid blank pages.
- Start/Send/Delete/Update now surface overlay loaders and disable buttons while in flight.
- Gemini reacts to ChatGPT output (ChatGPT prompt feeds Gemini prompt), and Gemini name prefixes are stripped.
