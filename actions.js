/**
 * A dropdown filled with the names the unit reported, or a plain text field when the unit
 * cannot list them. The dropdown also accepts a typed name, e.g. one that was added after loading.
 */
export function nameOption(names, id, label, fallbackDefault, useVariables = true) {
	if (names.length > 0) {
		return {
			type: 'dropdown',
			id,
			label,
			default: names[0],
			choices: names.map((name) => ({ id: name, label: name })),
			allowCustom: true,
		}
	}
	return {
		type: 'textinput',
		id,
		label: `${label} (must match exactly, spaces allowed)`,
		default: fallbackDefault,
		useVariables,
	}
}

export function getActions(self) {
	return {
		setFader: {
			name: 'Set Master Fader Level',
			options: [
				{
					type: 'number',
					id: 'level',
					label: 'Level (0.0 - 10.0)',
					default: 7.0,
					min: 0,
					max: 10,
					step: 0.1,
					range: true,
				},
			],
			callback: (action) => {
				const tenths = Math.round(action.options.level * 10)
				self.sendCommand(`FADER ${tenths}`)
			},
		},

		faderRelative: {
			name: 'Adjust Master Fader (relative)',
			options: [
				{
					type: 'number',
					id: 'delta',
					label: 'Change (+/- in 0.1 steps, e.g. 0.5 or -0.5)',
					default: 0.5,
					min: -10,
					max: 10,
					step: 0.1,
				},
			],
			callback: (action) => {
				let target = self.state.fader + Math.round(action.options.delta * 10)
				target = Math.max(0, Math.min(100, target))
				self.sendCommand(`FADER ${target}`)
			},
		},

		mute: {
			name: 'Master Mute',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					default: 'toggle',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: (action) => {
				if (action.options.mode === 'toggle') {
					self.sendCommand(`MUTED ${self.state.muted ? 0 : 1}`)
				} else {
					self.sendCommand(`MUTED ${action.options.mode}`)
				}
			},
		},

		setFormat: {
			name: 'Select Format',
			options: [nameOption(self.formats, 'format', 'Format', 'Digital Cinema')],
			callback: async (action, context) => {
				const format = await context.parseVariablesInString(String(action.options.format))
				self.sendCommand(`FORMAT ${format}`)
			},
		},

		runMacro: {
			name: 'Run Macro',
			options: [nameOption(self.macros, 'macro', 'Macro', '')],
			callback: async (action, context) => {
				const macro = await context.parseVariablesInString(String(action.options.macro))
				self.sendCommand(`RUNMACRO ${macro}`)
			},
		},

		setMonitorLevel: {
			name: 'Set Monitor Level',
			options: [
				{
					type: 'number',
					id: 'level',
					label: 'Level (0 - 100)',
					default: 70,
					min: 0,
					max: 100,
					range: true,
				},
			],
			callback: (action) => {
				self.sendCommand(`MONITORLEVEL ${action.options.level}`)
			},
		},

		monitorMute: {
			name: 'Monitor Mute',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					default: 'toggle',
					choices: [
						{ id: '1', label: 'Mute' },
						{ id: '0', label: 'Unmute' },
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: (action) => {
				if (action.options.mode === 'toggle') {
					self.sendCommand(`MONITORMUTE ${self.state.monitorMute ? 0 : 1}`)
				} else {
					self.sendCommand(`MONITORMUTE ${action.options.mode}`)
				}
			},
		},

		powerOn: {
			name: 'Power ON',
			options: [],
			callback: () => {
				self.setPower(true)
			},
		},

		standby: {
			name: 'Standby',
			options: [],
			callback: () => {
				self.setPower(false)
			},
		},

		powerToggle: {
			name: 'Power Toggle (ON / Standby)',
			options: [],
			callback: () => {
				self.setPower(self.state.power !== 1)
			},
		},

		screensaver: {
			name: 'Screensaver',
			options: [
				{
					type: 'dropdown',
					id: 'mode',
					label: 'Mode',
					default: 'wake',
					choices: [
						{ id: 'wake', label: 'Wake the display (deactivate screensaver)' },
						{ id: 'activate', label: 'Activate screensaver' },
					],
				},
			],
			callback: (action) => {
				// Per TN-H413-01: SCR ON deactivates the screensaver, SCR OFF shows it.
				self.sendCommand(`SCR ${action.options.mode === 'activate' ? 'OFF' : 'ON'}`)
			},
		},

		gpioPulse: {
			name: 'GPIO Pulse (250 ms)',
			options: [
				{
					type: 'number',
					id: 'gpio',
					label: 'GPIO number (1 - 21)',
					default: 1,
					min: 1,
					max: 21,
					step: 1,
				},
			],
			callback: (action) => {
				const gpio = Math.round(Number(action.options.gpio))
				if (gpio >= 1 && gpio <= 21) self.sendCommand(`PULSE ${gpio}`)
			},
		},

		customCommand: {
			name: 'Send Custom Command',
			options: [
				{
					type: 'textinput',
					id: 'command',
					label: "Command without leading '@' or trailing CR (e.g. HEALTH TEMPERATURE)",
					default: '',
					useVariables: true,
				},
			],
			callback: async (action, context) => {
				const cmd = await context.parseVariablesInString(action.options.command)
				// The answer is written to the Companion log, handy for trying out commands
				if (cmd.length > 0) self.sendCommand(cmd, { logResponse: true })
			},
		},
	}
}
