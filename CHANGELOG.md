# Changelog

All notable changes to this module are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Shared Bitfocus module checks on every push, via the reusable
  `bitfocus/actions` workflow. Each run also uploads a built `pkg.tgz`.
- CodeQL analysis workflow, weekly and on every push to `main`.
- Dependabot configuration for GitHub Actions and npm dependencies (monthly).
- Issue and pull request templates.
- `SECURITY.md` with a private vulnerability reporting route.
- `Brand/` folder for optional, self-supplied logo assets.
- `yarn check` script for local manifest validation.

### Changed

- Pinned the package manager to Yarn 4 via corepack.
- Raised the `@companion-module/tools` floor to `^2.8.0`, the minimum the
  Bitfocus checks accept.

## [2.0.0]

### Added

- Power ON and Standby actions, driven by configurable macro names.
- Board temperature variables and power-supply health monitoring, with a
  feedback for power faults.
- Monitor level and monitor mute actions.
- Custom command action for anything not covered by a dedicated action.
- Presets for mute toggle, volume up/down and reference level 7.0.

### Changed

- Status polling keeps button feedback in sync with changes made on the device
  front panel.

## [1.0.0]

- Initial release: master fader, master mute, format selection and macro
  execution over TCP port 14500.
