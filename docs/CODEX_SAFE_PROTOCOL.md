
# Codex Safe Protocol (CSP) 🛡

## Goal

Use Codex as a powerful junior staff engineer inside VS Code without letting it silently wreck Omni AI or overwrite your intent.

## Structure

Before / During / After, plus some hard rules.

---

## 0. Roles

**You** = Architect + Final Reviewer  

**Codex** = Fast junior staff who:

- Proposes changes
- Writes boilerplate and tests
- Explains tradeoffs
- Never decides product direction

Codex is allowed to suggest; you are required to veto.

---

## 1. BEFORE – Setup & Context

### Open the right files first

- Entry points
- Key modules
- Config
- Tests

Do not ask Codex “what’s wrong with the repo” when it only sees a random file.

### Give Codex a map, not a riddle

First prompt in a new Codex chat is always some version of:

> Using `@README.md`, `@pyproject.toml` (or equivalent) and `@src/main_*.py`,  
> give me a high-level map of the project, main components, and data flow.  
> Call out obvious smells and risks, but DO NOT change anything yet.

### Create a fix backlog, not random changes

Second prompt is:

> Scan the open files in `@src` and any tests in `@tests`.  
> Produce a prioritized list:  
> `[ID], file(s), issue summary, risk (low/med/high), quick win vs heavy lift.`  
> Do NOT modify code yet.

### You approve the backlog

- Cross out anything dumb
- Re-rank the rest
- Only then do you let Codex touch files

---

## 2. DURING – How Codex Is Allowed to Touch Code

### 2.1 Edit Scope Rules

#### One issue per operation

Each Codex request should focus on one backlog ID or one very small concern.  

No “please fix everything in `src/`” prompts.

#### Diffs or it didn’t happen

Always ask:

> Show the change as a diff and summarize the impact in plain English.

If Codex can’t explain the change, don’t accept it.

#### Minimal viable change first

If Codex proposes a huge refactor:

> Too heavy-handed. Propose the smallest safe change that fixes the issue and preserves behavior.

### 2.2 Tests Are Non-Negotiable

#### No major change without tests

For any core module, you require tests:

> Using `@src/core/xyz.py` and `@tests`,  
> design tests for the main happy path + realistic edge cases.  
> If tests don’t exist, create `@tests/test_xyz.py` using pytest.

#### Codex must connect tests to behavior

Ask:

> Explain in bullet points which behaviors these tests guarantee and which they still don’t cover.

### 2.3 Agent / Full Access Safety

#### Default mode: limited Agent, not Full Access

Let Codex:

- Read open/tagged files
- Propose changes
- Maybe run explicit commands (like `pytest`) with your approval

Do not grant “do whatever you want” access for early Omni AI work.

#### Command review

If Codex suggests running commands:

> Show me the exact command(s) you want to run and why. I’ll run them myself.

You run them in the terminal and paste output back as needed.

---

## 3. AFTER – Regression & Architecture

### Mandatory post-change explanation

After accepting a non-trivial diff, ask:

> Explain what changed in `@file.py` vs the previous version in plain language.  
> List:
> - New failure modes  
> - Performance implications  
> - Any assumptions about how other modules call this code.

### Run tests yourself

You, not Codex, run:

- `pytest`
- Or equivalent test suite

Only merge/commit if tests pass and the explanation makes sense.

### Keep commits small

One logical change per commit, for example:

- `Fix router validation bug`
- `Add tests for engine edge case`

If Codex touches too many files, ask it to split the changes and only accept part of the diff.

### Periodic architecture roast (no code)

After a chunk of fixes, request:

> Given `@src/main.py` `@src/core/*` `@src/router.py` and current tests,  
> critique the architecture as a staff engineer.  
> Give me top 5 v2 structural changes with tradeoffs.  
> Do NOT propose code changes now.

This feeds future refactors but doesn’t blow up v1.

---

## 4. Hard No’s

### No blind acceptance

- Never “Accept All” diffs from Codex without reading them.
- If you’re too tired to review, don’t run Codex on critical files.

### No silent behavior changes

If a change alters public behavior or API:

- It must be called out explicitly.
- It must be tied to a specific backlog item or requirement.

### No untracked auto-refactors

- No “reformat the entire repo” in one shot.
- Keep style/formatting changes separate from logic changes.

### No architecture redesigns without a written plan

Codex is not allowed to “rebuild Omni AI” from scratch in one session.

Big changes require:

- Written proposal
- File-by-file plan
- Your explicit approval

---

## 5. Execution Cycle Summary

**Before:** Open key files → Map the repo → Build & approve a backlog.  

**During:** One issue at a time → Minimal diff → Tests with every major change → Limited agent.  

**After:** Explain deltas → Run tests → Small commits → Occasional architecture review.  

That’s Codex Safe Protocol.
```

[1](https://learn.microsoft.com/en-us/powershell/scripting/community/contributing/general-markdown?view=powershell-7.5)
[2](https://community.openai.com/t/formatting-plain-text-to-markdown/595972)
[3](https://docs.gruntwork.io/guides/style/markdown-style-guide/)
[4](https://code.visualstudio.com/docs/languages/markdown)
[5](https://google.github.io/styleguide/docguide/style.html)
[6](https://www.reddit.com/r/haskell/comments/o1y5ly/how_to_generate_textbased_markdown_documents_in/)
[7](https://quarto.org/docs/authoring/markdown-basics.html)
[8](https://www.reddit.com/r/Markdown/comments/o70ihh/script_to_convert_source_code_to_markdown/)
[9](https://www.markdownguide.org/basic-syntax/)
[10](https://htmlmarkdown.com)