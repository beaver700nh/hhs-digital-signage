import moment from 'moment'

import type { EventsType } from '@/google/api'
import * as Regex from './regex'

export type BellSchedule = string[] | {
	start: string
	end: string
	name: string
}[]

export type NextDaySchedule = {
	exists: false
} | {
	exists: true
	when: moment.Moment
	what: {
		// e.g. 'A Day'
		type: 'normal'
		letter: string
		schedule: BellSchedule
	} | {
		// e.g. 'D Day - Transition Day' or 'Half Day'
		type: 'special'
		letter?: string
		quirk: string
		schedule: BellSchedule
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
				what: parseSchoolDay({ letter, quirk, description: item.description }),
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

function parseSchoolDay({ letter, quirk, description }: {
	letter?: string
	quirk?: string
	description: string
}): (NextDaySchedule & { exists: true })['what'] {
	const schedule = parseBellSchedule(description)

	if (quirk == null) {
		return {
			type: 'normal',
			letter: letter!, // letter is guaranteed to be defined if quirk is not
			schedule,
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
		schedule,
	}
}

function parseBellSchedule(description: string): BellSchedule {
	const sanitized = decodePotentialHtml(description)

	try {
		return parseBellScheduleToTable(sanitized)
	}
	catch (error) {
		console.warn(`Couldn't interpret event description as bell schedule, falling back to plain text: ${(error as any).message}`)
		return parseBellScheduleToText(sanitized)
	}
}

function decodePotentialHtml(description: string) {
  const matches = [...description.matchAll(Regex.SUSPECTED_HTML)];

  if (matches.length === 0) {
    return description;
  }

  const doc = new DOMParser().parseFromString(description, "text/html");
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

  let node;
  let nodes = [];
  while ((node = walker.nextNode()) != null)
    nodes.push(node.nodeValue);

  return nodes.join("\n");
}

function parseBellScheduleToTable(description: string) {
  const matches = [...description.matchAll(Regex.BELL_SCHEDULE)];

  if (matches.length === 0) {
    throw new Error("Bell schedule format could not be parsed.");
  }

  return matches.map(match => {
    if (match.length !== 7)
      throw new Error(`Failed to detect any information from schedule entry: ${match[0]}`);

    const [, startA, endA, nameA, nameB, startB, endB] = match;

    if (nameA != null)
      return { name: nameA, start: startA, end: endA };
    else if (nameB != null)
      return { name: nameB, start: startB, end: endB };
    else
      throw new Error(`Failed to detect class name from schedule entry: ${match}`);
  });
}

function parseBellScheduleToText(description: string) {
  return description
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
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
