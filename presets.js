import { combineRgb } from '@companion-module/base'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const RED = combineRgb(200, 0, 0)
const GREEN = combineRgb(0, 120, 0)
const ORANGE = combineRgb(255, 102, 0)
const AMBER = combineRgb(200, 120, 0)
const BLUE = combineRgb(0, 70, 160)

/** A button that reacts on button down only, with white text on black. */
function button(category, name, text, size, down, feedbacks = []) {
	return {
		type: 'button',
		category,
		name,
		style: { text, size, color: WHITE, bgcolor: BLACK },
		steps: [{ down, up: [] }],
		feedbacks,
	}
}

export function getPresets(self) {
	const presets = {}
	// Variables are addressed with the label of this connection
	const label = self.label ?? 'ap2x'

	// Level
	presets['muteToggle'] = button(
		'Level',
		'Mute Toggle',
		`MUTE\n$(${label}:fader)`,
		'18',
		[{ actionId: 'mute', options: { mode: 'toggle' } }],
		[{ feedbackId: 'muted', options: {}, style: { bgcolor: RED, color: WHITE } }],
	)

	presets['faderUp'] = button('Level', 'Fader +0.5', 'VOL\n+', '24', [
		{ actionId: 'faderRelative', options: { delta: 0.5 } },
	])

	presets['faderDown'] = button('Level', 'Fader -0.5', 'VOL\n-', '24', [
		{ actionId: 'faderRelative', options: { delta: -0.5 } },
	])

	presets['fader70'] = button(
		'Level',
		'Fader 7.0 (reference)',
		'REF\n7.0',
		'18',
		[{ actionId: 'setFader', options: { level: 7.0 } }],
		[{ feedbackId: 'faderLevel', options: { comparison: 'eq', level: 7.0 }, style: { bgcolor: GREEN, color: WHITE } }],
	)

	// Monitor
	presets['monitorMuteToggle'] = button(
		'Monitor',
		'Monitor Mute Toggle',
		'MON\nMUTE',
		'18',
		[{ actionId: 'monitorMute', options: { mode: 'toggle' } }],
		[{ feedbackId: 'monitorMute', options: {}, style: { bgcolor: RED, color: WHITE } }],
	)

	// Power
	presets['powerOn'] = button(
		'Power',
		'Power ON',
		'AP20\nON',
		'18',
		[{ actionId: 'powerOn', options: {} }],
		[
			{ feedbackId: 'powerState', options: { state: 'on' }, style: { bgcolor: GREEN, color: WHITE } },
			{
				feedbackId: 'powerState',
				options: { state: 'starting' },
				style: { bgcolor: AMBER, color: BLACK, text: 'AP20\nSTARTING' },
			},
			{
				feedbackId: 'powerFault',
				options: { board: 'any' },
				style: { bgcolor: ORANGE, color: BLACK, text: 'PWR\nFAULT' },
			},
		],
	)

	presets['standby'] = button(
		'Power',
		'Standby',
		'AP20\nSTBY',
		'18',
		[{ actionId: 'standby', options: {} }],
		[{ feedbackId: 'powerState', options: { state: 'standby' }, style: { bgcolor: BLUE, color: WHITE } }],
	)

	presets['powerToggle'] = button(
		'Power',
		'Power Toggle',
		`AP20\n$(${label}:power_state)`,
		'18',
		[{ actionId: 'powerToggle', options: {} }],
		[
			{ feedbackId: 'powerState', options: { state: 'on' }, style: { bgcolor: GREEN, color: WHITE } },
			{ feedbackId: 'powerState', options: { state: 'starting' }, style: { bgcolor: AMBER, color: BLACK } },
			{ feedbackId: 'powerState', options: { state: 'standby' }, style: { bgcolor: BLUE, color: WHITE } },
		],
	)

	// Display
	presets['screenWake'] = button('Display', 'Wake display', 'WAKE\nDISPLAY', '14', [
		{ actionId: 'screensaver', options: { mode: 'wake' } },
	])

	presets['screenSaver'] = button('Display', 'Activate screensaver', 'SCREEN\nSAVER', '14', [
		{ actionId: 'screensaver', options: { mode: 'activate' } },
	])

	// Health
	presets['supplyStatus'] = {
		type: 'button',
		category: 'Health',
		name: 'Supply voltage status',
		style: { text: `SUPPLY\n$(${label}:power)`, size: '14', color: WHITE, bgcolor: BLACK },
		steps: [{ down: [], up: [] }],
		feedbacks: [{ feedbackId: 'powerFault', options: { board: 'any' }, style: { bgcolor: ORANGE, color: BLACK } }],
	}

	presets['phantomStatus'] = {
		type: 'button',
		category: 'Health',
		name: 'Phantom power status',
		style: { text: `PHANTOM\n$(${label}:phantom)`, size: '14', color: WHITE, bgcolor: BLACK },
		steps: [{ down: [], up: [] }],
		feedbacks: [{ feedbackId: 'phantomOn', options: {}, style: { bgcolor: AMBER, color: BLACK } }],
	}

	presets['temperatures'] = {
		type: 'button',
		category: 'Health',
		name: 'Board temperatures',
		style: {
			text: `$(${label}:temp1) $(${label}:temp2) $(${label}:temp3)\n°C`,
			size: '14',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [{ down: [], up: [] }],
		feedbacks: [],
	}

	// Formats: one button per format the unit reported
	if (self.formats.length > 0) {
		self.formats.forEach((format, index) => {
			presets[`format_${index}`] = button(
				'Formats',
				`Format: ${format}`,
				format,
				'auto',
				[{ actionId: 'setFormat', options: { format } }],
				[{ feedbackId: 'format', options: { format }, style: { bgcolor: GREEN, color: WHITE } }],
			)
		})
	} else {
		presets['formatDigitalCinema'] = button(
			'Formats',
			'Format: Digital Cinema',
			'Digital\nCinema',
			'14',
			[{ actionId: 'setFormat', options: { format: 'Digital Cinema' } }],
			[{ feedbackId: 'format', options: { format: 'Digital Cinema' }, style: { bgcolor: GREEN, color: WHITE } }],
		)
	}

	// Macros: one button per macro the unit reported
	self.macros.forEach((macro, index) => {
		presets[`macro_${index}`] = button('Macros', `Macro: ${macro}`, macro, 'auto', [
			{ actionId: 'runMacro', options: { macro } },
		])
	})

	return presets
}
