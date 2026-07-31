export function getVariables() {
	return [
		{ variableId: 'fader', name: 'Master fader level (0.0 - 10.0)' },
		{ variableId: 'fader_raw', name: 'Master fader level raw (0 - 100, tenths)' },
		{ variableId: 'muted', name: 'Master mute state' },
		{ variableId: 'format', name: 'Current format name' },
		{ variableId: 'monitor_level', name: 'Monitor level (0 - 100)' },
		{ variableId: 'monitor_mute', name: 'Monitor mute state' },
		{ variableId: 'version', name: 'Device software version' },
		{ variableId: 'serial', name: 'Device serial number' },
	]
}
