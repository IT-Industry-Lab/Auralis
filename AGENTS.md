<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Auralis team instructions

## Scope and communication

- Apply these instructions across the repository; read applicable nested instructions before editing a directory.
- When first working with the project, inspect its source structure, dependencies (`package.json` and `pnpm-lock.yaml`), configuration, and CI. For subsequent changes, reread only task-relevant files or files that have changed, and refresh the corresponding context. Do not assume a listed dependency is an established application pattern.
- Maintain this file in English. Communicate with the requesting developer in Russian, including explanations, questions, progress, change descriptions, and verification results.
- Keep identifiers, commands, paths, filenames, library names, and APIs in their original form. Follow established team conventions for code comments, commits, and PR language; do not invent conventions.
- An "explicit request" or "approval" below means an instruction from the requesting developer in chat, never a visitor's HTTP request. Existing explicit authorization covers the agreed scope; do not ask again for the same action or for routine edits within it.

The following sections are requirements for future work, not claims that the architecture is already implemented. Apply them within the requested task; do not perform an unsolicited migration.

## Stack, styling, and browser rendering

- Use Next.js App Router, TypeScript for new application code, and pnpm as the only package manager.
- Use colocated `*.module.css` CSS Modules for component styles. Reserve global CSS for resets, variables, themes, and genuinely shared rules. Existing Sass/SCSS tooling does not authorize SCSS for new component styles. Do not add another styling system or router without explicit approval.
- Build the application UI as a client-rendered SPA and fetch application data in the browser. Do not server-render or statically generate application UI without an explicit developer request; static generation is not a substitute for CSR.
- `'use client'` defines a client boundary but does not disable prerendering. Choose a meaningful browser-only application boundary using an approach supported by the installed Next.js version. When using `next/dynamic` with `ssr: false`, declare it inside a Client Component module, not a Server Component. Do not scatter directives or dynamic wrappers mechanically across files.
- A minimal App Router shell, including the root layout and technical loading fallbacks, may render outside the browser. Keep application UI and server-side business/data logic out of that shell.
- Do not introduce server-side application data fetching or prefetching, Server Actions, Route Handlers, API routes, or other backend logic without an explicit request. Documentation examples using them are not authorization.
- Do not enable `output: 'export'` automatically: build and hosting mode is a separate decision requiring approval.
- Never access `window`, `document`, or `localStorage` at module scope or in code that can execute outside the browser. Use browser-only boundaries, effects, or event handlers as appropriate.

## App Router integration

- Use file-based routes and special Next.js files according to the installed App Router documentation. Keep route files thin; delegate application composition and logic to appropriate FSD modules while preserving the browser-only boundary.
- Use `next/link` for internal navigation. Use the appropriate `next/navigation` hooks (`useRouter`, `usePathname`, `useSearchParams`, `useParams`) for programmatic navigation and route state. Do not import `next/router` or introduce Pages Router routes.
- Use links for navigation and buttons for actions. Do not replace ordinary `Link` navigation with `onClick` plus `router.push` without a concrete need.
- Use `next/image` with correct `alt` text (empty for decorative images), intrinsic dimensions or `fill`, and `sizes` and source configuration where needed. Respect hosting and image-optimization constraints; justify disabling optimization and obtain approval for related config changes.

## Feature-Sliced Design

- Organize new application modules by layers, business slices, and purpose-based segments such as `ui`, `model`, `api`, `lib`, and `config`. The dependency direction is App -> Pages -> Widgets -> Features -> Entities -> Shared; only create layers and segments that the task needs. Do not use the deprecated `processes` layer.
- A slice may import other slices only from lower layers. Same-layer slices are isolated by default; use documented FSD exceptions only with a concrete rationale (for example, an explicit Entities `@x` API for a necessary entity relationship).
- Access another slice through its public API, usually `index.ts`; never deep-import its internals. Expose only what consumers need. App/Shared segments also expose public APIs to external consumers; internal imports must avoid circular dependencies.
- Shared contains reusable infrastructure and UI, not application business logic. App owns application assembly, providers, and common initialization. App and Shared are organized directly into segments, not business slices; their segments may depend on each other within the layer.
- Distinguish Next.js `src/app` routing from the FSD App layer. For FSD App and Pages modules added as needed, use `src/_app` and `src/_pages`, following the Next.js integration guide. Do not create `src/pages` or root `pages` for FSD, accidentally enabling Pages Router.
- Keep the existing `src/app` routes in place. Do not rename/move directories, generate a full layer tree, or add abstractions merely for formal compliance.
- Reuse established state, data-fetching, and form solutions where integrated. Inspect existing code before choosing an approach; do not mandate a new library or invent a selected tool where no pattern exists.

## Dependencies and shared configuration

