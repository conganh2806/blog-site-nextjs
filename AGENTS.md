# AGENTS.md

## 1. Project Overview

This repository is a standalone Next.js application written in TypeScript.

Primary goals:

* Keep the codebase simple, consistent, and maintainable.
* Prefer small, focused changes over broad refactoring.
* Minimize unnecessary context exploration and token usage.
* Follow existing project patterns before introducing new ones.
* Preserve existing behavior unless the task explicitly requires changing it.

---

## 2. Instruction Priority

When working on a task, follow instructions in this order:

1. The current user request.
2. This `AGENTS.md`.
3. Existing project architecture and conventions.
4. Existing implementations in nearby files.
5. General Next.js and TypeScript best practices.

When instructions conflict, stop and clearly report the conflict before making a risky change.

---

## 3. Context and Token Efficiency

Before reading or modifying code:

1. Identify the exact feature, route, component, hook, service, or utility involved.
2. Inspect only the files directly related to the task.
3. Follow imports only when necessary to understand behavior.
4. Do not scan the entire repository unless explicitly requested.
5. Prefer searching for exact symbols, filenames, routes, error messages, or imported functions.
6. Reuse information already discovered during the current task.
7. Do not repeatedly reopen unchanged files.
8. Do not restate large sections of code in explanations.
9. Do not generate documentation or summaries that were not requested.

Start inspection from paths explicitly provided by the user.

When no path is provided, search narrowly using:

* Component name
* Function name
* Route name
* API endpoint
* Error message
* Imported symbol
* Relevant domain term

Expand the search scope only when the current files are insufficient.

---

## 4. Required Workflow

For every non-trivial task, use this workflow.

### Step 1: Understand

Determine:

* The expected behavior
* The current behavior
* Relevant files
* Constraints
* Acceptance criteria

Do not modify code while the requirement is still materially ambiguous.

### Step 2: Inspect

Inspect the smallest relevant set of files.

Before implementation, identify:

* Files that must change
* Existing patterns that should be followed
* Potential server/client boundaries
* Potential behavioral or architectural risks

### Step 3: Plan

For tasks affecting multiple files, provide a short implementation plan.

The plan should contain only actionable steps. Do not provide a long conceptual explanation unless requested.

### Step 4: Implement

Make the smallest viable change that satisfies the requirement.

Do not:

* Refactor unrelated code
* Rename unrelated symbols
* Reformat unrelated files
* Move files without a clear requirement
* Introduce speculative abstractions
* Add dependencies without explicit approval
* Rewrite working code only for stylistic preference

### Step 5: Verify

Run the narrowest relevant checks first.

Depending on the project configuration, use available commands such as:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Do not claim a command passed unless it was actually executed.

### Step 6: Review

Before finishing:

1. Review the final diff.
2. Remove unrelated changes.
3. Remove dead code and unused imports.
4. Check for duplicated logic.
5. Check for accidental client-side code expansion.
6. Confirm the result satisfies the original acceptance criteria.

---

## 5. Scope Control

Always prefer a small and reviewable diff.

Rules:

* Change only files required by the task.
* Preserve public APIs unless explicitly instructed otherwise.
* Preserve existing visual behavior unless UI changes are requested.
* Preserve existing data contracts unless contract changes are requested.
* Do not alter package versions as part of an unrelated task.
* Do not modify configuration files unless required.
* Do not create generic utilities for a single trivial use case.
* Do not create a new abstraction merely to reduce a few lines.
* Do not perform repository-wide cleanup during a feature or bug-fix task.

When a larger refactor appears useful but is not required, report it separately instead of including it in the current change.

---

## 6. Next.js Architecture

Follow the repository's existing router convention.

If the project uses the App Router:

* Use Server Components by default.
* Add `"use client"` only when required.
* Keep client boundaries as low in the component tree as practical.
* Do not import server-only modules into Client Components.
* Keep secrets, private environment variables, database access, and privileged operations on the server.
* Prefer Server Actions, Route Handlers, or server-side services for server operations, depending on existing project patterns.
* Use `redirect` and `notFound` from server code when appropriate.
* Use client-side navigation only when interaction requires it.
* Avoid unnecessary client-side data fetching when data can be loaded on the server.

A component should become a Client Component only when it requires at least one of these:

* React state
* React effects
* Event handlers
* Browser APIs
* Client-only libraries
* Client-side context

Do not add `"use client"` to a page or layout merely because a nested element is interactive. Extract the interactive portion into a smaller Client Component.

---

## 7. Server and Client Boundaries

Server-only files should contain server-only imports where appropriate.

Examples of server-only concerns:

* Authentication secrets
* Session management
* Private environment variables
* Database access
* File-system access
* Administrative operations
* External service credentials

Do not place constants shared by both server and client in a file marked as server-only.

Separate shared and server-only values when necessary:

