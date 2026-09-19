# Security Policy

## Supported versions

Only the most recent release of this module receives fixes.

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| < 2.0   | No        |

## Reporting a vulnerability

Please do **not** open a public issue for security problems.

Use GitHub's private vulnerability reporting instead:
**Security → Report a vulnerability** on
<https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/security>.

Include the module version, the Companion version, and the steps needed to
reproduce the problem. You can expect an initial response within 14 days.

## Scope

This module talks to a Datasat AP20/AP25 over plain TCP on port 14500. The
Datasat Remote Command API offers no transport encryption, and NetCmd/Setup
passwords are sent in the clear by design of the device protocol. Keep the
processor on a trusted, isolated control network.

Reports about that protocol limitation itself belong with Datasat, not here.
Reports about how this module stores, logs, or leaks credentials are in scope.