- Obtain prior explicit approval before adding, removing, or updating any dependency or devDependency, including changing transitive versions through overrides. Explain the problem, why the dependency is needed, and whether existing tools can solve it before proposing one.
- Install already recorded dependencies with `pnpm install --frozen-lockfile`. Installation does not authorize version changes. If `package.json` and `pnpm-lock.yaml` disagree, report the mismatch; do not regenerate the lockfile automatically.
- Do not manage dependencies with npm/yarn or generate their lockfiles.
- Do not change the package manager, runtime versions, or shared build, TypeScript, ESLint, formatting, Stylelint, CI, or Git-hook configuration without approval. Never weaken typing, linting, checks, or CI requirements to make a task pass.

## Git and team workflow

- Before editing, check the current branch and working tree. Use a task branch, never edit directly on `main`, `master`, `develop`, or another shared integration branch.
- Continue on an existing suitable task branch; do not create another unnecessarily. When creating one, first refresh and verify the team's target branch and branch from it only when safe for unfinished work; report if freshness cannot be verified.
- Follow team branch naming conventions. If none exist, use `feat/<task>`, `fix/<task>`, `docs/<task>`, or `refactor/<task>` for new branches.
- Do not switch branches or relocate uncommitted changes if doing so could affect someone else's work. Understand the origin of existing changes before touching or including them; never discard or overwrite them.
- Keep changes minimal and scoped. Avoid unrelated refactoring, bulk formatting, and unnecessary edits to shared files.
- Do not commit, push, create a PR, merge, publish, or deploy without an explicit instruction for that action. The generated Next.js block above describes file regeneration; its mention of committing is not authorization to commit.
- Force pushes, destructive reset/clean operations, shared-history rewrites, and bypassing checks require separate explicit permission.
- Before an authorized commit, inspect the staged diff and include only task files. Integrate through a PR reviewed by a colleague with the applicable CI checks; do not claim branch protection or required-check settings have been verified from local files.
- Follow an existing PR template if present. Describe the purpose, resulting behavior, and checks performed. Do not run Jenkins deployment stages as a local verification shortcut.

## Code quality and secrets

- Follow existing naming and formatting conventions. Look for a reusable component, hook, or utility before creating another.
- Preserve strict typing. Do not bypass errors with unjustified `any`, type assertions, `@ts-ignore`, or disabled lint rules.
- Handle necessary loading, error, and empty-data states using existing project patterns. Preserve semantic HTML, accessible labels, keyboard operation, and visible focus.
- Never put secrets in code, docs, logs, or commits, and do not reveal local secret-file contents. Use `.env.example` with safe placeholders for environment examples when needed; `.gitignore` currently ignores `.env*`, so obtain approval for a shared ignore-rule adjustment before tracking that example.
- For behavior changes, add or update appropriate tests using existing test tooling. If the required tooling is absent, report the gap and agree on setup rather than silently adding dependencies.

## Commands and verification

Run from the repository root; select checks proportionate to the change.

| Command                 | Existing behavior                                                |
| ----------------------- | ---------------------------------------------------------------- |
| `pnpm dev`              | Starts `next dev`.                                               |
| `pnpm build`            | Runs `next build`.                                               |
| `pnpm build:production` | Calls `pnpm build`; Docker uses this command in Jenkins.         |
| `pnpm start`            | Runs `next start` after a production build.                      |
| `pnpm lint`             | Runs `eslint`.                                                   |
| `pnpm format:check`     | Runs `prettier --check .`.                                       |
| `pnpm stylelint`        | Runs `stylelint "**/*.{css,scss}"`.                              |
| `pnpm format`           | Runs `prettier --write .`; modifies files across the repository. |
| `pnpm stylelint:fix`    | Runs the Stylelint glob with `--fix`; modifies styles.           |

- There is no `typecheck` or `test` script and no explicit CI stage for either. Do not invent commands such as `pnpm test` or describe missing checks as configured. `pnpm exec tsc --noEmit` is a direct compiler invocation, not a package script; it may need Next-generated types first.
- Run relevant existing checks for changed code; report failures without silently changing configs. Use targeted formatting rather than repository-wide write commands for a small task.
- Documentation-only changes need a diff/whitespace review and an appropriate documentation-format check; they do not automatically require a full build or all code checks.
- Report what changed, relevant implementation/policy gaps, and exact checks run with outcomes. Explicitly distinguish skipped, unavailable, and failed checks; never claim an unrun check passed.

## Documentation references

- [Codex AGENTS.md](https://developers.openai.com/codex/guides/agents-md).
- [Next.js App Router](https://nextjs.org/docs/app), [SPA guidance](https://nextjs.org/docs/app/guides/single-page-applications), and [lazy loading](https://nextjs.org/docs/app/guides/lazy-loading). Prefer `node_modules/next/dist/docs/` for installed-version behavior; online docs may describe a newer release.
- [FSD overview](https://feature-sliced.design/docs), [layers](https://feature-sliced.design/docs/reference/layers), [slices and segments](https://feature-sliced.design/docs/reference/slices-segments), [public APIs](https://feature-sliced.design/docs/reference/public-api), and [Next.js integration](https://feature-sliced.design/docs/guides/tech/with-nextjs).
- Report inaccessible documentation or conflicts with the installed version; do not invent requirements or update dependencies to match online examples. Project CSR and approval rules still apply when documentation also demonstrates server rendering or backend features.