```text
lib/
  auth/
    auth.shared.ts
    auth.server.ts
```

Client Components must not import modules that transitively import:

* `server-only`
* Node.js-only APIs
* Database clients
* Private environment variables
* Server authentication utilities

When debugging a server/client import issue, inspect the complete import chain before changing code.

---

## 8. TypeScript Rules

Use strict, explicit, and maintainable TypeScript.

Rules:

* Do not use `any` unless integration constraints make it unavoidable.
* Prefer `unknown` over `any` for untrusted values.
* Narrow `unknown` values before using them.
* Avoid unnecessary type assertions.
* Do not use `as` merely to silence compiler errors.
* Prefer meaningful domain types over broad primitive objects.
* Reuse existing types when their meaning matches.
* Do not duplicate API response types across multiple files.
* Use discriminated unions for state with mutually exclusive variants.
* Handle nullable and optional values explicitly.
* Avoid non-null assertions unless the invariant is proven.
* Keep exported types stable unless the task requires changing them.

Prefer:

```ts
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Result }
  | { status: "error"; message: string };
```

Avoid:

```ts
type RequestState = {
  loading: boolean;
  data?: Result;
  error?: string;
};
```

---

## 9. React Component Rules

Components should have one clear responsibility.

Rules:

* Prefer composition over large configurable components.
* Keep page components focused on page composition and data loading.
* Extract logic only when it is reused or meaningfully complex.
* Avoid premature custom hooks.
* Do not store derived values in state.
* Do not use effects to derive values that can be calculated during render.
* Do not use effects for server-fetchable initial data.
* Avoid duplicated sources of truth.
* Use stable and meaningful keys for rendered lists.
* Do not use array indexes as keys when item identity exists.
* Keep event handlers focused and clearly named.
* Avoid deeply nested conditional JSX.
* Handle loading, empty, error, and success states explicitly when applicable.

Prefer:

```ts
const fullName = `${firstName} ${lastName}`;
```

Avoid:

```ts
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

---

## 10. State Management

Use the simplest state mechanism that satisfies the requirement.

Priority:

1. Server-rendered data
2. URL state
3. Local component state
4. Shared React context
5. External state management library

Do not introduce global state for data used by only one component or route.

Use URL search parameters for state that should be:

* Shareable
* Bookmarkable
* Restorable after refresh
* Reflected in browser navigation

Examples:

* Search queries
* Filters
* Pagination
* Sort order
* Selected tabs when navigation state matters

---

## 11. Data Fetching

Follow the existing project data-fetching pattern.

Rules:

* Prefer server-side fetching for initial page data.
* Avoid duplicate requests for the same resource.
* Avoid request waterfalls when independent requests can run concurrently.
* Use `Promise.all` for independent operations.
* Do not fetch more data than the UI requires.
* Validate external responses at trust boundaries when necessary.
* Handle expected failures explicitly.
* Do not expose sensitive backend error details to users.
* Preserve caching and revalidation semantics unless the task requires changing them.

For independent requests, prefer:

```ts
const [user, permissions] = await Promise.all([
  getUser(),
  getPermissions(),
]);
```

Avoid:

```ts
const user = await getUser();
const permissions = await getPermissions();
```

when the second request does not depend on the first.

---

## 12. API and Route Handlers

For Route Handlers:

* Validate request input.
* Return appropriate HTTP status codes.
* Use a consistent response shape.
* Do not expose stack traces or internal errors.
* Keep request orchestration in the handler.
* Move reusable business logic into server-side modules.
* Check authentication and authorization separately.
* Do not trust IDs, roles, or user information supplied by the client.
* Avoid broad `catch` blocks that hide the real failure.
* Log enough context to diagnose failures without logging secrets.

Example response shape:

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
```

Follow an existing repository response format when one already exists.

---

## 13. Error Handling

Handle errors at the appropriate layer.

Rules:

* Do not silently swallow errors.
* Do not use empty `catch` blocks.
* Do not show raw server errors to users.
* Use actionable user-facing messages.
* Preserve the original error as a cause when wrapping errors, where supported.
* Distinguish expected domain failures from unexpected system failures.
* Use error boundaries where route-level rendering failures need isolation.
* Avoid using exceptions for normal control flow.

When fixing an error, determine the root cause before adding fallback logic.

Do not hide a type, lint, build, or runtime problem using:

* `any`
* `@ts-ignore`
* `@ts-expect-error` without a documented reason
* Empty catch blocks
* Disabled lint rules
* Unnecessary optional chaining
* Broad fallback values

---

## 14. Styling and UI

Follow the styling approach already used in the repository.

Rules:

