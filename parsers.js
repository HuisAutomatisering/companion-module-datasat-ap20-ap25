/**
 * Pure helpers for parsing AP20/AP25 responses (TN-H413 rev D plus the
 * RS20i commands that real AP20/AP25 units also accept).
 * Kept free of Companion dependencies so they are easy to reason about.
 */

export const BOARDS = ['H331', 'H332', 'H335', 'H336', 'H338']

/** Commands whose answer is a bare comma separated list without a command echo. */
const LIST_COMMANDS = new Set(['FORMATNAMES', 'MACRONAMES'])

/** Keywords that identify an ordinary, echoed status line (never a name list). */
const STATUS_LINE = /^(FADER|MUTED|MONITORLEVEL|MONITORMUTE|POWER|HEALTH|AUTH|SERIALNO)\s/

export function commandKeyword(cmd) {
	return cmd.trim().split(/\s+/)[0].toUpperCase()
}

export function isListCommand(cmd) {
	return LIST_COMMANDS.has(commandKeyword(cmd))
}

/**
 * Some units echo the command name in front of the list ("FORMATNAMES A,B,C"), others do not ("A,B,C").
 * An empty list comes back as the bare command name. Remove the echo when it is there.
 */
export function stripListPrefix(cmd, text) {
	const keyword = commandKeyword(cmd)
	const upper = text.toUpperCase()
	if (upper === keyword) return ''
	if (upper.startsWith(`${keyword} `)) return text.slice(keyword.length + 1)
	return text
}

/**
 * "A,B,C" -> ['A', 'B', 'C']. Empty entries (a trailing comma) are dropped.
 * Names are kept exactly as the unit reports them, including a trailing space, because the unit
 * has to recognise the name again when it is sent back. Only leading spaces are removed.
 */
export function parseNameList(text) {
	return text
		.split(',')
		.map((name) => name.replace(/^\s+/, ''))
		.filter((name) => name.trim().length > 0)
}

/**
 * True when a response to a *Names command is a real list: the device answered,
 * did not say BadCommand / SECERR / ERR, and the answer is not a stray status line.
 * An empty answer is a valid (empty) list.
 */
export function isValidListResponse(res) {
	if (res === null || res === undefined) return false
	const text = res.text
	if (/^(BadCommand|SECERR|ERR)\b/i.test(text)) return false
	if (STATUS_LINE.test(text)) return false
	return true
}

export function isBadCommand(res) {
	return res !== null && res !== undefined && /^BadCommand/i.test(res.text)
}

/** "1" -> 1, "0" -> 0, anything else -> null */
export function parseBinary(value) {
	const trimmed = String(value).trim()
	if (trimmed === '1') return 1
	if (trimmed === '0') return 0
	return null
}

/**
 * Parse the part of a HEALTH response after the "HEALTH " prefix.
 *   "TEMPERATURE 34,29,25"
 *   "H331VOLTS 1,3.18,4.99,15.0,-15.0-,-5.0"
 *   "H332VOLTS NA"
 *   "H336VOLTS 1,3.39,5.10,15.0,-14.4,0.0,1"   (... <48V phantom>,<vcpu>)
 * Returns null for anything that is not understood.
 */
export function parseHealth(value) {
	const match = /^(\S+)\s+(.*)$/.exec(value.trim())
	if (!match) return null

	const sub = match[1].toUpperCase()
	const rest = match[2].trim()

	if (sub === 'TEMPERATURE') {
		const temps = rest.split(',').map((t) => t.trim())
		return { kind: 'temperature', temps }
	}

	const volts = /^(H\d{3})VOLTS$/.exec(sub)
	if (!volts) return null

	const board = volts[1]
	if (rest.toUpperCase() === 'NA') {
		return { kind: 'volts', board, present: false, ok: null, phantomOn: null, cpuOk: null }
	}

	const fields = rest.split(',').map((f) => f.trim())
	const vok = parseBinary(fields[0])
	const result = {
		kind: 'volts',
		board,
		present: true,
		ok: vok === null ? null : vok === 1,
		phantomOn: null,
		cpuOk: null,
	}

	if (board === 'H336') {
		// <vok>,<ref>,<+5V>,<+15V>,<-15V>,<48V>,<vcpu>
		const phantom = parseFloat(fields[5])
		if (!Number.isNaN(phantom)) result.phantomOn = phantom > 1
		const cpu = parseBinary(fields[6] ?? '')
		if (cpu !== null) result.cpuOk = cpu === 1
	}

	return result
}
