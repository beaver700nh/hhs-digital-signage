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

// TODO handle case where the initial request itself fails
export default function parseSchedule(data: EventsType): NextDaySchedule {
	let nextDay: NextDaySchedule = { exists: false }
	let hiatus = []

	// We need to find the first day of school in the list
	// We will also check if it's the last day before a hiatus

	console.log(data.items)

	for (const item of data.items) {
		const letter = item.summary.match(Regex.VALID_DAYS)?.[1]
		const quirk = item.summary.match(Regex.SPECIAL_DAYS)?.[0]?.toLowerCase()

		// console.log(`item ${item.summary} letter ${letter} quirk ${quirk}`)
		if (letter == null && quirk == null) {
			// We only save hiatus info after we've already found a school day
			nextDay.exists && hiatus.push(item)
			continue
		}

		// If we got to this point that means this is a school day

		if (!nextDay.exists) {
			// This is the first school day - parse it!
			nextDay = {
				exists: true,
				when: moment(item.start.date),
				what: parseLetter({ letter, quirk }),
			}

			// Go back and check if we will go on hiatus right after
			continue
		}

		// This the end of the potential hiatus - parse it if there was one
		nextDay.hiatus = {
			names: [],
			weekend: false,
		}

		for (const event of hiatus) {
			const match = event.summary.match(Regex.NO_SCHOOL)?.[1] ?? event.summary
			const name = (match.match(Regex.VACATION)?.[1] ?? match)
				.trim()
				.replace(/\s{2,}/g, ' ')
				.toLocaleLowerCase()
				.split(' ')
				.map(word =>
					word.length === 0 ? "" :
					word.charAt(0).toUpperCase() + word.slice(1)
				)
				.join(' ')

			nextDay.hiatus.names.push(name)
		}

		// We know it crossed the weekend if it takes us to next Monday or later
		const hiatusLength = moment(item.start.date).diff(nextDay.when, 'days')
		nextDay.hiatus.weekend = (nextDay.when.isoWeekday() + hiatusLength) >= 8

		if (hiatusLength >= 21)
			nextDay.hiatus.weekend = 'summer'

		// If it didn't and there weren't even any days off, this was not a hiatus
		if (!nextDay.hiatus.weekend && nextDay.hiatus.names.length === 0) {
			nextDay.hiatus = undefined
		}

		break;
	}

	return nextDay;
}

// TODO description
function parseLetter({ letter, quirk }: {
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
