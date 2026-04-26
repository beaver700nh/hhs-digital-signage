import moment from 'moment'

import { lookupConfiguration, type EventsTypeSchema } from '@/data/api'
import * as Regex from './regex'

export type ScheduleHeader = {
	// e.g. 'A Day'
	type: 'normal'
	letter: string
} | {
	// e.g. 'D Day - Transition Day' or 'Half Day'
	type: 'special'
	letter?: string
	quirk: string
}

export type BellSchedule = {
	type: 'none'
} | {
	type: 'html'
	data: string
} | {
	type: 'text'
	data: string[]
} | {
	type: 'table'
	data: {
		start: string
		end: string
		name: string
	}[]
}

export type NextDaySchedule = {
	when: moment.Moment
	header: ScheduleHeader
	schedule?: BellSchedule
	hiatus?: {
		// e.g. false, ['PD Day']
		// e.g. true, []
		// e.g. true, ['PD Day', 'Spring Break]
		names: string[]
		weekend: boolean | 'summer'
	}
}

export default function parseSchedule(
	data: EventsTypeSchema & { success: true },
	verbose: boolean = false,
): NextDaySchedule | null {
	let nextDay: NextDaySchedule | null = null
	let hiatus = []

	// We need to find the first day of school in the list
	// We will also check if it's the last day before a hiatus

	for (const item of data.items) {
		const letter = item.summary.match(Regex.VALID_DAYS)?.[1]
		let quirk = item.summary.match(Regex.SPECIAL_DAYS)?.[0]?.toLowerCase()

		if (quirk == null)
			quirk = item.summary.match(Regex.SPECIAL_FALLBACK)?.[0]?.toLowerCase()

		// Skip if not a school day

		if (letter == null && quirk == null) {
			// We only save hiatus info after we've already found a school day
			nextDay != null && hiatus.push(item)
			continue
		}

		// Didn't skip, so it is a school day

		// If we haven't found a school day yet then we've found the first one
		if (nextDay == null) {
			nextDay = {
				when: moment(item.start.date),
				header: parseSchoolDay({ letter, quirk }),
				schedule: verbose ?
					parseBellSchedule(item.description) : null,
			} as NextDaySchedule

			// Go back and check if we will go on hiatus right after
			if (verbose)
				continue
			else
				break
		}

		// This is the second school day we've found
		// There was potentially a hiatus between the first and second day
		nextDay.hiatus = parseHiatus({
			dayBefore: nextDay.when!,
			dayAfter: moment(item.start.date),
			events: hiatus,
		})

		break
	}

	return nextDay
}

function parseSchoolDay({ letter, quirk }: {
	letter?: string
	quirk?: string
}): NextDaySchedule['header'] {
	if (quirk == null) {
		return {
			type: 'normal',
			letter: letter!, // letter is guaranteed to be defined if quirk is not
		}
	}

	const whyQuirk =
		quirk === 'exam' ? 'Exams' :
		quirk === 'transition' ? 'Transition Day' :
		quirk === 'last' ? 'Last Day of School' :
		quirk === 'half' ? 'Half Day' :
		quirk === '1/2' ? 'Half Day' :
		'Special Schedule'
	return {
		type: 'special',
		letter: letter,
		quirk: whyQuirk,
	}
}

function parseBellSchedule(description: string | undefined): BellSchedule {
	if (description == null || description.trim().length === 0) {
		return {
			type: 'none',
		}
	}

	const matches = [...description.matchAll(Regex.SUSPECTED_HTML)]

	try {
		if (matches.length === 0) {
			return {
				type: 'table',
				data: parseBellScheduleToTable(description),
			}
		}
		else if (lookupConfiguration('disableHtmlSchedule') == true) {
			const sanitized = decodePotentialHtml(description)
			return {
				type: 'text',
				data: parseBellScheduleToText(sanitized)
			}
		}
		else {
			return {
				type: 'html',
				data: description,
			}
		}
	}
	catch (error) {
		console.warn(`Couldn't interpret event description as bell schedule, falling back to plain text: ${(error as any).message}`)
		return {
			type: 'text',
			data: parseBellScheduleToText(description),
		}
	}
}

function decodePotentialHtml(description: string) {
	const doc = new DOMParser().parseFromString(description, 'text/html')
	const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null)

	let node
	let nodes = []
	while ((node = walker.nextNode()) != null)
		if (node.nodeValue != null)
			nodes.push(node.nodeValue)

	return nodes.join('\n')
}

function parseBellScheduleToTable(description: string) {
	const matches = [...description.matchAll(Regex.BELL_SCHEDULE)]

	if (matches.length === 0) {
		throw new Error('Bell schedule format could not be parsed.')
	}

	return matches.map(match => {
		if (match.length !== 7)
			throw new Error(`Failed to detect any information from schedule entry: ${match[0]}`)

		const [, startA, endA, nameA, nameB, startB, endB] = match

		if (nameA != null)
			return { name: nameA, start: startA, end: endA }
		else if (nameB != null)
			return { name: nameB, start: startB, end: endB }
		else
			throw new Error(`Failed to detect class name from schedule entry: ${match}`)
	})
}

function parseBellScheduleToText(description: string) {
	return description
		.split('\n')
		.map(line => line.replace(/\s+/g, ' ').trim())
		.filter(line => line.length > 0)
}

function parseHiatus({ dayBefore, dayAfter, events }: {
	dayBefore: moment.Moment
	dayAfter: moment.Moment
	events: (EventsTypeSchema & { success: true })['items']
}): NextDaySchedule['hiatus'] {
	// Is it Monday or later when we get back?
	const hiatusLength = dayAfter.diff(dayBefore, 'days')
	const crossedWeekend = (dayBefore.isoWeekday() + hiatusLength) >= 8

	if (!crossedWeekend && !events.length) {
		// We didn't event have a hiatus
		return undefined
	}

	let hiatus: NextDaySchedule['hiatus'] = {
		names: [],
		weekend: hiatusLength >= 21 ? 'summer' : crossedWeekend,
	}

	for (const event of events) {
		// Attempt to clean up name of hiatus event
		const match = event.summary.replace(Regex.NO_SCHOOL, '')
		const name = (match.match(Regex.VACATION)?.[1] ?? match)
			.trim()
			.toLocaleLowerCase()
			.split(/\s+/g)
			.map(word =>
				// word.length should never be zero
				word.length === 0 ? "" :
				word.charAt(0).toUpperCase() + word.slice(1)
			)
			.join(' ')

		// Normalize spelling and capitalization of PD Day
		hiatus.names.push(name.match(Regex.PD_DAY) ? 'PD Day' : name)
	}

	// Remove duplicates, e.g. December Vacation, Christmas, December Vacation again
	hiatus.names = [...new Set(hiatus.names)]

	return hiatus
}
