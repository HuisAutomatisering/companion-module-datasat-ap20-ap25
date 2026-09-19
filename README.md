# companion-module-datasat-ap20-ap25

[![Companion Module Checks](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/companion-module-checks.yaml/badge.svg)](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/companion-module-checks.yaml)
[![CodeQL](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/codeql.yml/badge.svg)](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A [Bitfocus Companion](https://bitfocus.io/companion) module to control the
**Datasat AP20 and AP25** cinema audio processors over Ethernet (TCP port 14500).

Implements the Datasat Remote Command API (document TN-H413 rev D).

## Features

- Master fader control (absolute + relative), master mute
- Format selection with feedback
- Macro execution
- Monitor level and monitor mute
- Power ON / Standby via configurable macro names
- Board temperatures and power-supply health monitoring
- Password authentication (NetCmd / Setup)
- Status polling so buttons stay in sync with changes made on the device
- Presets for common buttons (mute toggle, volume up/down, reference level 7.0)
- Custom command action for anything else in the API

## Installation

### From a release

1. Download `pkg.tgz` from the [latest release](https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25/releases).
2. Extract it into your Companion developer modules folder.
3. In Companion, go to **Settings > Developer** and point the developer modules
   path at the folder *containing* the extracted module folder.
4. Add a new connection and search for "Datasat".

### From source

1. Install [Node.js 22](https://nodejs.org/) and enable corepack: `corepack enable`
2. Clone this repository into your Companion developer modules folder:

   ```
   git clone https://github.com/HuisAutomatisering/companion-module-datasat-ap20-ap25.git
   cd companion-module-datasat-ap20-ap25
   yarn install
   ```

3. In Companion, go to **Settings > Developer** and set the developer modules
   path to the folder *containing* this repo.
4. Add a new connection and search for "Datasat".

## Device setup

- Connect the AP20/AP25 Ethernet port to your network and note the IP address
  (Network screen on the device).
- If a NetCmd or Setup password is set under *System > Access Control*, enter it
  in the module config.

## Development

```
yarn install    # install dependencies
yarn check      # validate companion/manifest.json and the module definitions
yarn format     # apply prettier formatting
yarn package    # build pkg.tgz for distribution
```

Every push runs the shared Bitfocus module checks, the same validation used by
the official Companion module library, plus a CodeQL analysis.

## Documentation

See [companion/HELP.md](companion/HELP.md) for the in-app help text with all
actions, feedbacks, variables and presets.

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

This module is not affiliated with Datasat Digital Entertainment. Datasat, AP20
and AP25 are trademarks of their respective owners.
