import { InstanceBase, InstanceStatus, TCPHelper, Regex, runEntrypoint } from '@companion-module/base'
import { getActions } from './actions.js'
import { getFeedbacks } from './feedbacks.js'
import { getVariables } from './variables.js'
import { getPresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'

const AP20_PORT = 14500

class DatasatAP20Instance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.socket = null
		this.pollTimer = null
		this.rxBuffer = ''

		// Last known device state
		this.state = {
			fader: 0, // in tenths (0-100), e.g. 70 = 7.0
			muted: 0,
			format: '',
			monitorLevel: 0,
			monitorMute: 0,
			version: '',
			serial: '',
		}
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		this.setActionDefinitions(getActions(this))
		this.setFeedbackDefinitions(getFeedbacks(this))
		this.setVariableDefinitions(getVariables())
		this.setPresetDefinitions(getPresets(this))

		this.initConnection()
	}

	async configUpdated(config) {
		this.config = config
		this.initConnection()
	}

	async destroy() {
		this.stopPolling()
		if (this.socket) {
			this.socket.destroy()
			this.socket = null
		}
	}

	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'AP20/AP25 IP Address',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'NetCmd / Setup Password (leave empty if none)',
				width: 8,
				default: '',
			},
			{
				type: 'number',
				id: 'pollInterval',
				label: 'Status poll interval (ms, 0 = disable polling)',
				width: 8,
				default: 2000,
				min: 0,
				max: 60000,
			},
		]
	}

	initConnection() {
		this.stopPolling()

		if (this.socket) {
			this.socket.destroy()
			this.socket = null
		}

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'No IP address configured')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		this.socket = new TCPHelper(this.config.host, AP20_PORT)

		this.socket.on('status_change', (status, message) => {
			this.log('debug', `Socket status: ${status} ${message ?? ''}`)
		})

		this.socket.on('error', (err) => {
			this.log('error', `Network error: ${err.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.stopPolling()
		})

		this.socket.on('connect', () => {
			this.log('info', `Connected to AP20/AP25 at ${this.config.host}:${AP20_PORT}`)
			this.updateStatus(InstanceStatus.Ok)
			this.rxBuffer = ''

			// Authenticate if a password is configured (valid for the duration of this TCP connection)
			if (this.config.password && this.config.password.length > 0) {
				this.sendCommand(`AUTH ${this.config.password}`)
			}

			// Get some one-time info and an initial state snapshot
			this.sendCommand('SYSTEM')
			this.sendCommand('SERIALNO')
			this.pollState()

			this.startPolling()
		})

		this.socket.on('data', (chunk) => {
			this.processData(chunk.toString())
		})
	}

	startPolling() {
		const interval = Number(this.config.pollInterval)
		if (!interval || interval <= 0) return

		this.pollTimer = setInterval(() => {
			this.pollState()
		}, interval)
	}

	stopPolling() {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	pollState() {
		this.sendCommand('FADER')
		this.sendCommand('MUTED')
		this.sendCommand('FORMAT')
		this.sendCommand('MONITORLEVEL')
		this.sendCommand('MONITORMUTE')
	}

	/**
	 * Send a command to the AP20/AP25.
	 * Protocol: '@' + COMMAND [args] + <CR>  (TN-H413 rev D)
	 */
	sendCommand(cmd) {
		if (this.socket && this.socket.isConnected) {
			this.log('debug', `TX: @${cmd}`)
			this.socket.send(`@${cmd}\r`)
		} else {
			this.log('warn', `Not connected, cannot send: ${cmd}`)
		}
	}

	/**
	 * Responses are ASCII terminated by <CR>. SYSTEM uses <LF> between fields,
	 * so we split on CR and tolerate stray LFs.
	 */
	processData(data) {
		this.rxBuffer += data

		let idx
		while ((idx = this.rxBuffer.indexOf('\r')) >= 0) {
			const line = this.rxBuffer.slice(0, idx)
			this.rxBuffer = this.rxBuffer.slice(idx + 1)

			// SYSTEM response contains LF-separated subfields
			for (const part of line.split('\n')) {
				const clean = part.replace(/\0/g, '').trim()
				if (clean.length > 0) this.parseResponse(clean)
			}
		}
	}

	parseResponse(line) {
		this.log('debug', `RX: ${line}`)

		const spaceIdx = line.indexOf(' ')
		const keyword = spaceIdx >= 0 ? line.slice(0, spaceIdx) : line
		const value = spaceIdx >= 0 ? line.slice(spaceIdx + 1).trim() : ''

		switch (keyword) {
			case 'AUTH':
				if (value === 'SECERR') {
					this.log('error', 'Authentication failed (SECERR) - check the password in the module config')
					this.updateStatus(InstanceStatus.AuthenticationFailure, 'Wrong password')
				} else {
					this.log('info', `Authenticated with ${value} level`)
					this.updateStatus(InstanceStatus.Ok)
				}
				break

			case 'SECERR':
				this.log('warn', 'Command rejected (SECERR) - a password is required. Set it in the module config.')
				this.updateStatus(InstanceStatus.AuthenticationFailure, 'Password required')
				break

			case 'FADER': {
				const lvl = parseInt(value, 10)
				if (!isNaN(lvl)) {
					this.state.fader = lvl
					this.setVariableValues({ fader: (lvl / 10).toFixed(1), fader_raw: lvl })
					this.checkFeedbacks('faderLevel')
				}
				break
			}

			case 'MUTED': {
				const m = parseInt(value, 10)
				if (!isNaN(m)) {
					this.state.muted = m
					this.setVariableValues({ muted: m ? 'Muted' : 'Unmuted' })
					this.checkFeedbacks('muted')
				}
				break
			}

			case 'FORMAT':
				this.state.format = value
				this.setVariableValues({ format: value })
				this.checkFeedbacks('format')
				break

			case 'MONITORLEVEL': {
				const lvl = parseInt(value, 10)
				if (!isNaN(lvl)) {
					this.state.monitorLevel = lvl
					this.setVariableValues({ monitor_level: lvl })
				}
				break
			}

			case 'MONITORMUTE': {
				const m = parseInt(value, 10)
				if (!isNaN(m)) {
					this.state.monitorMute = m
					this.setVariableValues({ monitor_mute: m ? 'Muted' : 'Unmuted' })
					this.checkFeedbacks('monitorMute')
				}
				break
			}

			case 'VER':
				this.state.version = value
				this.setVariableValues({ version: value })
				break

			case 'SERIALNO':
				this.state.serial = value
				this.setVariableValues({ serial: value })
				break

			case 'OK':
				// Macro executed successfully
				break

			case 'ERR':
				this.log('warn', `Device returned error: ${line}`)
				break

			default:
				// VERDATE, MAC, HEALTH, BOARDINFO etc. - log only
				break
		}
	}
}

runEntrypoint(DatasatAP20Instance, UpgradeScripts)
