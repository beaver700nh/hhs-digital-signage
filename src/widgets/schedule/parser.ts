import moment from 'moment'

import type { EventsType } from '@/google/api'
import * as Regex from './regex'

export type BellSchedule = (
	{
		start: string
		end: string
		name: string
	} | string
)[]

export type NextDaySchedule = {
	exists: false
} | {
	exists: true
	when: moment.Moment
	what: {
		// e.g. 'A Day'
		type: 'normal'
		letter: string
		description: BellSchedule
	} | {
		// e.g. 'D Day - Transition Day' or 'Half Day'
		type: 'special'
		letter?: string
		quirk: string
		description: BellSchedule
	}
	hiatus?: {
		// e.g. false, ['PD Day']
		// e.g. true, []
		// e.g. true, ['PD Day', 'Spring Break]
		names: string[]
		weekend: boolean | 'summer'
	}
}

export default function parseSchedule(data: EventsType & { success: true }): NextDaySchedule {
	let nextDay: NextDaySchedule = { exists: false }
	let hiatus = []

	// We need to find the first day of school in the list
	// We will also check if it's the last day before a hiatus

	for (const item of data.items) {
		const letter = item.summary.match(Regex.VALID_DAYS)?.[1]
		const quirk = item.summary.match(Regex.SPECIAL_DAYS)?.[0]?.toLowerCase()

		// Skip if not a school day

		if (letter == null && quirk == null) {
			// We only save hiatus info after we've already found a school day
			nextDay.exists && hiatus.push(item)
			continue
		}

		// Didn't skip, so it is a school day

		// If we haven't found a school day yet then we've found the first one
		if (!nextDay.exists) {
			nextDay = {
				exists: true,
				when: moment(item.start.date),
				what: parseSchoolDay({ letter, quirk }),
			}

			// Go back and check if we will go on hiatus right after
			continue
		}

		// This is the second school day we've found
		// There was potentially a hiatus between the first and second day
		nextDay.hiatus = parseHiatus({
			dayBefore: nextDay.when,
			dayAfter: moment(item.start.date),
			events: hiatus,
		})

		break
	}

	return nextDay
}

// TODO description
function parseSchoolDay({ letter, quirk }: {
	letter?: string
	quirk?: string
}): (NextDaySchedule & { exists: true })['what'] {
	if (quirk == null) {
		return {
			type: 'normal',
			letter: letter!, // letter is guaranteed to be defined if quirk is not
			description: [],
		}
	}

	const whyQuirk =
		quirk === 'exam' ? 'Exams' :
		quirk === 'transition' ? 'Transition Day' :
		quirk === 'last' ? 'Last Day of School' :
		quirk === 'half' ? 'Half Day' :
		quirk === '1/2' ? 'Half Day' :
		'Special Schedule';
	return {
		type: 'special',
		letter: letter,
		quirk: whyQuirk,
		description: [],
	}
}

function parseHiatus({ dayBefore, dayAfter, events }: {
	dayBefore: moment.Moment
	dayAfter: moment.Moment
	events: (EventsType & { success: true })['items']
}): (NextDaySchedule & { exists: true })['hiatus'] {
	// Is it Monday or later when we get back?
	const hiatusLength = dayAfter.diff(dayBefore, 'days')
	const crossedWeekend = (dayBefore.isoWeekday() + hiatusLength) >= 8

	if (!crossedWeekend && !events.length) {
		// We didn't event have a hiatus
		return undefined
	}

	let hiatus: (NextDaySchedule & { exists: true })['hiatus'] = {
		names: [],
		weekend: hiatusLength >= 21 ? 'summer' : crossedWeekend,
	}

	for (const event of events) {
		// Attempt to clean up name of hiatus event
		const match = event.summary.match(Regex.NO_SCHOOL)?.[1] ?? event.summary
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

		hiatus.names.push(name)
	}

	return hiatus
}
