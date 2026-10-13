# Security Policy

## Reporting a vulnerability

Please **do not open a public issue** for security vulnerabilities.

Report them through [GitHub private vulnerability reporting](https://github.com/kromm-solutions/ui/security/advisories/new). You will get an acknowledgment within 72 hours and a status update at least every 7 days until resolution.

## Scope

This project distributes source files (components, hooks, themes, fonts) that consumers install into their own applications via the shadcn CLI. We treat the following as in scope:

- The registry build and distribution pipeline (`scripts/`, `public/r/` output served at `ui.kromm.io`)
- The documentation site and its API/agent-discovery endpoints
- Vulnerabilities in shipped component source that would execute in a consumer's app (XSS, injection, unsafe defaults)

Dependency vulnerabilities are tracked through `pnpm audit`; please still report them if you believe the maintainers are not aware.

## Supported versions

Only the latest release line is supported while the project is in `0.x`:

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |
| older   | ❌        |