* Reuse existing design tokens, components, and utility classes.
* Preserve spacing, typography, and responsive patterns.
* Do not introduce a second styling system.
* Do not add inline styles when the project uses another established convention.
* Avoid duplicating reusable UI primitives.
* Maintain keyboard accessibility.
* Use semantic HTML.
* Provide labels for interactive controls.
* Preserve focus visibility.
* Use buttons for actions and links for navigation.
* Add loading and disabled states for asynchronous actions.

Do not redesign existing UI unless explicitly requested.

---

## 15. Naming Conventions

Use clear names that describe intent.

Rules:

* Components: `PascalCase`
* Hooks: `useCamelCase`
* Functions and variables: `camelCase`
* Constants: follow the repository's current convention
* Boolean values: prefer `is`, `has`, `can`, `should`
* Event handlers: prefer `handle...`
* Callback props: prefer `on...`

Examples:

```ts
const isLoading = true;
const canEditArticle = false;
const handleSubmit = () => {};
```

Avoid vague names such as:

```ts
data
item
temp
obj
value
handle
process
doSomething
```

unless the surrounding context makes their meaning unambiguous.

---

## 16. File Organization

Follow the current repository structure.

Do not create a new folder convention when an existing convention is already in use.

General guidance:

* Keep route-specific components near their route when they are not reused.
* Keep shared UI components in the existing shared component location.
* Keep server-only logic outside Client Component directories when practical.
* Keep tests near the source or in the existing test directory.
* Avoid files that contain unrelated responsibilities.
* Avoid barrel exports when they create unclear dependencies or circular imports.
* Do not create an `index.ts` file merely to shorten one import.

Before creating a new file, check whether an existing file is the correct owner of the behavior.

---

## 17. Imports

Rules:

* Follow the existing absolute or relative import convention.
* Keep import ordering consistent with existing files.
* Remove unused imports.
* Avoid circular dependencies.
* Do not import from internal implementation paths when a stable public module exists.
* Use `import type` for type-only imports where appropriate.
* Do not create aliases solely for one task unless project configuration already supports them.

Example:

```ts
import type { User } from "@/types/user";
```

---

## 18. Performance

Do not perform speculative optimization.

Optimize only when:

* There is an observed problem.
* The requirement includes a performance constraint.
* The current implementation has an obvious inefficiency.
* The improvement reduces client JavaScript, network usage, rendering, or repeated work without harming clarity.

Check for:

* Unnecessary Client Components
* Duplicate network requests
* Sequential independent requests
* Excessive state
* Expensive calculations during render
* Large client-side dependencies
* Unbounded list rendering
* Repeated parsing or transformation
* Avoidable image or font loading costs

Do not add `useMemo`, `useCallback`, dynamic imports, caching, or memoization automatically.

Use them only when there is a clear reason.

Prefer architectural performance improvements over micro-optimizations:

* Server Components instead of unnecessary client rendering
* Smaller client boundaries
* Parallel data fetching
* Appropriate caching
* Pagination
* Smaller response payloads
* Reduced dependency size

---

## 19. Security

Rules:

* Never expose secrets to the client.
* Only variables intentionally exposed to the browser may use the public environment variable prefix.
* Validate and sanitize untrusted input where appropriate.
* Verify authorization on the server.
* Do not rely on hidden UI controls for authorization.
* Do not log passwords, tokens, cookies, API keys, or private user data.
* Use HTTP-only cookies for sensitive session values when following cookie-based authentication.
* Preserve CSRF protections when relevant.
* Do not render unsanitized HTML.
* Avoid `dangerouslySetInnerHTML` unless explicitly required and safely sanitized.
* Do not construct redirects directly from untrusted input.
* Do not add dependencies with unclear necessity or security posture.

---

## 20. Dependencies

Do not add, remove, or upgrade a dependency without explicit approval.

Before proposing a new dependency:

1. Check whether the required capability already exists in the project.
2. Check whether the platform or standard library supports it.
3. Explain why an internal implementation would be insufficient.
4. Identify bundle-size or maintenance impact.
5. Limit the dependency to the smallest necessary scope.

Do not change lockfiles unless dependency changes are part of the task.

---

## 21. Testing

Follow the testing tools and conventions already configured.

Tests should cover behavior, not implementation details.

When fixing a bug:

1. Add or identify a test that reproduces the bug.
2. Implement the fix.
3. Verify the regression test passes.
4. Run related tests.

Prioritize tests for:

* Core business logic
* Boundary conditions
* Error paths
* Authentication and authorization
* Data transformation
* User-visible behavior
* Previously broken behavior

Do not create large snapshot tests for simple behavior.

Do not rewrite unrelated tests to make a change pass.

---

## 22. Comments and Documentation

Code should be understandable primarily through naming and structure.

Add comments only when they explain:

* Why a non-obvious decision exists
* A business rule
* A compatibility constraint
* A security consideration
* A workaround that cannot currently be removed

Do not add comments that repeat the code.

Avoid:

```ts
// Set loading to true
setIsLoading(true);
```

