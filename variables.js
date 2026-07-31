export function getVariables() {
	return [
		{ variableId: 'fader', name: 'Master fader level (0.0 - 10.0)' },
		{ variableId: 'fader_raw', name: 'Master fader level raw (0 - 100, tenths)' },
		{ variableId: 'muted', name: 'Master mute state' },
		{ variableId: 'format', name: 'Current format name' },
		{ variableId: 'monitor_level', name: 'Monitor level (0 - 100)' },
		{ variableId: 'monitor_mute', name: 'Monitor mute state' },
		{ variableId: 'temp1', name: 'Temperature H331 board (°C)' },
		{ variableId: 'temp2', name: 'Temperature H332 board (°C)' },
		{ variableId: 'temp3', name: 'Temperature H335 board (°C)' },
		{ variableId: 'power', name: 'Power supply status (OK/FAULT)' },
		{ variableId: 'version', name: 'Device software version' },
		{ variableId: 'serial', name: 'Device serial number' },
	]
}