Prefer a meaningful explanation:

```ts
// Keep the previous result visible while refreshing to avoid layout shifts.
setIsRefreshing(true);
```

Do not generate large documentation files unless explicitly requested.

---

## 23. Refactoring Rules

Refactor only when required to complete the task safely or when explicitly requested.

A refactor must:

* Preserve behavior
* Have a clear purpose
* Remain within the task scope
* Include appropriate verification
* Avoid mixing unrelated cleanup with behavioral changes

When possible, separate refactoring from feature changes.

Do not introduce:

* Generic repositories without a demonstrated need
* Large service layers for trivial operations
* Wrapper functions with no meaningful abstraction
* Deep inheritance
* Premature design patterns
* New architectural layers for a single feature

Prefer direct and readable code over theoretical extensibility.

---

## 24. Git and Diff Hygiene

Before completing a task:

* Inspect the diff.
* Ensure only intended files changed.
* Remove generated files that should not be committed.
* Do not modify lockfiles without dependency changes.
* Do not reformat entire files for a small change.
* Do not include unrelated cleanup.
* Do not create commits unless explicitly requested.
* Do not force-push, reset, or rewrite history unless explicitly requested.

Never discard existing user changes.

When existing uncommitted changes are present, avoid overwriting them and clearly distinguish them from changes made during the current task.

---

## 25. Completion Response

Use a concise completion response.

Include:

### Changed

* List changed files.
* Describe the implemented behavior.

### Verified

* List commands actually executed.
* Report whether they passed or failed.

### Remaining concerns

* Mention unresolved assumptions, risks, or skipped checks.
* Omit this section when there are no remaining concerns.

Do not paste complete files into the completion response unless requested.

Do not provide a long explanation of obvious code changes.

---

## 26. Default Task Template

Interpret user requests using this structure:

```text
Goal:
The observable result the user wants.

Context:
Relevant files, routes, symbols, errors, and existing patterns.

Constraints:
Architecture, compatibility, dependency, scope, and behavior limits.

Done when:
Concrete acceptance criteria that can be verified.
```

When the request is missing minor details, infer them from nearby code and existing conventions.

When a missing detail materially changes architecture, security, data contracts, or user-visible behavior, ask one focused question before implementing.

---

## 27. Default Implementation Rules

Unless the user says otherwise:

* Use the existing architecture.
* Use the existing styling system.
* Use the existing test framework.
* Use the existing package manager.
* Make the smallest viable change.
* Do not add dependencies.
* Do not alter database or external API contracts.
* Do not refactor unrelated code.
* Preserve backward compatibility.
* Prefer Server Components.
* Keep client boundaries small.
* Run focused verification.
* Review the final diff.

---

## 28. Task-Specific Operating Modes

### Bug Fix

For bug fixes:

1. Reproduce or trace the failure.
2. Identify the root cause.
3. Make the smallest correction.
4. Add or update a regression test when practical.
5. Check adjacent code for the same defect pattern.
6. Do not apply speculative fallback logic.

### New Feature

For new features:

1. Find the nearest similar implementation.
2. Follow existing architecture and UI patterns.
3. Define observable behavior and edge cases.
4. Implement the smallest complete vertical slice.
5. Add focused tests.
6. Avoid building future requirements that were not requested.

### Refactor

For refactoring:

1. State the specific structural problem.
2. Preserve behavior.
3. Keep the refactor bounded.
4. Avoid combining it with unrelated features.
5. Verify existing tests before and after when possible.

### Performance Optimization

For performance work:

1. Identify the specific bottleneck.
2. Explain the expected improvement.
3. Preserve behavior.
4. Prefer measurable architectural changes.
5. Avoid speculative memoization.
6. Report trade-offs.

### Code Review

For code review:

Prioritize findings in this order:

1. Correctness
2. Security
3. Data integrity
4. Server/client boundary violations
5. Regressions
6. Performance
7. Maintainability
8. Style

Report actionable findings with exact file and symbol references.

Do not focus on cosmetic preferences when higher-impact issues exist.

---

## 29. Prohibited Shortcuts

Do not solve problems by:

* Using `any` broadly
* Disabling lint rules
* Ignoring TypeScript errors
* Suppressing build failures
* Adding unnecessary optional chaining
* Catching and ignoring errors
* Returning fake success responses
* Hardcoding production values
* Duplicating existing logic
* Adding dependencies for trivial functionality
* Moving server logic into the browser
* Weakening authentication or authorization
* Removing tests that expose a bug
* Changing expected behavior merely to make tests pass

---

## 30. Final Principle

Optimize for:

1. Correctness
2. Security
3. Simplicity
4. Consistency
5. Maintainability
6. Performance
7. Minimal token and context usage

The best solution is usually the smallest change that follows the existing project architecture, satisfies the acceptance criteria, and can be verified confidently.
